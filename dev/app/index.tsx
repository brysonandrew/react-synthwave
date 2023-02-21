import { useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { useContext } from "@state/Context";
import { usePlayKey } from "@logic/key/usePlayKey";
import { useVisualize } from "@logic/visualize/useVisualize";
import { Options } from "./Options";
import {
  TMultiOptions,
  useSynthMulti,
} from "@react-synthwave/index";

const Root = styled.div``;
const Canvas = styled.canvas``;
const Core = styled.div``;

export default () => {
  const {
    isReady,
    isPlaying,
    options,
    multi,
    context,
    master,
    dispatch,
  } = useContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextOptions = { ...multi, ...options };
  const currentRef = useRef<TMultiOptions>(nextOptions);
  currentRef.current = nextOptions;
  useVisualize({
    isActive: isPlaying,
    context,
    master,
    ref: canvasRef,
  });

  const { play, stop } = useSynthMulti(context);
  const handlePlay = useCallback(async () => {
    dispatch({ type: "toggle-playing", value: true });
    play(currentRef.current);
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
    play: () => handlePlay(),
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
