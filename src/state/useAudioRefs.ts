import { useRef } from "react";

export const useAudioRefs = () => {
  const contextRef = useRef(new AudioContext());
  const context = contextRef.current;

  const masterRef = useRef(
    new GainNode(context, { gain: 1 }),
  );
  const master = masterRef.current;

  return { master, context };
};
