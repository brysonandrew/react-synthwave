import { useRef } from "react";
import { useKey } from "./useKey";

type TConfig = {
  targetKey: string;
  isActive?: boolean;
  isPlaying?: boolean;
  play(): void;
  stop(): void;
};
export const usePlayKey = ({
  targetKey,
  isActive = true,
  isPlaying,
  play,
  stop,
}: TConfig) => {
  const playRef = useRef(isPlaying);

  useKey({
    handlers: {
      onKeyDown: ({ key, repeat }) => {
        if (
          key === targetKey &&
          !repeat &&
          isActive &&
          !playRef.current
        ) {
          playRef.current = true;
          play();
        }
      },
      onKeyUp: ({ key, repeat }) => {
        if (
          key === targetKey &&
          !repeat &&
          isActive &&
          playRef.current
        ) {
          playRef.current = false;
          stop();
        }
      },
    },
    isActive,
  });
};
