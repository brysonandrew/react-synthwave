import type { TState } from "./types";

export const _SYNTH_WAVE_STATE_STORAGE_KEY =
  "_SYNTH_WAVE_STATE_STORAGE_KEY";

export const STATE: TState = {
  isReady: false,
  isPlaying: false,
  options: {
    type: "sawtooth",
    midi: 60,
    detune: 0,
    gain: 1,
    attack: 0.2,
    decay: 0.2,
  },
};
