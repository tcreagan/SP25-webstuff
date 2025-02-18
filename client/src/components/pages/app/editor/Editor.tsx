import { Children, default as React, ReactHTMLElement, cloneElement, useEffect, useRef, useState } from "react";
import { Header } from "./Header"
import { Body } from "./Body"
import { Footer } from "./Footer"
import { HtmlObject } from "types/HtmlObject"
import { useEditor } from "state/editor/EditorReducer";
import { StorableHtmlNode } from "types/HtmlNodes";
import { getDropChildId, insertDroppedElement, parseId } from "state/editor/Helpers";
import { useMouse } from "state/mouse/MouseReducer";
import { useDragAndDropContext } from "state/dragAndDrop/DragAndDropReducer";
//import { DragAndDropPreview } from 'components/pages/app/utils/DragAndDropPreview';


//need to decide on one declaration of Editor
type Props = {};

export function buildPreview(content:HtmlObject){

}

export const Editor = (props: Props) => {
  const { state: editor, dispatch: editorDispatch } = useEditor();
  const {state: mouseState} = useMouse();
  const {dragState} = useDragAndDropContext();

  let data = {
    header: editor.header,
    body: editor.body,
    footer: editor.footer
  }

  // Handle the drag-and-drop preview logic outside the Editor component
  /*
  data = DragAndDropPreview({
    editor,
    dragState,
    mouseState,
    data
  }); */
  
  return (
    <div id="editor-window" className="editor">
      <div className="editor-container">
        <div className="header-section">
          <div className="tab">Header</div>
          <Header content={data.header}
          /> 
        </div> 
        <div className="body-section">
          <div className="tab">Body</div>
          <Body content={data.body}
          /> 
        </div> 
        <div className="footer-section">
          <div className="tab">Footer</div>
          <Footer content={data.footer}
          /> 
        </div> 
      </div>
    </div>
  );
};

/*
//gpt generated 
//needs review, should replace some code above
//creates a droppable area for the draggable widgets
//may not be necessary, check other files
import { useDrop } from 'react-dnd';
import DraggableImageWidget from './DraggableImageWidget';

interface WidgetPosition {
  id: string;
  left: number;
  top: number;
}

const Editor: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetPosition[]>([]);  // Track widget positions

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',   // Accept draggable items of type 'widget'
    drop: (item: { id: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        let newLeft = offset.x;
        let newTop = offset.y;
        let horizonatalAlignment = false;
        let verticalAlignment = false;
        
        //cannot find snapThreshold and others, need to import utils
        // Check snapping to other widgets (gpt)
        widgets.forEach((widget) => {
          if (widget.id !== item.id) {
            const draggedWidgetEdges = { left: newLeft, top: newTop, right: newLeft + 200, bottom: newTop + 100 }; // assuming dragged widget size
            const otherWidgetEdges = getWidgetEdges(widget);

            // Check horizontal and vertical alignment (gpt)
            if (checkHorizontalAlignment(draggedWidgetEdges, otherWidgetEdges)) {
              horizontalAlignment = true;
            }
            if (checkVerticalAlignment(draggedWidgetEdges, otherWidgetEdges)) {
              verticalAlignment = true;
            }

            setAlignmentGuides({ horizontal: horizontalAlignment, vertical: verticalAlignment });

            // Snap to the left or right edges
            if (isCloseEnough(draggedWidgetEdges.left, otherWidgetEdges.right, SNAP_THRESHOLD)) {
              newLeft = otherWidgetEdges.right;
            } else if (isCloseEnough(draggedWidgetEdges.right, otherWidgetEdges.left, SNAP_THRESHOLD)) {
              newLeft = otherWidgetEdges.left - 200; // adjusting for widget width
            }

            // Snap to the top or bottom edges
            if (isCloseEnough(draggedWidgetEdges.top, otherWidgetEdges.bottom, SNAP_THRESHOLD)) {
              newTop = otherWidgetEdges.bottom;
            } else if (isCloseEnough(draggedWidgetEdges.bottom, otherWidgetEdges.top, SNAP_THRESHOLD)) {
              newTop = otherWidgetEdges.top - 100; // adjusting for widget height
            }
          }
        });
        // Snap the position to the grid
        const [left, top] = snapToGrid(offset.x, offset.y);
        
        
        const newWidget: WidgetPosition = {
          id: item.id,
          left: offset.x,  // Position based on where the item was dropped
          top: offset.y,
        };
        setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="editor" style={{ width: '100%', height: '500px', position: 'relative', border: '1px solid black' }}>
      <h2>Drag Widgets into the Editor</h2>

      {/* Render all widgets at their respective positions }/*
      {widgets.map((widget) => (
        <div key={widget.id} style={{ position: 'absolute', left: widget.left, top: widget.top }}>
          <DraggableImageWidget
            id={widget.id}
            initialUrl="https://example.com/default-image.jpg"
            initialAlt="Default Image"
            initialStyles={{ width: '200px', height: 'auto', border: '1px solid #ccc' }}
            onSave={(data) => console.log('Widget data saved:', data)} //needs any type fix if used
          />
        </div>
      ))}
    </div>
  );
};

export default Editor;

//gpt 
//review 
//layout selector in editor so it can switch between layouts
import ContainerEditor from './ContainerEditor';
import CardEditor from './CardEditor';
import LayeredEditor from './LayeredEditor';

export const Editor = () => {
  const [layoutType, setLayoutType] = useState('container');  // Default layout type
  const [isPreview, setIsPreview] = useState(false);  // Preview Mode Toggle

  // Change Layout Type
  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayoutType(e.target.value);
  };

  // Toggle Preview Mode
  const togglePreview = () => setIsPreview(!isPreview);

  return (
    <div id="editor-window" className={`editor ${isPreview ? 'preview-mode' : ''}`}>
      {/* Layout Selector }/*
      <div className="controls">
        <select onChange={handleLayoutChange} value={layoutType}>
          <option value="container">Container Layout</option>
          <option value="card">Card Layout</option>
          <option value="layered">Layered Layout</option>
        </select>
        <button onClick={togglePreview}>
          {isPreview ? 'Edit Mode' : 'Preview Mode'}
        </button>
      </div>

      {/* Render Layout Based on Selection }/*
      <div className="editor-container">
        {layoutType === 'container' && <ContainerEditor />}
        {layoutType === 'card' && <CardEditor />}
        {layoutType === 'layered' && <LayeredEditor />}
      </div>
    </div>
  );
};
*/
