import { ActionType, EditorAction, EditorState } from "../EditorReducer";
import { sectionFromId, removeNode } from "../Helpers";

// Responds to delete action events, removing the targeted element from the state.
export function handleDeleteAction(state: EditorState, action: EditorAction): EditorState {
    // Only proceed if the action is specifically a delete element action.
    if (action.type !== ActionType.DELETE_ELEMENT) {
      return state; // No state change if action type is different.
    }
  
    const { elementId } = action; // Extract the ID of the element to be deleted.
    const section = sectionFromId(elementId); // Locate which section (e.g., header, body) the element is in.
    const idNum = parseInt(elementId.split("-")[1]); // Parse the index of the element from its ID.
  
    // Execute the removal of the targeted element from its section in the state.
    const updatedSection = removeNode(idNum, state[section]);
  
    // Construct the new state, ensuring any references to the deleted element are cleared.
    const newState = {
      ...state,
      [section]: updatedSection, // Update the state section with the element removed.
      // Reset selection and hover states if they point to the deleted element.
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
      hoveredItemId: state.hoveredItemId === elementId ? null : state.hoveredItemId,
    };
  
    // Return the newly updated state to the context.
    return newState;
}