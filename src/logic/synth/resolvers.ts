const HZ = 440;
export const midiToHz = (note: number) =>
  Math.pow(2, (note - 69) / 12) * HZ;
export const decebelsToAmps = (db: number) =>
  Math.pow(10, db / 20);
export const centsToHz = (cents: number) =>
  Math.pow(2, cents / 1200);

export type TResolveMidiConfig = {
  midi?: number;
  frequency?: number;
};
export const resolveMidi = ({
  midi,
  frequency,
}: TResolveMidiConfig) => {
  if (typeof midi === "number") {
    return midiToHz(midi);
  }
  return frequency;
};
