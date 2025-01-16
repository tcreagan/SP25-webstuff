import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";
import React from "react";
import { MouseState, MouseAction, mouseReducer, MouseActionType } from "./MouseReducer";

export type MouseContext = {
  state: MouseState;
  dispatch: React.Dispatch<MouseAction>;
} | null;

const initialMouseState: MouseState = {
  mouseX: null,
  mouseY: null,
  holdLeft: false,
  mouseLeftDown: false,
  mouseRightDown: false,
  mouseHoldCallbacks: new Map<string, (state: MouseState, ev: MouseEvent) => void>()
};

export const MouseContext = createContext<MouseContext>(null);

export function MouseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mouseReducer, initialMouseState);

  useEffect(() => {
    // wire up mouse movement tracking for the page
    document.body.onmousemove = (ev: MouseEvent) => {
      dispatch({
        type: MouseActionType.MOUSE_MOVED,
        mouseX: ev.clientX,
        mouseY: ev.clientY,
      });
    };

    // Event listener to track mouse clicking
    document.addEventListener("mousedown", (ev: MouseEvent) => {
      // If left mouse button pressed
      if(ev.buttons === 1){
        // Conditional to prevent buildup of timeouts
        if(!state.mouseLeftDown){
          setTimeout(() => {
            dispatch({type: MouseActionType.MOUSE_TRY_HOLD, event:ev})
          }, 400);
        }

        dispatch({
          type: MouseActionType.MOUSE_LEFT_DOWN,
        });
        
      }
    },true);
  
    // Event listener to track mouse release
    document.addEventListener("mouseup", (ev: MouseEvent) => {
      // If no buttons pressed
      if(ev.buttons === 0){
        // Send mouse up action
        dispatch({
          type: MouseActionType.MOUSE_LEFT_UP,
        });
      }
    }, true)
  }, [])

  return (
    <MouseContext.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </MouseContext.Provider>
  );
}
