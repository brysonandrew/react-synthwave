import type { TState } from "./types";

export const _SYNTH_WAVE_STATE_STORAGE_KEY =
  "_SYNTH_WAVE_STATE_STORAGE_KEY";

export const STATE: TState = {
  isPlaying: false,
  options: {
    type: "sawtooth",
    midi: 60,
    gain: 1,
  },
};
