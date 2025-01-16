import { ActionType, EditorAction, EditorState } from "../EditorReducer";
import { sectionFromId, deepCloneNode, findParentNode } from "../Helpers";

export function handleCopyAction(state: EditorState, action: EditorAction): EditorState {
  if (action.type !== ActionType.COPY_ELEMENT) {
    return state;
  }

  const { elementId } = action;
  const section = sectionFromId(elementId);
  const originalIndex = parseInt(elementId.split("-")[1]);

  // Initialize an index map to track new indices for cloned nodes
  const indexMap = new Map<number, number>();

  // Retrieve the node list for easier handling
  const nodesCopy = [...state[section].html.nodes];

  // Deep clone the node and its children
  const newNode = deepCloneNode(nodesCopy[originalIndex], nodesCopy, indexMap);

  // Add the new node to the nodes array and get the new index
  nodesCopy.push(newNode);
  const newIndex = nodesCopy.length - 1;

  // Update parent's children to include new node index
  const parentNode = findParentNode(nodesCopy, originalIndex);
  if (parentNode && parentNode.children) {
    const originalChildIndex = parentNode.children.indexOf(originalIndex);
    parentNode.children.splice(originalChildIndex + 1, 0, newIndex); // Insert right after the original
  }

  // Update the state with the new nodes array
  state[section].html.nodes = nodesCopy;

  return {...state}; // Return the updated state
}
