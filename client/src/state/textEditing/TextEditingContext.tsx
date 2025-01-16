import {
  ReactNode,
  createContext,
  useReducer,
} from "react";
import React from "react";
import { TextEditingAction, TextEditingState, textEditingReducer } from "./TextEditingReducer";

export type TextEditingContext = {
  state: TextEditingState;
  dispatch: React.Dispatch<TextEditingAction>;
} | null;

const initialTextEditingState: TextEditingState = {
  isEditing: false,
  cursorPosition: null,
  selectedElementId: null
};

export const TextEditingContext = createContext<TextEditingContext>(null);

export function TextEditingProvider({ children }: { children: ReactNode }) {
  const [textEditingState, dispatch] = useReducer(textEditingReducer, initialTextEditingState);

  // useEffect(() => {
  //   if(!textEditingState.selectedElementId || !textEditingState.cursorPosition) return;

  //   const {section, index} = parseId(textEditingState.selectedElementId)

  //   const nodes = textEditingState[section].html.nodes
  //   const containerNode = nodes[index]

  //   if(!containerNode || !containerNode.children) return;

  //   const rowIndex = containerNode.children[textEditingState.cursorPosition.row]

  //   console.log(rowIndex)

  //   const rowNode = nodes[rowIndex]

  //   const rowElement = document.getElementById(textEditingState.selectedElementId[0] + "-" + rowIndex.toString())

  //   if(!rowElement) return;

  //   let selection = window.getSelection();
  //   let range = document.createRange();
    
  //   if(!rowElement.firstChild){
  //     rowElement.textContent = " "
  //   }
    
  //       console.log(textEditingState.cursorPosition)
  //       console.log(rowElement)

  //   const textNode = rowElement.firstChild

  //   console.log(textNode)

  //   if(textNode && textNode.nodeType === Node.TEXT_NODE){

  //     rowElement.contentEditable = "true"
  //     rowElement.focus()
  //     range.setStart(textNode, textEditingState.cursorPosition.col)
  //     range.setEnd(textNode, textEditingState.cursorPosition.col)
  //     ///range.collapse(true)
  //     selection?.removeAllRanges()
  //     selection?.addRange(range)
  //   }

  // }, [textEditingState.cursorPosition]);

  return (
    <TextEditingContext.Provider value={{ state: textEditingState, dispatch: dispatch }}>
      {children}
    </TextEditingContext.Provider>
  );
}
