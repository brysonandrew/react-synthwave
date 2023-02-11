import { useReducer } from "react";
import type { FC } from "react";
import type { TReducer, TState } from "./types";
import { reducer } from "./reducer";
import { Context } from "./Context";
import {
  STATE,
  _SYNTH_WAVE_STATE_STORAGE_KEY,
} from "./constants";
import { useAudioInstances } from "./useAudioInstances";
import { useLocalStorage } from "@logic/storage/useLocalStorage";

type TProviderProps = {
  children: JSX.Element;
};
export const Provider: FC<TProviderProps> = ({
  children,
}) => {
  const { context, master } = useAudioInstances();

  const [savedState, setSavedState] =
    useLocalStorage<TState>(
      _SYNTH_WAVE_STATE_STORAGE_KEY,
      STATE,
    );

  const [state, dispatch] = useReducer<TReducer, TState>(
    (...args) => {
      const nextState = reducer(...args);

      setSavedState({
        ...STATE,
        ...nextState,
        isPlaying: false,
        isReady: false,
      });

      return nextState;
    },
    STATE,
    (state) => ({ ...state, ...savedState }),
  );

  return (
    <Context.Provider
      value={{
        dispatch,
        context,
        master,
        ...state,
      }}
    >
      {children}
    </Context.Provider>
  );
};
