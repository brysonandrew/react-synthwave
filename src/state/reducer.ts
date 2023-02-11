import type { TState, TReducerAction } from "./types";

export const reducer = (
  state: TState,
  { type }: TReducerAction,
) => {
  switch (type) {
    case "action-name": {
      return {
        ...state,
      };
    }
    default: {
      console.error(type);
      throw new Error(`⚠ Action type invalid. ${type}`);
    }
  }
};
