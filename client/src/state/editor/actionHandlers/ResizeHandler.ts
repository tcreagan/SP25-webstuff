import { ActionType, EditorAction, EditorState } from "../EditorReducer";
import { parseId, sectionFromId } from "../Helpers";
import { StorableHtmlNode } from "types/HtmlNodes";

export function handleResizeAction(state: EditorState, action: EditorAction): EditorState {
  if (action.type !== ActionType.RESIZE_ELEMENT) return state;

  const { elementId, width, height } = action;
  const { section, index } = parseId(elementId);

  // Create a deep copy of the state sections to avoid mutations
  const newState = { ...state };
  const sectionData = { ...newState[section] };
  
  // Create a deep copy of nodes array
  const nodesCopy = [...sectionData.html.nodes];
  
  // Update the node with new dimensions
  if (nodesCopy[index]) {
    nodesCopy[index] = {
      ...nodesCopy[index],
      style: {
        ...nodesCopy[index].style,
        width: { value: `${width}px`, suppress: false },
        height: { value: `${height}px`, suppress: false }
      }
    };
  }

  // Update the section with the new nodes array
  sectionData.html.nodes = nodesCopy;
  newState[section] = sectionData;

  return newState;
} 
