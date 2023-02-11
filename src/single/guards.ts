import { WRITABLE_OSCILLATOR_TYPES } from "./constants";
import type { TWritableOscillatorType } from "./types";

export const isWritableOscillatorType = (
  target: any,
): target is TWritableOscillatorType => {
  if (WRITABLE_OSCILLATOR_TYPES.includes(target)) {
    return true;
  }
  return false;
};

export const isOscillator = (
  target: object,
): target is OscillatorNode => {
  if (target instanceof OscillatorNode) {
    return true;
  }
  return false;
};

export const isBiquadFilterNode = (
  target: object,
): target is BiquadFilterNode => {
  if (target instanceof BiquadFilterNode) {
    return true;
  }
  return false;
};

export const isIirFilterNode = (
  target: object,
): target is IIRFilterNode => {
  if (target instanceof IIRFilterNode) {
    return true;
  }
  return false;
};

export const isAudioNode = (
  target: object,
): target is AudioNode => {
  if (target instanceof AudioNode) {
    return true;
  }
  return false;
};

export const isGainNode = (
  target: object,
): target is GainNode => {
  if (target instanceof GainNode) {
    return true;
  }
  return false;
};

export const isDelayNode = (
  target: object,
): target is DelayNode => {
  if (target instanceof DelayNode) {
    return true;
  }
  return false;
};

export const isAudioWorklet = (
  target: object,
): target is AudioWorkletNode => {
  if (target instanceof AudioWorkletNode) {
    return true;
  }
  return false;
};

export const isAudioParam = (
  target: object,
): target is AudioParam => {
  if (target instanceof AudioParam) {
    return true;
  }
  return false;
};
