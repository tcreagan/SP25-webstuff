import React from 'react'
import { HtmlObject } from '../../../../types/HtmlObject'
import { Assets } from '../../../../assets/assets'
import { ActionType, useEditor } from 'state/editor/EditorReducer'
import { useDraggable } from 'state/dragAndDrop/hooks/useDraggable'

type Props = {
  widgetId: number
}

const Widget = (props: Props) => {
  const {state: editor, dispatch: _} = useEditor();
  const {dragRef, startDrag} = useDraggable(editor.widgets[props.widgetId])
  const metadata = editor.widgets[props.widgetId].metadata

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    
    // Create a drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'widget-drag-preview';
    dragImage.style.width = '200px';
    dragImage.style.height = '100px';
    dragImage.style.backgroundColor = 'rgba(74, 144, 226, 0.1)';
    dragImage.style.border = '2px dashed #4a90e2';
    dragImage.style.boxShadow = '0 0 10px rgba(74, 144, 226, 0.2)';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px'; // Move off-screen
    document.body.appendChild(dragImage);

    // Set the drag image
    e.dataTransfer.setDragImage(dragImage, 100, 50);

    // Clean up the temporary element after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);

    startDrag();
  }

  return (
    <div 
      className="widget" 
      ref={dragRef} 
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className="widget-icon">
        {Assets.images[metadata.icon! as keyof typeof Assets.images]}
      </div>
      <div className="widget-name">
        {metadata.name!}
      </div>
    </div>
  );
}

export default Widget
