import { useRef } from "react";
import type {
  TSynthOptions,
  TStopOptions,
} from "..";
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
    synthsRef.current.forEach((synth) => {
      synth.stop(options);
    });
    synthsRef.current = [];
  };

  const handlePlay = async (
    multiOptions: TMultiOptions | TMultiOptions[],
  ) => {
    await context.resume();

    if (Array.isArray(multiOptions)) {
      currentRef.current = multiOptions;
    } else {
      currentRef.current = [multiOptions];
    }
    for await (const value of currentRef.current) {
      const {
        count,
        spread,
        stagger,
        gain = 0,
        detune = 0,
      } = value;
      const arr = [...Array(count ?? 1)];
      let index = 0;
      const length = arr.length;
      for await (const _ of arr) {
        const next = { ...synth };
        synthsRef.current.push(next);
        await next.play({
          ...value,
          delay: index * 0.1 * (stagger ?? 0),
          gain: gain + 1 / length,
          detune:
            detune +
            (index - ~~(length * 0.5)) * (spread ?? 0),
        });
        index++;
      }
    }
  };

  return { play: handlePlay, stop: handleStop };
};
