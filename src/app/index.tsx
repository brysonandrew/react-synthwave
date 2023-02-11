import styled from "@emotion/styled";
import { useContext } from "@state/Context";
import { useRef } from "react";
import { useVisualize } from "../logic/visualize/useVisualize";
import { useSynthSingle } from "@logic/synth/useSynthSingle";
import { usePlayKey } from "@logic/key/useTogglePlayKeyPress";

const Root = styled.div``;
const Canvas = styled.canvas``;
const Core = styled.div``;

export default () => {
  const { master, context } = useContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useVisualize({ context, master, ref: canvasRef });
  const { play, stop } = useSynthSingle();
  usePlayKey({
    play,
    stop,
    isActive: true,
    targetKey: "w",
  });
  console.log(master);
  return (
    <>
      <Canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full bg-blue"
      />
      <Root className="relative flex flex-col items-center">
        <Core className="w-core bg-purple">
          Hello world
        </Core>
        <div className="py-6 bg-red" />
      </Root>
    </>
  );
};
