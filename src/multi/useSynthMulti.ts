import { useRef } from "react";
import type { TSynthOptions, TStopOptions } from "..";
import { useSynthSingle } from "..";
import { TMultiOptions } from "./types";

export const useSynthMulti = (
  context: AudioContext,
  synthOptions: TSynthOptions,
  options: TMultiOptions = {},
) => {
  const current = options;
  const currentRef = useRef(current);
  currentRef.current = current;
  const synth = useSynthSingle(context, synthOptions);

  const synthsRef = useRef<
    ReturnType<typeof useSynthSingle>[]
  >([]);

  const handleStop = async (options: TStopOptions) => {
    synthsRef.current.forEach((s) => {
      s.stop(options);
    });
    synthsRef.current = [];
  };

  const handlePlay = async (
    playOptions: TSynthOptions = {},
  ) => {
    const { count, spread } = currentRef.current;
    await context.resume();
    [...Array(count ?? 1)].forEach(
      (options, index, { length }) => {
        const next = { ...synth };
        synthsRef.current.push(next);
        next.play({
          ...options,
          ...playOptions,
          gain: 1 / (length * 0.5),
          detune:
            (index - ~~(length * 0.5)) * (spread ?? 0),
        });
      },
    );
  };

  return { play: handlePlay, stop: handleStop };
};
