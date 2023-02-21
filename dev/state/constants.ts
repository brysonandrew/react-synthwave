import { WRITABLE_OSCILLATOR_TYPES } from "@react-synthwave/index";
import type { TState } from "./types";

export const _SYNTH_WAVE_STATE_STORAGE_KEY =
  "_SYNTH_WAVE_STATE_STORAGE_KEY";

const single = {
  type: WRITABLE_OSCILLATOR_TYPES[0],
  midi: 28,
  detune: 0,
  gain: 0.4,
  attack: 0.2,
  decay: 0.2,
  delay: 0,
};

export const STATE: TState = {
  isReady: false,
  isPlaying: false,
  options: single,
  multi: {
    ...single,
    count: 2,
    spread: 0,
    stagger: 0,
  },
};
