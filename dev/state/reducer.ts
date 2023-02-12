import type { TState, TReducerAction } from "./types";

export const reducer = (
  state: TState,
  { type, value }: TReducerAction,
) => {
  switch (type) {
    case "toggle-ready": {
      return {
        ...state,
        isReady: value,
      };
    }
    case "toggle-playing": {
      return {
        ...state,
        isPlaying: value,
      };
    }
    case "update-options": {
      return {
        ...state,
        options: {
          ...state.options,
          ...value,
        },
      };
    }
    case "update-multi": {
      return {
        ...state,
        multi: {
          ...state.multi,
          ...value,
        },
      };
    }
    default: {
      console.error(type);
      throw new Error(`⚠ Action type invalid. ${type}`);
    }
  }
};
