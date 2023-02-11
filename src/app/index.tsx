import styled from "@emotion/styled";
import { useContext } from "@state/Context";
import { useRef } from "react";
import { useVisualize } from "../logic/visualize/useVisualize";
import { useSynth } from "@logic/synth/useSynth";

const Root = styled.div``;
const Canvas = styled.canvas``;
const Core = styled.div``;

export default () => {
  const { master, context } = useContext();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useVisualize({ context, master, ref: canvasRef });

  useSynth();

  return (
    <>
      <Canvas
        ref={canvasRef}
        className="fixed inset-0 bg-red w-full h-full"
      />
      <Root className="relative flex flex-col items-center">
        <Core className="w-core">Hello world</Core>
        <div className="py-6" />
      </Root>
    </>
  );
};
