import { useRef } from "react";
import type { TSynthOptions, TStopOptions } from "..";
import { useSynthSingle } from "..";
import type { TMultiOptions } from "./types";

export const useSynthMulti = (
  context: AudioContext,
  synthOptions: TSynthOptions = {},
) => {
  const currentRef = useRef<TMultiOptions[]>([]);
  const synth = useSynthSingle(context, synthOptions);

  const synthsRef = useRef<
    ReturnType<typeof useSynthSingle>[]
  >([]);

  const handleStop = async (options: TStopOptions = {}) => {
    synthsRef.current.forEach((s) => {
      s.stop(options);
    });
    synthsRef.current = [];
  };

  const handlePlay = async (
    synthOptions: TSynthOptions = {},
    options: TMultiOptions | TMultiOptions[] = {},
  ) => {
    await context.resume();

    if (Array.isArray(options)) {
      currentRef.current = options;
    } else {
      currentRef.current = [options];
    }
    currentRef.current.forEach((value: TMultiOptions) => {
      const { count, spread, stagger } = value;
      [...Array(count ?? 1)].forEach(
        (options, index, { length }) => {
          const next = { ...synth };
          synthsRef.current.push(next);
          next.play({
            ...options,
            ...synthOptions,
            delay: index * 0.1 * (stagger ?? 0),
            gain: 1 / (length * 0.5),
            detune:
              (index - ~~(length * 0.5)) * (spread ?? 0),
          });
        },
      );
    });
  };

  return { play: handlePlay, stop: handleStop };
};
