import { useMemo, useRef } from "react";
import { resolveMidi } from "./resolvers";
import { isWritableOscillatorType } from "./guards";
import type { TSynthOptions, TStopOptions } from "..";

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

  const clonesRef = useRef<OscillatorNode[]>([]);
  const gainClonesRef = useRef<GainNode[]>([]);

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

  const handleStop = (options: TStopOptions = {}) => {
    const { current } = currentRef;

    const oscillatorNode = !current.isPlaying
      ? clonesRef.current.shift()
      : current.oscillatorNode;

    if (!current.isPlaying) {
      current.gainNode = createRef.current.createGainNode();
      current.oscillatorNode =
        createRef.current.createOscillatorNode();
    }
    const gainNode = !current.isPlaying
      ? gainClonesRef.current.shift()
      : current.gainNode;

    current.isPlaying = false;

    if (!gainNode || !oscillatorNode) return;

    optionsRef.current = {
      ...optionsRef.current,
      ...options,
    };

    const {
      end = context.currentTime,
      onEnded,
      decay,
      delay = 0,
    } = optionsRef.current;

    if (end === Infinity) return;

    const e1 = end + delay;

    const gain = optionsRef.current.gain ?? 1;
    if (typeof decay === "number") {
      const e2 = e1 + decay;

      gainNode.gain.setValueAtTime(gainNode.gain.value, e1);
      gainNode.gain.linearRampToValueAtTime(0, e2);
      oscillatorNode.stop(e2);
    } else {
      gainNode.gain.value = gain;
      oscillatorNode.stop(e1);
    }

    oscillatorNode.onended = () => {
      gainNode.disconnect();

      const isDone = clonesRef.current.length === 0;

      if (onEnded) {
        onEnded(isDone);
      }
    };
  };

  const handlePlay = async (
    options: TSynthOptions = {},
  ) => {
    await context.resume();
    const { current } = currentRef;
    if (current.isPlaying) {
      const o = createRef.current.createOscillatorNode();
      const g = createRef.current.createGainNode();
      clonesRef.current.push(o);
      gainClonesRef.current.push(g);
    }
    const oscillatorNode = current.isPlaying
      ? clonesRef.current[clonesRef.current.length - 1]
      : current.oscillatorNode;

    const gainNode = current.isPlaying
      ? gainClonesRef.current[
          gainClonesRef.current.length - 1
        ]
      : current.gainNode;

    current.isPlaying = true;
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
      delay = 0,
      onEnded,
    } = optionsRef.current;

    optionsRef.current.gain = gain;

    if (isWritableOscillatorType(type)) {
      oscillatorNode.type = type;
    }

    if (
      typeof midi === "number" ||
      typeof frequency === "number"
    ) {
      oscillatorNode.frequency.value = resolveMidi({
        midi,
        frequency,
      });
    }

    if (typeof detune === "number") {
      oscillatorNode.detune.value = detune;
    }

    oscillatorNode.start(start + delay);

    if (typeof attack === "number") {
      gainNode.gain.setValueAtTime(0, start + delay);
      gainNode.gain.linearRampToValueAtTime(
        gain,
        start + attack,
      );
    } else {
      gainNode.gain.value = gain;
    }

    if (typeof end === "number" && end !== Infinity) {
      handleStop({ gain, decay, end, delay, onEnded });
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
