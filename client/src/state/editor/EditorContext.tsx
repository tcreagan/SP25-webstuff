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

export const EditorContext = createContext<EditorContext>(null);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialState: EditorState = {
    header: {
      metadata: {
        type: "PAGE_SECTION",
      },
      html: {
        nodes: [
          {
            element: "div",
            attributes: {
              className: { value: "header-root" },
            },
            style: {},
            children: [],
            metadata: { childDirection: "horizontal", droppable: true },
          },
        ],
      },
    },
    body: {
      metadata: {
        type: "PAGE_SECTION",
      },
      html: {
        nodes: [
          {
            element: "div",
            children: [],
            attributes: {
              className: { value: "body-root" },
            },
            style: {},
            metadata: { childDirection: "vertical", droppable: true },
          },
        ],
      },
    },
    footer: {
      metadata: {
        type: "PAGE_SECTION",
      },
      html: {
        nodes: [
          {
            element: "div",
            children: [],
            attributes: {
              className: { value: "footer-root" },
            },
            style: {},
            metadata: { childDirection: "horizontal", droppable: true },
          },
        ],
      },
    },
    widgets: [],
    selectedElementId: null,
    hoveredItemId: null,
    isDragging: false,
    isEditing: false,
    cursorPosition: null,
    draggedItemId: null,
    history: [{
      isDragging: false,
      isEditing: false,
      draggedItemId: null,
      hoveredItemId: null,
      selectedElementId: null,
      cursorPosition: null,
      widgets: [],
      header: {
        metadata: {
          type: "PAGE_SECTION",
        },
        html: {
          nodes: [
            {
              element: "div",
              attributes: {
                className: { value: "header-root" },
              },
              style: {},
              children: [],
              metadata: { childDirection: "horizontal", droppable: true },
            },
          ],
        },
      },
      body: {
        metadata: {
          type: "PAGE_SECTION",
        },
        html: {
          nodes: [
            {
              element: "div",
              children: [],
              attributes: {
                className: { value: "body-root" },
              },
              style: {},
              metadata: { childDirection: "vertical", droppable: true },
            },
          ],
        },
      },
      footer: {
        metadata: {
          type: "PAGE_SECTION",
        },
        html: {
          nodes: [
            {
              element: "div",
              children: [],
              attributes: {
                className: { value: "footer-root" },
              },
              style: {},
              metadata: { childDirection: "horizontal", droppable: true },
            },
          ],
        },
      },
      history: [],
      historyIndex: 0
    }],
    historyIndex: 0
  };

  const [state, dispatch] = useReducer(editorReducer, initialState);
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
      if (state.isDragging) {
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
  }, [state.isDragging]);

  useEffect(() => {
    if (!state.selectedElementId || !state.cursorPosition) return;

    const { section, index } = parseId(state.selectedElementId);

    const nodes = state[section].html.nodes;
    const containerNode = nodes[index];

    if (!containerNode || !containerNode.children) return;

    const rowIndex = containerNode.children[state.cursorPosition.row];

    console.log(rowIndex);

    const rowNode = nodes[rowIndex];

    const rowElement = document.getElementById(
      state.selectedElementId[0] + "-" + rowIndex.toString()
    );

    if (!rowElement) return;

    let selection = window.getSelection();
    let range = document.createRange();

    if (!rowElement.firstChild) {
      rowElement.textContent = " ";
    }

    console.log(state.cursorPosition);
    console.log(rowElement);

    const textNode = rowElement.firstChild;

    console.log(textNode);

    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      rowElement.contentEditable = "true";
      rowElement.focus();
      range.setStart(textNode, state.cursorPosition.col);
      range.setEnd(textNode, state.cursorPosition.col);
      ///range.collapse(true)
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [state.cursorPosition]);

  return (
    <EditorContext.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}
