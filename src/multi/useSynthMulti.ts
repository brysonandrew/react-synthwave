import { TStopOptions } from "src/single/types";
import {
  TSynthOptions,
  useSynthSingle,
} from "../single/useSynthSingle";

export const useSynthMulti = (
  context: AudioContext,
  synths: TSynthOptions[],
) => {
  const synth = useSynthSingle(context);

  const x: ReturnType<typeof useSynthSingle>[] = [];

  const handleStop = async (options: TStopOptions) => {
    x.forEach((s) => {
      s.stop(options);
    });
  };

  const handlePlay = async (
    options: TSynthOptions = {},
  ) => {
    await context.resume();
    synths.forEach(() => {
      const next = { ...synth };
      x.push(next);
      next.play(options);
    });
  };

  return { play: handlePlay, stop: handleStop };
};
