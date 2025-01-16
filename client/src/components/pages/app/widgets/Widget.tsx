import React from 'react'
import { HtmlObject } from '../../../../types/HtmlObject'
import { Assets } from '../../../../assets/assets'
import { ActionType, useEditor } from 'state/editor/EditorReducer'
import { useDraggable } from 'state/dragAndDrop/hooks/useDraggable'

type Props = {
  widgetId:number
}

const Widget = (props: Props) => {
  const {state: editor, dispatch: _} = useEditor();
  const {dragRef, startDrag} = useDraggable(editor.widgets[props.widgetId])
  const onMouseDown = () => {
    startDrag()
  }
  const metadata = editor.widgets[props.widgetId].metadata

  return (
    // Note that the "ref" connects the DOM element to the useDragging hook
    <div className="widget" ref={dragRef} onMouseDown={onMouseDown}>
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