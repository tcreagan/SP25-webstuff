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
  TEXTBOX_KEYPRESS = "TEXTBOX_KEYPRESS",
  TEXT_CHANGED = "TEXT_CHANGED"
}

export type TextEditingAction =
  | { type: TextEditingActionType.TEXTBOX_KEYPRESS; editorState:EditorState; key:Key; elementId:string }
  | { type: TextEditingActionType.TEXT_CHANGED; editorState:EditorState; elementId:string; newText:string }

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
      const cursorPosition = state.cursorPosition ?? { col: 0, row: 0 };
      const { section, index } = parseId(action.elementId);
      const newState = { ...state };
      const parentNode = { ...action.editorState[section].html.nodes[index] };

      if (!parentNode.children || !state.cursorPosition) return state;

      const textboxChildIndex = parentNode.children[state.cursorPosition.row];
      const textbox = { ...action.editorState[section].html.nodes[textboxChildIndex] };

      let newCursorPosition = { ...cursorPosition };
      let newText = textbox.attributes["text"]?.value ?? "";

      switch (action.key) {
        case KeyboardKeys.Backspace:
          if (cursorPosition.col > 0) {
            newText = newText.substring(0, cursorPosition.col - 1) + newText.substring(cursorPosition.col);
            newCursorPosition.col = Math.max(0, cursorPosition.col - 1);
          }
          break;
        case KeyboardKeys.Delete:
          if (cursorPosition.col < newText.length) {
            newText = newText.substring(0, cursorPosition.col) + newText.substring(cursorPosition.col + 1);
          }
          break;
        case KeyboardKeys.ArrowLeft:
          newCursorPosition.col = Math.max(0, cursorPosition.col - 1);
          break;
        case KeyboardKeys.ArrowRight:
          newCursorPosition.col = Math.min(newText.length, cursorPosition.col + 1);
          break;
        case KeyboardKeys.ArrowUp:
          newCursorPosition.row = Math.max(0, cursorPosition.row - 1);
          break;
        case KeyboardKeys.ArrowDown:
          const maxRow = parentNode.children?.length ? parentNode.children.length - 1 : 0;
          newCursorPosition.row = Math.min(maxRow, cursorPosition.row + 1);
          break;
        case KeyboardKeys.Enter:
          // Handle enter key if needed
          break;
        default:
          // Handle alphanumeric keys
          newText = newText.substring(0, cursorPosition.col) + action.key + newText.substring(cursorPosition.col);
          newCursorPosition.col += 1;
          break;
      }

      // Update the text in the textbox
      textbox.attributes["text"].value = newText;

      return {
        ...newState,
        cursorPosition: newCursorPosition
      };

    case TextEditingActionType.TEXT_CHANGED:
      const { section: changedSection, index: changedIndex } = parseId(action.elementId);
      const changedNode = { ...action.editorState[changedSection].html.nodes[changedIndex] };
      if (changedNode && changedNode.attributes["text"]) {
        changedNode.attributes["text"].value = action.newText;
      }
      return state;

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
