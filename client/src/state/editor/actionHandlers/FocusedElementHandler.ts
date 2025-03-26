import { ActionType, EditorAction, EditorState } from "../EditorReducer";
import { appendChild, parseId, setFocus } from "../Helpers";

export function handleFocusedElementAction(state: EditorState, action: EditorAction): EditorState {
  let target: HTMLElement | null;
  
  const modifySelectedElement = (id?: string) => {
    // Remove selection from current element if it exists
    if (state.selectedElementId) {
      target = document.getElementById(state.selectedElementId);
      if (target) {
        target.classList.remove("selected");
      }
    }

    // If no new id provided, just return
    if (!id) {
      return;
    }

    // Add selection to new element
    target = document.getElementById(id);
    if (target) {
      target.classList.add("selected");
    }
  };

  const updateElementContentEditable = (elementId: string, isEditable: boolean) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    const { section, index } = parseId(elementId);
    const target = state[section].html.nodes[index];
    
    if (target) {
      target.attributes["contentEditable"] = { value: isEditable.toString() };
      state[section].html.nodes[index] = { ...target };
    }
  };

  switch (action.type) {
    case ActionType.ELEMENT_UNSELECTED: {
      // Only unselect if the hovered element is different from the selected element
      if (state.hoveredItemId === state.selectedElementId) {
        return state;
      }

      // Remove selection from current element
      if (state.selectedElementId) {
        modifySelectedElement();
      }

      return { ...state, selectedElementId: null };
    }

    case ActionType.ELEMENT_SELECTED: {
      // Update selection
      modifySelectedElement(action.selectedId);
      
      // Ensure contentEditable is false when selecting
      if (action.selectedId) {
        updateElementContentEditable(action.selectedId, false);
      }

      return { ...state, selectedElementId: action.selectedId };
    }

    case ActionType.ELEMENT_DOUBLE_CLICKED: {
      const { section: targetSection, index: targetIndex } = parseId(action.elementId);
      const { section: containerSection, index: containerIndex } = parseId(action.elementId);
      
      const target = { ...state[targetSection].html.nodes[targetIndex] };
      const container = { ...state[containerSection].html.nodes[containerIndex] };

      const targetElement = document.getElementById(action.elementId);
      const containerElement = document.getElementById(action.containerId);

      if (!targetElement || !containerElement) return state;

      // Update contentEditable state
      updateElementContentEditable(action.elementId, true);
      
      // Update selection
      modifySelectedElement(action.containerId);
      
      // Focus the target element
      targetElement.focus();
      
      return {
        ...state,
        selectedElementId: action.containerId,
        isEditing: true,
        cursorPosition: { row: 0, col: 0 }
      };
    }

    case ActionType.ELEMENT_BLURRED: {
      const { section, index } = parseId(action.elementId);
      const target = { ...state[section].html.nodes[index] };

      const element = document.getElementById(action.elementId);
      if (!element) return state;

      // Update contentEditable state
      updateElementContentEditable(action.elementId, false);
      
      // Update the node in state
      state[section].html.nodes[index] = target;

      return { ...state, isEditing: false };
    }

    default:
      return state;
  }
}
