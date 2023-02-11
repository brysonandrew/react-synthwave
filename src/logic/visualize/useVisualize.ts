import type { MutableRefObject } from "react";
import { useCallback, useRef, useEffect } from "react";

type TInit = {
  bufferLength: number;
  dataArray: Uint8Array;
  analyser: AnalyserNode;
};

type TCanvas = HTMLCanvasElement | null;

type TCurrentRef = {
  init: null | TInit;
  canvas: TCanvas;
  backgroundColor: string;
  strokeColor: string;
};

type TConfig = {
  isActive: boolean;
  context: AudioContext;
  master: GainNode;
  ref: MutableRefObject<TCanvas>;
};

export const useVisualize = ({
  context,
  isActive,
  ref,
  master,
}: TConfig) => {
  const frameRef =
    useRef<ReturnType<typeof requestAnimationFrame>>();

  const current = {
    backgroundColor: "#000",
    strokeColor: "#FFF",
    canvas: ref.current,
  };
  const currentRef = useRef<TCurrentRef>({
    init: null,
    ...current,
  });
  currentRef.current = {
    ...currentRef.current,
    ...current,
  };

  const init = async () => {
    await context.resume();
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    if (currentRef.current.init === null) {
      const destination =
        context.createMediaStreamDestination();
      master.connect(context.destination);
      master.connect(destination);

      const audioTracks =
        destination.stream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.log("no audio tracks");
        return null;
      }
      if (!ref.current) {
        console.log("no canvas");
        return null;
      }
      const source = context.createMediaStreamSource(
        destination.stream,
      );
      source.connect(analyser);
      const bufferLength = analyser.frequencyBinCount;
      currentRef.current.init = {
        bufferLength,
        dataArray: new Uint8Array(bufferLength),
        analyser,
      };
    }
  };

  const endFrameRequest = () => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
  };

  const draw = useCallback(() => {
    const { current } = currentRef;
    if (current.canvas === null || current.init === null)
      return;
    const { analyser, dataArray, bufferLength } =
      current.init;
    const { canvas, backgroundColor, strokeColor } =
      current;

    const canvasCtx = current.canvas.getContext("2d");

    if (!canvasCtx) {
      throw new Error("no canvas context");
    }

    const width = canvas.width;
    const height = canvas.height;

    frameRef.current = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = backgroundColor;
    canvasCtx.fillRect(0, 0, width, height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = strokeColor;

    canvasCtx.beginPath();

    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(width, height / 2);
    canvasCtx.stroke();
  }, []);

  useEffect(() => {
    if (!currentRef.current.init) {
      init();
    }

    if (isActive) {
      draw();
    } else {
      endFrameRequest();
    }

    return endFrameRequest;
  }, [isActive]);
};
