// DragAndDropPreview.ts
//figure out where the functions are coming from and import accordingly
//also fix 'any' types in parameters
import React from 'react'
import {HtmlObject} from "types/HtmlObject"
//lots of function need to be defined 
export function DragAndDropPreview({ editor: any, dragState: any, mouseState: any, data: any }) {
  if(dragState.isDragging && editor.hoveredItemId && dragState.canDrop){
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
