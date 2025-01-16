import { ActionType, EditorAction, EditorState } from "../EditorReducer";
import { appendChild, parseId, setFocus } from "../Helpers";

export function handleFocusedElementAction(state: EditorState, action: EditorAction):EditorState{
  let target: HTMLElement | null;
  
  const modifySelectedElement = (id?:string) => {
    if (state.selectedElementId) {
      target = document.getElementById(state.selectedElementId);

      if (target) {
        target.classList.remove("selected");
      }
    }

    if(!id){
      return;
    }

    target = document.getElementById(id);

    // give hovered element the 'hovered' class for styling
    if (target) {
      target.classList.add("selected");
    }
  }

  switch (action.type) {
    case ActionType.ELEMENT_UNSELECTED:{
      console.log(state.hoveredItemId, state.selectedElementId)
      if(state.hoveredItemId === state.selectedElementId){
        return state;
      }
      console.log("unselect")
      if(state.selectedElementId){
        modifySelectedElement()
      }

      return {...state, selectedElementId: null}
    }
    case ActionType.ELEMENT_SELECTED:
      modifySelectedElement(action.selectedId)

      // track hovered id in state
      return { ...state, selectedElementId: action.selectedId };

    case ActionType.ELEMENT_DOUBLE_CLICKED: {
      const newState = {...state}

      const {section:targetSection, index:targetIndex} = parseId(action.elementId)
      const {section:containerSection, index:containerIndex} = parseId(action.elementId)
      
      let target = state[targetSection].html.nodes[targetIndex]
      const container = state[containerSection].html.nodes[containerIndex]

      let targetElement = document.getElementById(action.elementId)
      const containerElement = document.getElementById(action.containerId)

      if(!targetElement || !containerElement) return state;
      target.attributes["contentEditable"] = {value: "true"}

      
      state[targetSection].html.nodes[targetIndex] = target
      
      modifySelectedElement(action.containerId)
      
      // setFocus(targetElement)
      // targetElement.focus()

      return {...newState, selectedElementId: action.containerId, isEditing: true, cursorPosition: {row: 0, col: 0}}
    }

    case ActionType.ELEMENT_BLURRED: {
      const {section, index} = parseId(action.elementId)
      
      const target = state[section].html.nodes[index]

      const element = document.getElementById(action.elementId)

      console.log("blurred:", element)

      if(!element) return state;

      target.attributes["contentEditable"] = {value: "false"}

      state[section].html.nodes[index] = target

      return {...state, isEditing: false}
    }
    default:
      return state;
  }
}