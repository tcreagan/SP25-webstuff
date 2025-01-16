
// #region reducer definition

import { Key, useContext } from "react";
import { EditorContext } from "state/editor/EditorContext";
import { StorableHtmlNode } from "types/HtmlNodes";
import { HtmlObject } from "types/HtmlObject";
import { MouseState } from "state/mouse/MouseReducer";
import KeyboardKeys from "types/KeyboardKeys";
import { parseId } from "state/editor/Helpers";
import { EditorState } from "state/editor/EditorReducer";
import { TextEditingContext } from "./TextEditingContext";

// #region type and constant definitions

// Define action types
export enum TextEditingActionType {
  TEXTBOX_KEYPRESS = "TEXTBOX_KEYPRESS"
}

export type TextEditingAction =
  | { type: TextEditingActionType.TEXTBOX_KEYPRESS; editorState:EditorState; key:Key; elementId:string }

export type TextEditingState = {
  isEditing: boolean;
  selectedElementId: string | null;
  cursorPosition: {row:number, col:number} | null;
};

// #endregion

// Define a reducer to manage the state of the editor
export function textEditingReducer(state: TextEditingState, action: TextEditingAction): TextEditingState {
  switch (action.type) {
    case TextEditingActionType.TEXTBOX_KEYPRESS:
      console.log(action.key)

      const cursorPosition = state.cursorPosition ?? { col: 0, row: 0 }
      const { section, index } = parseId(action.elementId)
      const newState = { ...state }
      const parentNode = action.editorState[section].html.nodes[index]

      if (!parentNode.children || !state.cursorPosition) return state;

      const textboxChildIndex = parentNode.children[state.cursorPosition.row]

      const textbox = action.editorState[section].html.nodes[textboxChildIndex]

      let newCursorPosition = { ...cursorPosition };

      console.log(newCursorPosition)

      switch (action.key) {
        case KeyboardKeys.Backspace:
          // Handle Backspace key press
          // Update state accordingly
          newCursorPosition.col = Math.max(0, cursorPosition.col - 1);
          break;
        case KeyboardKeys.Delete:
          break;
        case KeyboardKeys.ArrowLeft:
          // Handle Arrow Left key press
          // Update cursor position accordingly
          newCursorPosition.col = Math.max(0, cursorPosition.col - 1);
          break;
        case KeyboardKeys.ArrowRight:
          // Handle Arrow Right key press
          // Update cursor position accordingly
          newCursorPosition.col = Math.min(textbox.attributes["text"]?.value.length ?? 0, cursorPosition.col + 1);
          break;
        case KeyboardKeys.ArrowUp:
          // Handle Arrow Left key press
          // Update cursor position accordingly
          newCursorPosition.row = Math.max(0, cursorPosition.row - 1);
          break;
        case KeyboardKeys.ArrowDown:
          // Handle Arrow Right key press
          // Update cursor position accordingly
          const maxRow = parentNode.children?.length ? parentNode.children.length - 1 : 0
          newCursorPosition.row = Math.min(maxRow, cursorPosition.row + 1);
          break;
        case KeyboardKeys.Enter:
          break;
        default:
          // Handle alphanumeric keys
          // Update state accordingly
          // For example, insert the pressed character at the cursor position
          const textBeforeCursor = (textbox.attributes["text"].value ?? "").substring(0, cursorPosition.col) || '';
          const textAfterCursor = (textbox.attributes["text"].value ?? "").substring(cursorPosition.col) || '';
          textbox.attributes["text"].value = textBeforeCursor + action.key + textAfterCursor;
          newCursorPosition.col += 1;
          break;
      }

      return {
        ...newState,
        cursorPosition: newCursorPosition
      };
    default:
      return state;
  }
}

// #region Hooks

// export function useDrag() { }

// export function useDrop() { }

export function useTextEditing() {
  const context = useContext(TextEditingContext);

  if (context) {
    return context;
  } else {
    throw new Error("useTextEditing must be used inside of an TextEditingProvider!");
  }
}

// #endregion