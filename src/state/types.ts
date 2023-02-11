import type {
  Dispatch,
  Reducer,
  ReducerState,
  ReducerAction,
} from "react";
import type { TSynthOptions } from "@logic/synth/types";

export type TContext = TState & {
  context: AudioContext;
  master: GainNode;
  dispatch: TDispatch;
};

export type TAction =
  | {
      type: "update-options";
      value: Partial<TSynthOptions>;
    }
  | {
      type: "toggle-playing";
      value: boolean;
    };

export type TState = {
  isPlaying: boolean;
  options: TSynthOptions;
};

export type TActionType = null;
export type TActionValue = any;

export type TKeyValuePair = [
  key: TActionType,
  value: TActionValue,
];

export type TDispatch = Dispatch<TAction>;
export type TReducer = Reducer<TState, TAction>;
export type TReducerState = ReducerState<TReducer>;
export type TReducerAction = ReducerAction<TReducer>;
