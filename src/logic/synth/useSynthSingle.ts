import { useMemo, useRef } from "react";
import type { TStopOptions, TSynthOptions } from "./types";
import { resolveMidi } from "./resolvers";
import { useContext } from "@state/Context";
import { isWritableOscillatorType } from "./guards";

type TRef = {
  isPlaying: boolean;
  oscillatorNode?: OscillatorNode;
  gainNode?: GainNode;
};

type TCreateRef = {
  createOscillatorNode: () => OscillatorNode;
  createGainNode: () => GainNode;
};

export const useSynthSingle = (
  options: TSynthOptions = {},
) => {
  const { context, master } = useContext();
  const { type, midi, frequency, detune, gain } = options;

  const optionsRef = useRef<TSynthOptions>(options);
  optionsRef.current = options;

  const currentRef = useRef<TRef>({
    isPlaying: false,
  });

  const createOscillatorNode = useMemo(() => {
    const handler = () => {
      return new OscillatorNode(context, {
        type,
        frequency: resolveMidi({ midi, frequency }),
        detune,
      });
    };
    currentRef.current.oscillatorNode = handler();
    return handler;
  }, [type, frequency, midi, detune]);

  const createGainNode = useMemo(() => {
    const handler = () => new GainNode(context, { gain });
    currentRef.current.gainNode = handler();
    return handler;
  }, [gain]);

  const current = {
    createOscillatorNode,
    createGainNode,
  };

  const createRef = useRef<TCreateRef>({
    ...current,
  });

  createRef.current = {
    ...createRef.current,
    ...current,
  };

  const handleStop = async (options: TStopOptions = {}) => {
    await context.resume();
    const { current } = currentRef;
    if (!current.isPlaying) return;
    current.isPlaying = false;
    const { gainNode, oscillatorNode } = current;
    if (!gainNode || !oscillatorNode) return;

    const {
      gain = 1,
      decay,
      end = context.currentTime,
      onEnded,
    } = options;

    if (
      typeof decay === "number" &&
      typeof end === "number"
    ) {
      gainNode.gain.setValueAtTime(gain, end - decay);
      gainNode.gain.linearRampToValueAtTime(0, end);
    }

    oscillatorNode.stop(end);

    oscillatorNode.onended = () => {
      current.oscillatorNode =
        createRef.current.createOscillatorNode();
      gainNode.disconnect();

      if (onEnded) {
        onEnded();
      }
    };
  };

  const handlePlay = async (
    options: TSynthOptions = {},
  ) => {
    await context.resume();
    const { current } = currentRef;
    if (current.isPlaying) return;
    current.isPlaying = true;
    const { oscillatorNode, gainNode } = current;
    if (!gainNode || !oscillatorNode) return;

    const {
      type,
      frequency,
      detune,
      start = 0,
      end,
      attack,
      decay,
      gain,
      onEnded,
    } = options;

    optionsRef.current = {
      ...optionsRef.current,
      ...options,
    };

    if (isWritableOscillatorType(type)) {
      oscillatorNode.type = type;
    }
    if (typeof frequency === "number") {
      oscillatorNode.frequency.value = frequency;
    }
    if (typeof detune === "number") {
      oscillatorNode.detune.value = detune;
    }

    if (typeof gain === "number") {
      gainNode.gain.value = gain;
    }

    oscillatorNode.start(start);

    if (typeof attack === "number") {
      gainNode.gain.setValueAtTime(0, start);
      gainNode.gain.linearRampToValueAtTime(
        0,
        start + attack,
      );
    }

    if (typeof end === "number") {
      handleStop({ decay, end, onEnded });
    }

    oscillatorNode.connect(gainNode);

    gainNode.connect(master);
  };

  return { play: handlePlay, stop: handleStop };
};
