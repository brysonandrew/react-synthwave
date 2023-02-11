import type { MutableRefObject } from "react";
import { useEffect } from "react";
const BACKGROUND_COLOR = "#000";
const STROKE_COLOR = "FFF";

type TConfig = {
  context: AudioContext;
  master: GainNode;
  ref: MutableRefObject<HTMLCanvasElement | null>;
};
export const useVisualize = ({
  context,
  master,
  ref,
}: TConfig) => {
  const handler = () => {
    const destination =
      context.createMediaStreamDestination();
    master.connect(context.destination);
    master.connect(destination);
    const { stream } = destination;

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.log("no audio tracks");
      return null;
    }
    if (!ref.current) {
      console.log("no canvas");
      return null;
    }
    const canvas = ref.current;
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    // const pitchDetectBuffer = new Float32Array(
    //   bufferLength,
    // );
    source.connect(analyser);

    const draw = () => {
      const canvasCtx = canvas.getContext("2d");

      if (!canvasCtx) {
        throw new Error("no canvas context");
      }

      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);
      // analyser.getFloatTimeDomainData(pitchDetectBuffer);

      canvasCtx.fillStyle = BACKGROUND_COLOR;
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = STROKE_COLOR;

      canvasCtx.beginPath();

      const sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(WIDTH, HEIGHT / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  useEffect(() => {
    handler();
  }, []);
};
