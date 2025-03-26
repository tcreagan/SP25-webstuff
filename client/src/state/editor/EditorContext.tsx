import { ReactNode, createContext, useEffect, useReducer } from "react";
import React from "react";
import {
  ActionType,
  EditorAction,
  EditorState,
  editorReducer,
} from "state/editor/EditorReducer";
import { parseId } from "./Helpers";
import { MouseActionType, useMouse } from "state/mouse/MouseReducer";

export type EditorContext = {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
} | null;

// Create a base state object to avoid circular references
const createBaseState = (): EditorState => ({
  isDragging: false,
  isEditing: false,
  draggedItemId: null,
  hoveredItemId: null,
  selectedElementId: null,
  cursorPosition: null,
  widgets: [],
  header: {
    metadata: { type: "PAGE_SECTION" },
    html: {
      nodes: [{
        element: "div",
        attributes: { className: { value: "header-root" } },
        style: {},
        children: [],
        metadata: { childDirection: "horizontal", droppable: true }
      }]
    }
  },
  body: {
    metadata: { type: "PAGE_SECTION" },
    html: {
      nodes: [{
        element: "div",
        attributes: { className: { value: "body-root" } },
        style: {},
        children: [],
        metadata: { childDirection: "vertical", droppable: true }
      }]
    }
  },
  footer: {
    metadata: { type: "PAGE_SECTION" },
    html: {
      nodes: [{
        element: "div",
        attributes: { className: { value: "footer-root" } },
        style: {},
        children: [],
        metadata: { childDirection: "horizontal", droppable: true }
      }]
    }
  },
  history: [],
  historyIndex: 0
});

const initialState: EditorState = {
  ...createBaseState(),
  history: [createBaseState()],
  historyIndex: 0
};

export const EditorContext = createContext<EditorContext>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [editor, dispatch] = useReducer(editorReducer, initialState);
  const { state: mouseState, dispatch: mouseDispatch } = useMouse();

  useEffect(() => {
    // wire up mouse tracking for the page
    document.addEventListener("mousemove", (ev: MouseEvent) => {
      mouseDispatch({
        type: MouseActionType.MOUSE_MOVED,
        mouseX: ev.clientX,
        mouseY: ev.clientY,
      });
    });

    const editorWindow = document.getElementById("editor-window")

    if(editorWindow){
      editorWindow.addEventListener("mouseup", () => dispatch({type: ActionType.ELEMENT_UNSELECTED}))
    }
  }, [])

  // document.body.onmouseup = (ev: MouseEvent) => {
  //   if (!editor.draggedItemId || !editor.hoveredItemId) {
  //     dispatch({ type: ActionType.CANCEL_DRAG });
  //   }
  // };

  useEffect(() => {
    // declare logic for setting cursor based on drag state
    const updateCursor = () => {
      if (editor.isDragging) {
        document.body.style.cursor = "move";
      } else {
        document.body.style.cursor = "default";
      }
    };

    updateCursor();

    return () => {
      // Reset cursor when component unmounts
      document.body.style.cursor = "default";
    };
  }, [editor.isDragging]);

  useEffect(() => {
    if (!editor.selectedElementId || !editor.cursorPosition) return;

    const { section, index } = parseId(editor.selectedElementId);

    const nodes = editor[section].html.nodes;
    const containerNode = nodes[index];

    if (!containerNode || !containerNode.children) return;

    const rowIndex = containerNode.children[editor.cursorPosition.row];

    console.log(rowIndex);

    const rowNode = nodes[rowIndex];

    const rowElement = document.getElementById(
      editor.selectedElementId[0] + "-" + rowIndex.toString()
    );

    if (!rowElement) return;

    let selection = window.getSelection();
    let range = document.createRange();

    if (!rowElement.firstChild) {
      rowElement.textContent = " ";
    }

    console.log(editor.cursorPosition);
    console.log(rowElement);

    const textNode = rowElement.firstChild;

    console.log(textNode);

    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      rowElement.contentEditable = "true";
      rowElement.focus();
      range.setStart(textNode, editor.cursorPosition.col);
      range.setEnd(textNode, editor.cursorPosition.col);
      ///range.collapse(true)
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [editor.cursorPosition]);

  return (
    <EditorContext.Provider value={{ state: editor, dispatch: dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}
