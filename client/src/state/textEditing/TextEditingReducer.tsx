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
  START_EDITING = "START_EDITING",
  STOP_EDITING = "STOP_EDITING"
}

export type TextEditingAction =
  | { type: TextEditingActionType.TEXTBOX_KEYPRESS; editorState:EditorState; key:Key; elementId:string }
  | { type: TextEditingActionType.START_EDITING; elementId: string }
  | { type: TextEditingActionType.STOP_EDITING }

export type TextEditingState = {
  isEditing: boolean;
  selectedElementId: string | null;
  cursorPosition: {row:number, col:number} | null;
};

// Initial state for text editing
export const initialTextEditingState: TextEditingState = {
  isEditing: false,
  selectedElementId: null,
  cursorPosition: null
};

// #endregion

// Define a reducer to manage the state of the editor
export function textEditingReducer(state: TextEditingState, action: TextEditingAction): TextEditingState {
  switch (action.type) {
    case TextEditingActionType.START_EDITING:
      return {
        ...state,
        isEditing: true,
        selectedElementId: action.elementId,
        cursorPosition: { row: 0, col: 0 }
      };

    case TextEditingActionType.STOP_EDITING:
      return {
        ...state,
        isEditing: false,
        selectedElementId: null,
        cursorPosition: null
      };

    case TextEditingActionType.TEXTBOX_KEYPRESS:
      if (!state.isEditing || !state.selectedElementId) return state;

      const cursorPosition = state.cursorPosition ?? { col: 0, row: 0 }
      const { section, index } = parseId(action.elementId)
      const newState = { ...state }
      const parentNode = action.editorState[section].html.nodes[index]

      if (!parentNode.children || !state.cursorPosition) return state;

      const textboxChildIndex = parentNode.children[state.cursorPosition.row]
      const textbox = action.editorState[section].html.nodes[textboxChildIndex]
      
      if (!textbox.attributes["text"]) {
        textbox.attributes["text"] = { value: "" };
      }

      let newCursorPosition = { ...cursorPosition };
      const currentText = textbox.attributes["text"].value ?? "";

      switch (action.key) {
        case KeyboardKeys.Backspace:
          if (cursorPosition.col > 0) {
            const textBeforeCursor = currentText.substring(0, cursorPosition.col - 1);
            const textAfterCursor = currentText.substring(cursorPosition.col);
            textbox.attributes["text"].value = textBeforeCursor + textAfterCursor;
            newCursorPosition.col = Math.max(0, cursorPosition.col - 1);
          } else if (cursorPosition.row > 0) {
            // Merge with previous line
            const prevTextboxChildIndex = parentNode.children[cursorPosition.row - 1];
            const prevTextbox = action.editorState[section].html.nodes[prevTextboxChildIndex];
            const prevText = prevTextbox.attributes["text"].value ?? "";
            prevTextbox.attributes["text"].value = prevText + currentText;
            
            // Remove current line
            parentNode.children.splice(cursorPosition.row, 1);
            newCursorPosition = {
              row: cursorPosition.row - 1,
              col: prevText.length
            };
          }
          break;

        case KeyboardKeys.Delete:
          if (cursorPosition.col < currentText.length) {
            const textBeforeCursor = currentText.substring(0, cursorPosition.col);
            const textAfterCursor = currentText.substring(cursorPosition.col + 1);
            textbox.attributes["text"].value = textBeforeCursor + textAfterCursor;
          } else if (cursorPosition.row < (parentNode.children.length - 1)) {
            // Merge with next line
            const nextTextboxChildIndex = parentNode.children[cursorPosition.row + 1];
            const nextTextbox = action.editorState[section].html.nodes[nextTextboxChildIndex];
            const nextText = nextTextbox.attributes["text"].value ?? "";
            textbox.attributes["text"].value = currentText + nextText;
            
            // Remove next line
            parentNode.children.splice(cursorPosition.row + 1, 1);
          }
          break;

        case KeyboardKeys.Enter:
          // Create new text node
          const newTextNode: StorableHtmlNode = {
            element: "text",
            style: {},
            attributes: {
              text: { value: currentText.substring(cursorPosition.col) }
            }
          };
          
          // Update current line
          textbox.attributes["text"].value = currentText.substring(0, cursorPosition.col);
          
          // Insert new node
          const newTextNodeIndex = action.editorState[section].html.nodes.length;
          action.editorState[section].html.nodes.push(newTextNode);
          parentNode.children.splice(cursorPosition.row + 1, 0, newTextNodeIndex);
          
          newCursorPosition = {
            row: cursorPosition.row + 1,
            col: 0
          };
          break;

        case KeyboardKeys.ArrowLeft:
          if (cursorPosition.col > 0) {
            newCursorPosition.col = cursorPosition.col - 1;
          } else if (cursorPosition.row > 0) {
            const prevTextboxChildIndex = parentNode.children[cursorPosition.row - 1];
            const prevTextbox = action.editorState[section].html.nodes[prevTextboxChildIndex];
            newCursorPosition = {
              row: cursorPosition.row - 1,
              col: (prevTextbox.attributes["text"].value ?? "").length
            };
          }
          break;

        case KeyboardKeys.ArrowRight:
          if (cursorPosition.col < currentText.length) {
            newCursorPosition.col = cursorPosition.col + 1;
          } else if (cursorPosition.row < (parentNode.children.length - 1)) {
            newCursorPosition = {
              row: cursorPosition.row + 1,
              col: 0
            };
          }
          break;

        case KeyboardKeys.ArrowUp:
          if (cursorPosition.row > 0) {
            const prevTextboxChildIndex = parentNode.children[cursorPosition.row - 1];
            const prevTextbox = action.editorState[section].html.nodes[prevTextboxChildIndex];
            newCursorPosition = {
              row: cursorPosition.row - 1,
              col: Math.min(cursorPosition.col, (prevTextbox.attributes["text"].value ?? "").length)
            };
          }
          break;

        case KeyboardKeys.ArrowDown:
          if (cursorPosition.row < (parentNode.children.length - 1)) {
            const nextTextboxChildIndex = parentNode.children[cursorPosition.row + 1];
            const nextTextbox = action.editorState[section].html.nodes[nextTextboxChildIndex];
            newCursorPosition = {
              row: cursorPosition.row + 1,
              col: Math.min(cursorPosition.col, (nextTextbox.attributes["text"].value ?? "").length)
            };
          }
          break;

        default:
          // Handle alphanumeric and special character keys
          if (typeof action.key === 'string' && action.key.length === 1) { // Only handle single character inputs
            const textBeforeCursor = currentText.substring(0, cursorPosition.col);
            const textAfterCursor = currentText.substring(cursorPosition.col);
            textbox.attributes["text"].value = textBeforeCursor + action.key + textAfterCursor;
            newCursorPosition.col += 1;
          }
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

export function useTextEditing() {
  const context = useContext(TextEditingContext);

  if (context) {
    return context;
  } else {
    throw new Error("useTextEditing must be used inside of an TextEditingProvider!");
  }
}

// #endregion
