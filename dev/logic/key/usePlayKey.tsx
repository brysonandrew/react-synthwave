import { useRef } from "react";
import { useKey } from "./useKey";
import { useContext } from "@state/Context";

type TConfig = {
  isReady: boolean;
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
  const { isReady, context } = useContext();
  const playRef = useRef(isPlaying);

  useKey({
    handlers: {
      onKeyDown: async ({ key, repeat }) => {
        if (!isReady) {
          await context.resume();
        }
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
