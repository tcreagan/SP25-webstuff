// DragAndDropPreview.ts
//figure out where the functions are coming from and import accordingly
//also fix 'any' types in parameters
import React from 'react'
import { HtmlObject } from "types/HtmlObject"
import { mouseState } from 'state/mouse/MouseReducer'
import { DragAndDropState } from 'state/dragAndDrop/DragAndDropReducer'
import { HtmlObject } from 'types/HtmlObject'

//lots of function need to be defined 
interface Editor {
  hoveredItemId: string | number;
}

// Parses hoveredItemId into section and index (e.g., "section:index")
function parseId(hoveredItemId: string | number): { section: number; index: number } {
  const [section, index] = hoveredItemId.toString().split(':').map(Number);
  return { section, index };
}

// Predicts where the child should be dropped based on mouseState and editor structure
function getDropChildId(
  mouseState: MouseState,
  editor: Editor,
  hoveredItemId: string | number
): number {
  const { section, index } = parseId(hoveredItemId);
  const predictedIndex = index; // Placeholder: Implement more complex logic if needed
  return predictedIndex;
}

// Inserts the preview element at the predicted index in the editor section
function insertDroppedElement(
  predictedIndex: number,
  editor: Editor,
  previewObject: HtmlObject,
  hoveredItemId: string | number
): Editor {
  const { section } = parseId(hoveredItemId);
  const sectionClone = structuredClone(editor[section]);
  sectionClone.splice(predictedIndex, 0, previewObject); // Insert at predictedIndex
  return {
    ...editor,
    [section]: sectionClone,
  };
}
export function DragAndDropPreview({ editor: Editor, DragAndDropState: DragAndDropState, mouseState: mouseState, data: HtmlObject }) {
  if(dragState.isDragging && editor.hoveredItemId && DragAndDropState.canDrop){
    const {section, index} = parseId(editor.hoveredItemId); //cannot be found 
    const predictedIndex = getDropChildId(mouseState, editor, editor.hoveredItemId); //cannot be found

    const previewObject:HtmlObject = {
      metadata: { type: "WIDGET" },
      html: {
        nodes: [
          {
            element: "div",
            style: {},
            attributes: { "className": { value: "preview" } },
            metadata: { preview: true }
          }
        ]
      }
    };

    // Insert the preview element into the correct section
    data[section] = structuredClone(editor[section]);
    data[section] = insertDroppedElement(predictedIndex, editor, previewObject, editor.hoveredItemId)[section]; //cannot be found
  }

  return data;
}
