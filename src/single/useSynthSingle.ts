import { useMemo, useRef } from "react";
import { resolveMidi } from "./resolvers";
import {
  isAudioParam,
  isWritableOscillatorType,
} from "./guards";
import type { TSynthOptions, TStopOptions } from "..";

type TRef = {
  isPlaying: boolean;
  oscillatorNode?: OscillatorNode;
  gainNode?: GainNode;
};

type TCreateGainOptions = { gain?: number };

type TCreateRef = {
  createOscillatorNode: (
    options?: Partial<TSynthOptions>,
  ) => OscillatorNode;
  createGainNode: (
    options?: TCreateGainOptions,
  ) => GainNode;
};

export const useSynthSingle = (
  context: AudioContext,
  originalOptions: TSynthOptions = {},
) => {
  const { type, midi, frequency, detune, gain } =
    originalOptions;
  const optionsRef = useRef<TSynthOptions>(originalOptions);
  optionsRef.current = originalOptions;
  const currentRef = useRef<TRef>({
    isPlaying: false,
  });
  const clonesRef = useRef<OscillatorNode[]>([]);
  const gainClonesRef = useRef<GainNode[]>([]);

  const createOscillatorNode = useMemo(() => {
    const handler = (options?: Partial<TSynthOptions>) => {
      if (options) {
        optionsRef.current = {
          ...optionsRef.current,
          ...options,
        };
      }
      const { type, midi, frequency, detune } =
        optionsRef.current;
      return new OscillatorNode(context, {
        type,
        frequency: resolveMidi({
          midi,
          frequency,
        }),
        detune,
      });
    };
    return handler;
  }, [type, frequency, midi, detune]);

  const createGainNode = useMemo(() => {
    const handler = (options?: TCreateGainOptions) => {
      if (options) {
        optionsRef.current = {
          ...optionsRef.current,
          ...options,
        };
      }
      return new GainNode(context, {
        gain: optionsRef.current.gain,
      });
    };
    return handler;
  }, [gain]);

  const createHandlers = {
    createOscillatorNode,
    createGainNode,
  };

  const createRef = useRef<TCreateRef>({
    ...createHandlers,
  });

  createRef.current = {
    ...createRef.current,
    ...createHandlers,
  };

  const handleStop = (options: TStopOptions = {}) => {
    if (
      clonesRef.current.length === 0 &&
      gainClonesRef.current.length === 0
    )
      return;
    const oscillatorNode = clonesRef.current.shift();
    const gainNode = gainClonesRef.current.shift();

    currentRef.current.isPlaying = false;

    if (!gainNode || !oscillatorNode) {
      throw new Error(
        "Internal error: gain or oscillator node not found",
      );
    }

    optionsRef.current = {
      ...optionsRef.current,
      ...options,
    };

    if (optionsRef.current.end === Infinity) {
      optionsRef.current.end = context.currentTime;
    }

    const {
      end = context.currentTime,
      onEnded,
      decay,
      delay = 0,
    } = optionsRef.current;

    const e1 = end + delay;

    gainNode.gain.setValueAtTime(gainNode.gain.value, e1);

    if (typeof decay === "number") {
      const e2 = e1 + decay;
      gainNode.gain.linearRampToValueAtTime(0, e2);
      oscillatorNode.stop(e2);
    } else {
      oscillatorNode.stop(e1);
    }

    oscillatorNode.onended = () => {
      gainNode.disconnect();
      const isDone = clonesRef.current.length === 0;

      if (isDone) {
        optionsRef.current = originalOptions;
      }

      if (onEnded) {
        onEnded(isDone);
      }
    };
  };

  const handlePlay = async (
    options: TSynthOptions = {},
  ) => {
    await context.resume();
    const gainConfig = { gain: options.gain };

    const o =
      createRef.current.createOscillatorNode(options);
    const g = createRef.current.createGainNode(gainConfig);
    clonesRef.current.push(o);
    gainClonesRef.current.push(g);

    const oscillatorNode =
      clonesRef.current[clonesRef.current.length - 1];

    const gainNode =
      gainClonesRef.current[
        gainClonesRef.current.length - 1
      ];

    currentRef.current.isPlaying = true;

    if (!gainNode || !oscillatorNode) {
      throw new Error(
        "Internal error: gain or oscillator node not found",
      );
    }

    optionsRef.current = {
      ...optionsRef.current,
      ...options,
    };

    const {
      type,
      midi,
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
    } else {
      console.error("No frequency or midi value provided");
    }

    if (typeof detune === "number") {
      oscillatorNode.detune.value = detune;
    }

    const s1 = start + delay;
    oscillatorNode.start(s1);

    if (typeof attack === "number") {
      const s2 = s1 + attack;
      gainNode.gain.setValueAtTime(0, s1);
      gainNode.gain.linearRampToValueAtTime(gain, s2);
    } else {
      gainNode.gain.setValueAtTime(gain, s1);
    }

    if (typeof end === "number" && end !== Infinity) {
      handleStop({ gain, decay, end, delay, onEnded });
    }

    oscillatorNode.connect(gainNode);

    if (typeof optionsRef.current.output === "undefined") {
      oscillatorNode.connect(context.destination);
    } else {
      if (isAudioParam(optionsRef.current.output)) {
        oscillatorNode.connect(optionsRef.current.output);
      } else {
        oscillatorNode.connect(optionsRef.current.output);
      }
    }
  };

  return { play: handlePlay, stop: handleStop };
};
