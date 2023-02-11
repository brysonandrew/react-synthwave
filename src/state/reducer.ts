import type { TState, TReducerAction } from "./types";

export const reducer = (
  state: TState,
  { type, value }: TReducerAction,
) => {
  switch (type) {
    case "update-options": {
      return {
        ...state,
        options: {
          ...state.options,
          ...value,
        },
      };
    }
    case "toggle-playing": {
      return {
        ...state,
        isPlaying: value,
      };
    }
    default: {
      console.error(type);
      throw new Error(`⚠ Action type invalid. ${type}`);
    }
  }
};
