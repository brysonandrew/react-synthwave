import { useMemo, useRef } from "react";
import type { TStopOptions, TSynthOptions } from "./types";
import { resolveMidi } from "./resolvers";
import { useContext } from "@state/Context";
import { isWritableOscillatorType } from "./guards";

export const useSynthSingle = (options: TSynthOptions = {}) => {
  const { context, master } = useContext();
  const { type, midi, frequency, detune, gain } = options;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const current = {};
  const currentRef = useRef<any>({
    isPlaying: false,
    oscillatorNode: null,
    gainNode: null,
    ...current,
  });
  currentRef.current = current;

  const createOscillatorNode = useMemo(() => {
    const handler = () =>
      new OscillatorNode(context, {
        type,
        frequency: resolveMidi({ midi, frequency }),
        detune,
      });
    return handler;
  }, [type, frequency, midi, detune]);

  const createGainNode = useMemo(() => {
    const handler = () =>
      new GainNode(context, { gain: 1 });
    return handler;
  }, [gain]);

  const handleStop = async (options: TStopOptions = {}) => {
    await context.resume();
    const { current } = currentRef;
    if (!current.isPlaying) return;
    current.isPlaying = false;
    const { gainNode, oscillatorNode } = current;

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
      current.oscillatorNode = createOscillatorNode();
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
    if (!current.oscillatorNode) {
      current.oscillatorNode = createOscillatorNode();
    }
    if (!current.gainNode) {
      current.gainNode = createGainNode();
    }
    const { isPlaying, oscillatorNode, gainNode } = current;

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

    // master.connect(context.destination);
  };

  return { play: handlePlay, stop: handleStop };
};
