// #region reducer definition

import { Key, useContext, useCallback } from "react";
import { EditorContext } from "state/editor/EditorContext";
import { StorableHtmlNode } from "types/HtmlNodes";
import { HtmlObject } from "types/HtmlObject";
import { MouseContext } from "./MouseContext";
// import { ESMap, Map } from "typescript";

// #region type and constant definitions

// Define action types
export enum MouseActionType {
  MOUSE_MOVED = "MOUSE_MOVED",
  MOUSE_LEFT_DOWN = "MOUSE_LEFT_DOWN",
  MOUSE_LEFT_UP = "MOUSE_LEFT_UP",
  MOUSE_RIGHT_DOWN = "MOUSE_RIGHT_DOWN",
  MOUSE_RIGHT_UP = "MOUSE_RIGHT_UP",
  MOUSE_TRY_HOLD = "MOUSE_TRY_HOLD",
  REGISTER_CALLBACK = "REGISTER_CALLBACK",
}

export type MouseAction =
  | { type: MouseActionType.MOUSE_MOVED; mouseX: number; mouseY: number }
  | { type: MouseActionType.MOUSE_LEFT_DOWN }
  | { type: MouseActionType.MOUSE_LEFT_UP }
  | { type: MouseActionType.MOUSE_RIGHT_DOWN }
  | { type: MouseActionType.MOUSE_RIGHT_UP }
  | { type: MouseActionType.MOUSE_TRY_HOLD; event: MouseEvent }
  | {
      type: MouseActionType.REGISTER_CALLBACK;
      callback: (state: MouseState, ev: MouseEvent) => void;
      id: string;
    };

export type MouseState = {
  mouseX: number | null;
  mouseY: number | null;
  holdLeft: boolean;
  mouseLeftDown: boolean;
  mouseRightDown: boolean;
  mouseHoldCallbacks: Map<string, (state: MouseState, ev: MouseEvent) => void>;
};

// Initial state for the mouse reducer
export const initialMouseState: MouseState = {
  mouseX: null,
  mouseY: null,
  holdLeft: false,
  mouseLeftDown: false,
  mouseRightDown: false,
  mouseHoldCallbacks: new Map(),
};

// #endregion

// Define a reducer to manage the state of the editor
export function mouseReducer(
  state: MouseState,
  action: MouseAction
): MouseState {
  switch (action.type) {
    // When the mouse has been moved
    case MouseActionType.MOUSE_MOVED: {
        return {
          ...state,
          mouseX: action.mouseX,
          mouseY: action.mouseY,
        };
    }
    case MouseActionType.MOUSE_LEFT_DOWN: {
      return {
        ...state,
        mouseLeftDown: true,
      };
    }
    case MouseActionType.MOUSE_LEFT_UP: {
      console.log("Mouse up");
      return {
        ...state,
        holdLeft: false,
        mouseLeftDown: false,
      };
    }
    case MouseActionType.MOUSE_RIGHT_DOWN: {
      return {
        ...state,
        mouseRightDown: true,
      };
    }
    case MouseActionType.MOUSE_RIGHT_UP: {
      return {
        ...state,
        mouseRightDown: false,
      };
    }
    case MouseActionType.MOUSE_TRY_HOLD: {
      // If the left mouse button has been set to down
      if (state.mouseLeftDown) {
        // set hold left to true on the state
        const newState = {
          ...state,
          holdLeft: true,
        };
        // iterate and invoke registered callback functions
        state.mouseHoldCallbacks.forEach((f) => {
          setTimeout(() => f(newState, action.event), 0);
        });

        return newState;
      }
      // otherwise no change
      else {
        return {
          ...state,
        };
      }
    }
    case MouseActionType.REGISTER_CALLBACK: {
      // Add the given callback to the set of stored callback functions
      const newState = { ...state };
      newState.mouseHoldCallbacks.set(action.id, action.callback);
      return newState;
    }
    default: {
      return state;
    }
  }
}

// #region Hooks

export function useDrag() {
  const { state, dispatch } = useMouse();
  const startDrag = useCallback((callback: (state: MouseState, ev: MouseEvent) => void) => {
    const id = Math.random().toString(36).substr(2, 9);
    dispatch({
      type: MouseActionType.REGISTER_CALLBACK,
      callback,
      id,
    });
    return id;
  }, [dispatch]);

  return {
    isDragging: state.holdLeft,
    mouseX: state.mouseX,
    mouseY: state.mouseY,
    startDrag,
  };
}

export function useDrop() {
  const { state } = useMouse();
  
  return {
    isOver: state.mouseX !== null && state.mouseY !== null,
    mouseX: state.mouseX,
    mouseY: state.mouseY,
  };
}

export function useMouse() {
  const context = useContext(MouseContext);

  if (context) {
    return context;
  } else {
    throw new Error("useMouse must be used inside of an MouseProvider!");
  }
}

// #endregion
