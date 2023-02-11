import type { TWritableOscillatorType } from "./types";

export const WRITABLE_OSCILLATOR_TYPES: readonly TWritableOscillatorType[] =
  ["sawtooth", "sine", "square", "triangle"] as const;
