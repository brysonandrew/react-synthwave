import { useMemo, useRef } from "react";
import { resolveMidi } from "./resolvers";
import { isWritableOscillatorType } from "./guards";
import { WRITABLE_OSCILLATOR_TYPES } from "./constants";
import { TSynthOptions, TStopOptions } from "./types";
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
  context: AudioContext,
  options: TSynthOptions = {},
) => {
  const { type, midi, frequency, detune, gain } = options;

  const optionsRef = useRef<TSynthOptions>(options);
  optionsRef.current = options;

  const currentRef = useRef<TRef>({
    isPlaying: false,
  });

  const createOscillatorNode = useMemo(() => {
    const handler = () =>
      new OscillatorNode(context, {
        type,
        frequency: resolveMidi({ midi, frequency }),
        detune,
      });
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
    const { gainNode, oscillatorNode } = current;
    if (!gainNode || !oscillatorNode) return;

    optionsRef.current = {
      ...optionsRef.current,
      ...options,
    };

    const {
      gain = 1,
      end = context.currentTime,
      onEnded,
      decay,
    } = optionsRef.current;

    if (typeof decay === "number") {
      gainNode.gain.setValueAtTime(gain, end);
      gainNode.gain.linearRampToValueAtTime(0, end + decay);
      oscillatorNode.stop(end + decay);
    } else {
      gainNode.gain.value = gain;
      oscillatorNode.stop(end);
    }

    oscillatorNode.onended = () => {
      current.isPlaying = false;

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

    optionsRef.current = {
      ...optionsRef.current,
      ...options,
    };

    const {
      type,
      frequency,
      detune,
      start = context.currentTime,
      end,
      attack,
      decay,
      gain = 1,
      onEnded,
    } = optionsRef.current;

    if (isWritableOscillatorType(type)) {
      oscillatorNode.type = type;
    }

    if (typeof frequency === "number") {
      oscillatorNode.frequency.value = frequency;
    }

    if (typeof detune === "number") {
      oscillatorNode.detune.value = detune;
    }

    oscillatorNode.start(start);

    if (typeof attack === "number") {
      gainNode.gain.setValueAtTime(0, start);
      gainNode.gain.linearRampToValueAtTime(
        gain,
        start + attack,
      );
    } else {
      gainNode.gain.value = gain;
    }

    if (typeof end === "number") {
      handleStop({ decay, end, onEnded });
    }

    oscillatorNode.connect(gainNode);

    if (options.master) {
      gainNode.connect(options.master);
    } else {
      gainNode.connect(context.destination);
    }
  };

  return { play: handlePlay, stop: handleStop };
};

export { WRITABLE_OSCILLATOR_TYPES };
export { TSynthOptions };
