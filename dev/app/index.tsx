import styled from "@emotion/styled";
import { useContext } from "@state/Context";
import { useCallback, useRef } from "react";
import { useVisualize } from "../logic/visualize/useVisualize";
import { useSynthMulti } from "../../src/multi/useSynthMulti";
import { usePlayKey } from "@logic/key/usePlayKey";
import { Options } from "./Options";
import { useAnimation } from "framer-motion";

const Root = styled.div``;
const Canvas = styled.canvas``;
const Core = styled.div``;

export default () => {
  const {
    isReady,
    isPlaying,
    context,
    master,
    options,
    multi,
    dispatch,
  } = useContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useVisualize({
    isActive: isPlaying,
    context,
    master,
    ref: canvasRef,
  });

  const { play, stop } = useSynthMulti(context, options);

  const handlePlay = useCallback(() => {
    dispatch({ type: "toggle-playing", value: true });
    play({ ...options, output: master });
  }, []);

  const handleStop = useCallback(() => {
    stop({
      onEnded: (isDone: boolean) => {
        if (isDone) {
          dispatch({
            type: "toggle-playing",
            value: false,
          });
        }
      },
    });
  }, []);

  usePlayKey({
    isReady,
    play: handlePlay,
    stop: handleStop,
    isActive: true,
    isPlaying,
    targetKey: "w",
  });

  return (
    <>
      <Canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
      />
      <Root className="relative flex flex-col items-center">
        <div className="py-6" />
        <Core className="w-core">
          <Options />
        </Core>
        <div className="py-6" />
      </Root>
    </>
  );
};
