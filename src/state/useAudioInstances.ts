import { useRef } from "react";

export const useAudioInstances = () => {
  const context = useRef(new AudioContext());
  const master = useRef(
    new GainNode(context.current, { gain: 1 }),
  );

  return {
    master: master.current,
    context: context.current,
  };
};
