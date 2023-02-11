import { useMemo } from "react";

export const useAudioInstances = () => {
  const context = useMemo(() => new AudioContext(), []);
  const master = useMemo(
    () => new GainNode(context, { gain: 1 }),
    [],
  );

  return { master, context };
};
