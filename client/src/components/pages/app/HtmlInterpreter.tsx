import React, {
  HtmlHTMLAttributes,
  MouseEventHandler,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  ReactNode,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { RenderableHtmlNode, StorableHtmlNode } from "types/HtmlNodes";
import "styles/modal.css";
import "styles/textbox.css";
import { ActionType, useEditor } from "state/editor/EditorReducer";
import TrashIcon from "../../../assets/images/trash-icon.svg";
import CopyIcon from "../../../assets/images/copy-icon.svg";
import CodeIcon from "../../../assets/images/code-icon.svg";
import { BsPlusSquareFill } from "react-icons/bs";
import { useDragAndDropContext } from "state/dragAndDrop/DragAndDropReducer";
import { useDraggable } from "state/dragAndDrop/hooks/useDraggable";
import { useDroppable } from "state/dragAndDrop/hooks/useDroppable";
import { sectionFromId, storableNodeToHtmlObject } from "state/editor/Helpers";
import { MouseActionType, useMouse } from "state/mouse/MouseReducer";
import {
  useTextEditing,
  TextEditingActionType,
} from "state/textEditing/TextEditingReducer";
import ReactModal from "react-modal"; // Used to create a modal for viewing HTML code
import Prism from "prismjs"; // Used to highlight HTML code
import DOMPurify from "dompurify"; // Uses to sanitize HTML content and safeguard against XSS attacks
import "prismjs/themes/prism.css"; // Import the Prism CSS file
import { css_beautify, html_beautify } from "js-beautify";
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';

export type Props = {
  content: StorableHtmlNode[];
  root?: number;
  prefix: string;
};

export const HtmlInterpreter = (props: Props) => {
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { state: mouseState, dispatch: mouseDispatch } = useMouse();
  const { state: textEditingState, dispatch: textEditingDispatch } =
    useTextEditing();
  const { dragState } = useDragAndDropContext();
  const { dragRef, startDrag } = useDraggable(
    storableNodeToHtmlObject(props.root ?? 0, {
      metadata: { type: "WIDGET" },
      html: { nodes: props.content },
    })
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ html: "", css: "" });

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const getFormattedCSS = (element: Element) => {
    let cssText = "";
    // Set to track and prevent the duplication of CSS rules (e.g., when child elements have the same rules as their parent)
    const addedRules = new Set();

    // Convert the StyleSheetList to an array for easier manipulation and iteration
    const styleSheets = Array.from(document.styleSheets);

    // Recursive function to process an element and its child elements
    const processElement = (elem: Element) => {
      // Retrieve inline styles directly from the element's "style" attribute
      const inlineStyles = elem.getAttribute("style");

      // If inline styles exist
      if (inlineStyles) {
        cssText += `\n${inlineStyles}\n\n`;
      }
      // Iterate over all stylesheets included or linked in the document
      styleSheets.forEach((sheet) => {
        try {
          // Convert CSSRuleList to an array and iterate over each rule
          Array.from(sheet.cssRules).forEach((rule) => {
            if (rule instanceof CSSStyleRule) {
              const ruleText = `${rule.selectorText} {\n  ${rule.style.cssText}\n}\n\n`;
              // Check if the element matches the rule's selector and the rule hasn't been added yet
              if (
                elem.matches(rule.selectorText) &&
                !addedRules.has(ruleText)
              ) {
                cssText += ruleText;
                // Add the rule text to the Set to avoid duplicates
                addedRules.add(ruleText);
              }
            }
          });
        } catch (e) {
          // Catch and warn about security errors when accessing styles from different origins
          console.warn(`Cannot access styles from ${sheet.href}:}`);
        }
      });
      // Recursively process all child elements of the current element
      Array.from(elem.children).forEach(processElement);
    };

    processElement(element);

    const formattedCSSText = css_beautify(cssText, {
      indent_size: 2,
      selector_separator_newline: true,
      newline_between_rules: true,
      space_around_selector_separator: true,
      space_around_combinator: true,
      end_with_newline: true,
    });

    // Use Prism to highlight the CSS text and return it
    return Prism.highlight(formattedCSSText, Prism.languages.css, "css");
  };

  const getFormattedHTML = (element: Element) => {
    // Remove the editor icons from the clone by selecting them via their classes
    element
      .querySelectorAll(".delete-icon, .copy-icon, .view-code-icon")
      .forEach((icon) => {
        icon.remove();
      });
    // Get the outer HTML of the cloned element
    const rawHtml = element.outerHTML;

    // Sanitize the raw HTML
    const cleanHtml = DOMPurify.sanitize(rawHtml);

    // Format the sanitized HTML
    const formattedHtmlString = html_beautify(cleanHtml, {
      indent_size: 2, // Two spaces for indentation
      indent_char: " ", // Using space instead of tab
      max_preserve_newlines: 1,
      preserve_newlines: true,
      indent_scripts: "keep", // "keep" keeps the script indent level equal to the tag that contains it
      end_with_newline: true,
      wrap_line_length: 80, // Standard line length for better readability
      indent_inner_html: true,
      unformatted: [], // Keep all elements formatted
    });

    // Return the highlighted HTML (using Prism)
    return Prism.highlight(formattedHtmlString, Prism.languages.html, "html");
  };

  const handleViewClick = (elementId: string) => {
    // Find the element and get its outer HTML
    const elem = document.getElementById(elementId);

    // Check if the element exists
    if (elem) {
      // Clone the element to avoid modifying the original element
      const cloneContainer = elem.cloneNode(true) as Element;
      const formattedHTML = getFormattedHTML(cloneContainer);
      const formattedCSS = getFormattedCSS(cloneContainer);
      if (formattedHTML && formattedCSS) {
        // Set the highlighted HTML and CSS to the modal content
        setModalContent({ html: formattedHTML, css: formattedCSS });

        // Open the modal
        setIsModalOpen(true);
      }
    }
  };

  const id = props.prefix + "-" + (props.root ?? 0).toString();

  const { dropRef, handleDrop, handleDragOver, handleDragOut } = useDroppable(
    // On drop callback
    (data) => {
      editorDispatch({
        type: ActionType.DROP,
        mouseState: mouseState,
        payload: data,
        targetId: id,
      });
    },
    // on Drag over callback
    (data) => {
      // Temporary -- still using some old logic from editor reducer
      editorDispatch({
        type: ActionType.DRAG_OVER,
        targetId: id,
        payload: data,
        mouseState: mouseState,
      });
    },
    // on Drag out callback
    () => {
      editorDispatch({ type: ActionType.DRAG_OUT, targetId: id });
    }
  );

  const handleDeleteClick = (elementId: string) => {
    // Dispatch a delete action
    editorDispatch({ type: ActionType.DELETE_ELEMENT, elementId });
  };

  const handleCopyClick = (elementId: string) => {
    // Dispatch a copy action
    editorDispatch({ type: ActionType.COPY_ELEMENT, elementId });
  };

  const handleAddClick = (elementId: string) => {
    // Dispatch an add action to add a new section
    editorDispatch({ type: ActionType.ADD_ELEMENT, elementId });
  };

  const handleResizeStop = (elementId: string, width: number, height: number) => {
    // Dispatch a resize action
    editorDispatch({ 
      type: ActionType.RESIZE_ELEMENT, 
      elementId, 
      width, 
      height 
    });
  };

  const parentRef = useRef(null);
  const refs: Array<React.MutableRefObject<HTMLDivElement | null>> = [];

  const content = props.content[props.root ?? 0];

  //iterate over the array of child elements and return that as content
  const Children = content.children?.map((child, i) => {
    return (
      <HtmlInterpreter
        key={i}
        prefix={props.prefix}
        content={props.content}
        root={child}
      />
    );
  });

  const elementOperations = (
    <div className="selected-element-ops">
      <img
        src={TrashIcon}
        alt="Delete Icon"
        title="Delete"
        className="icon delete-icon"
        onClick={() => {
          console.log("clicked!");
          handleDeleteClick(id);
        }}
      />

      <img
        src={CopyIcon}
        alt="Copy Icon"
        title="Copy"
        className="icon copy-icon"
        onClick={() => handleCopyClick(id)}
      />

      <img
        src={CodeIcon}
        alt="View Code"
        title="View"
        className="icon view-code-icon"
        onClick={() => handleViewClick(id)}
      />
    </div>
  );  
  const elementSectionOperations = ( //Same as elementOperations but with an added "Add" button
    <div className="selected-element-ops">
      <img
        src={TrashIcon}
        alt="Delete Icon"
        title="Delete"
        className="icon delete-icon"
        onClick={() => {
          console.log("clicked!");
          handleDeleteClick(id);
        }}
      />

      <img
        src={CopyIcon}
        alt="Copy Icon"
        title="Copy"
        className="icon copy-icon"
        onClick={() => handleCopyClick(id)}
      />

      <img
        src={CodeIcon}
        alt="View Code"
        title="View"
        className="icon view-code-icon"
        onClick={() => handleViewClick(id)}
      />

      <BsPlusSquareFill
        className="icon add-item"
        title = "Add Section"
        color = "#1c274c"
        onClick={() => handleAddClick(id)}
      />
    </div>
  );
  

  // const className:string = content.attributes["class"]
  let Element: ReactElement;

  let args: React.HTMLAttributes<HTMLElement> &
    React.ClassAttributes<HTMLElement> = {};

  let onClickCallbacks: Array<(e: MouseEvent) => void> = [];
  let mouseUpCallbacks: Array<(e: MouseEvent) => void> = [];
  let mouseDownCallbacks: Array<(e: MouseEvent) => void> = [];
  let mouseOverCallbacks: Array<(e: MouseEvent) => void> = [];
  let mouseOutCallbacks: Array<(e: MouseEvent) => void> = [];

  if (content.metadata?.selectable) {
    onClickCallbacks.push((e: MouseEvent) => {
      console.log(e.target, e.currentTarget);
      if (editorState.selectedElementId !== editorState.hoveredItemId) {
        e.stopPropagation();
        console.log("selecting", e.target);
        editorDispatch({
          type: ActionType.ELEMENT_SELECTED,
          selectedId: id,
        });
      }
    });

    // When the element is dragged over
    mouseOverCallbacks.push((e: MouseEvent) => {
      e.stopPropagation();
      editorDispatch({
        type: ActionType.HOVER,
        mouseState: mouseState,
        dragState: dragState,
        payload: id,
      });
    });

    // When the element is dragged out
    mouseOutCallbacks.push((e: MouseEvent) => {
      e.stopPropagation();
      editorDispatch({
        type: ActionType.UNHOVER,
        mouseState: mouseState,
        payload: id,
      });
    });
  }

  args.ref = parentRef;

  // register callbacks for draggable elements
  useEffect(() => {
    if (content.metadata?.draggable) {
      mouseDispatch({
        type: MouseActionType.REGISTER_CALLBACK,
        callback: (state, ev) => {
          // if left click is held and the target of the click is this draggable
          // element
          if (state.holdLeft && (ev.target as HTMLElement).id === id) {
            // initiate dragging of this element
            startDrag();
            editorDispatch({
              type: ActionType.START_DRAG,
              payload: id,
              dragRootId: id,
            });
          }
        },
        id: id,
      });
    }
    // Track and update on body, header, or footer changes since it can cause
    // cause the ids of elements to change as well
  }, [editorState.body, editorState.header, editorState.footer]);

  if (content.metadata?.draggable) {
    refs.push(dragRef);
  }

  if (content.metadata?.textbox) {
    args.onDoubleClick = (e: MouseEvent) => {
      if (!(e.currentTarget as HTMLElement).contains(e.target as HTMLElement))
        return;

      let container = e.currentTarget as HTMLElement;
      let target = e.target as HTMLElement;

      editorDispatch({
        type: ActionType.ELEMENT_DOUBLE_CLICKED,
        containerId: container.id,
        elementId: target.id,
      });
      console.log(target);
    };
  }

  if (content.metadata?.editable) {
    args.suppressContentEditableWarning = true;

    args.onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
    };

    args.onBlur = (e: FocusEvent) => {
      console.log(content);
      editorDispatch({
        type: ActionType.ELEMENT_BLURRED,
        elementId: (e.currentTarget as HTMLElement).id,
      });
    };

    args.onKeyDown = (e: KeyboardEvent) => {
      const keys = ["Enter"];

      if (keys.includes(e.key)) {
      }
      e.preventDefault();

      textEditingDispatch({
        type: TextEditingActionType.TEXTBOX_KEYPRESS,
        editorState: editorState,
        key: e.key,
        elementId: editorState.selectedElementId ?? "",
      });
    };
  }

  if (content.metadata?.droppable) {
    // When the element has been dropped into
    mouseUpCallbacks.push((e: MouseEvent) => {
      if (editorState.hoveredItemId === e.currentTarget.id) {
        e.stopPropagation();
        handleDrop();
      }
    });

    // When the element is dragged over
    mouseOverCallbacks.push((e: MouseEvent) => {
      e.stopPropagation();
      handleDragOver();
    });

    // When the element is dragged out
    mouseOutCallbacks.push((e: MouseEvent) => {
      e.stopPropagation();
      handleDragOut();
    });

    refs.push(dropRef);
  }

  args.onMouseUp = (e: MouseEvent) => {
    mouseUpCallbacks.forEach((f) => {
      f(e);
    });
  };

  args.onClick = (e: MouseEvent) => {
    onClickCallbacks.forEach((f) => f(e));
  };

  args.onMouseOver = (e: MouseEvent) => {
    mouseOverCallbacks.forEach((f) => f(e));
  };

  args.onMouseLeave = (e: MouseEvent) => {
    mouseOutCallbacks.forEach((f) => f(e));
  };

  let children = [];

  //ChatGPT generated until line 478 - allows HTML display for Quill editing, while also sanitizing all input for safety
  if (content.attributes["text"]) {
    const cleanHTML = DOMPurify.sanitize(content.attributes["text"].value);
    children.push(
      <React.Fragment key="richtext">
        {cleanHTML && <span dangerouslySetInnerHTML={{ __html: cleanHTML }} />}
      </React.Fragment>
    );
  }
  
  if (Children) {
    children = [...children, ...Children];
  }
  
//Displays options when element is selected - navigation and section elements get an additional "Add" button
  if (editorState.selectedElementId === id) {
    if (content.attributes["className"].value ==="vertical" || content.attributes["className"].value === "navigation"){
    children = [elementSectionOperations, ...children];
    }
    else{
      children = [elementOperations, ...children];
    }
  }

  const element = content.attributes.headingtype?.value || content.element || "div"; //Allows for dynamic changing of element
  const outputAttributes = Object.keys(content.attributes).map((k) => {
    const attribute = content.attributes[k];
    return attribute.suppress ? null : k;
  });
  const outputAttributesObject: { [key: string]: string } = {};

  outputAttributes.forEach((a) => {
    if (a) {
      outputAttributesObject[a] = content.attributes[a].value;
    }
  });

  const outputStyles = Object.keys(content.style).map((k) => {
    const style = content.style[k];
    return style.suppress ? null : k;
  });
  const outputStyleObject: { [key: string]: string } = {};

  outputStyles.forEach((style) => {
    if (style) {
      outputStyleObject[style] = content.style[style].value;
    }
  });

  const finalArgs = {
    ...outputAttributesObject,
    id: id,
    style: outputStyleObject,
    ...args,
  };

  // Get the current dimensions of the element from the style properties
  const currentWidth = parseInt(content.style.width?.value || "200");
  const currentHeight = parseInt(content.style.height?.value || "200");

  // Determine if the element is resizable
  const isResizable = content.metadata?.resizable !== false && editorState.selectedElementId === id && content.metadata?.type === "WIDGET";

  // Check if this is a special container type that needs custom resizing behavior
  const isLayout = content.attributes.className?.value === "horizontal" || 
                   content.attributes.className?.value === "vertical" || 
                   content.attributes.className?.value === "navigation";
                   
  // Check if this is a heading element
  const isHeading = content.element === "h1" || content.element === "h2" || content.element === "h3" || 
                    content.attributes.headingtype?.value;
  
  // Determine the appropriate resize handles based on the widget type
  const getResizeHandles = () => {
    if (isLayout) {
      // For layout containers, allow resizing from all sides and corners
      return ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as ('s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne')[];
    } else if (isHeading) {
      // For headings, only allow width resizing
      return ['e', 'w'] as ('s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne')[];
    }
    // Default to all corners for standard widgets
    return ['se'] as ('s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne')[];
  };

  // Determine min/max constraints based on widget type
  const getMinConstraints = () => {
    if (isLayout) {
      return [50, 20] as [number, number]; // Layout containers can be smaller
    } else if (isHeading) {
      return [100, 20] as [number, number]; // Headings can be shorter
    }
    return [100, 100] as [number, number]; // Default for regular widgets
  };

  const getMaxConstraints = () => {
    // Allow layout containers to be much larger
    if (isLayout) {
      return [2000, 2000] as [number, number]; // Allow larger containers
    }
    // Allow navigation to go full width
    else if (content.attributes.className?.value === "navigation") {
      return [2000, 500] as [number, number]; // Navigation bars can be taller now
    }
    return [1000, 1000] as [number, number]; // Default
  };

  //if there is a child element create a react element, otherwise create an empty array and return
  //tell htmlinterpreter that i have dropped an element
  if (isResizable) {
    // When the element is resizable and selected, wrap it in a ResizableBox
    Element = (
      <ResizableBox
        width={currentWidth}
        height={currentHeight}
        onResizeStop={(_e: React.SyntheticEvent, data: ResizeCallbackData) => {
          // For heading elements, use a special resize handler
          if (isHeading) {
            // Update width, maintain auto height
            editorDispatch({ 
              type: ActionType.RESIZE_ELEMENT, 
              elementId: id, 
              width: data.size.width, 
              height: data.size.height
            });
          } else {
            // Standard resize
            handleResizeStop(id, data.size.width, data.size.height);
          }
        }}
        minConstraints={getMinConstraints()}
        maxConstraints={getMaxConstraints()}
        resizeHandles={getResizeHandles()}
        draggableOpts={{ grid: [5, 5] }}
        axis={isHeading ? 'both' : 'both'} // Allow both x and y movement for headings
      >
        {React.createElement(
          element,
          {
            ...finalArgs,
            style: { 
              ...outputStyleObject, 
              width: '100%', 
              height: isHeading ? 'auto' : '100%',
              overflow: isLayout ? 'auto' : 'visible',
              cursor: 'move'
            }
          },
          children
        )}
      </ResizableBox>
    );
  } else {
    Element =
      children.filter((c) => c !== null).length > 0
        ? React.createElement(element, finalArgs, children)
        : React.createElement(element, finalArgs);
  }

  useEffect(() => {
    refs.forEach((ref) => {
      ref.current = parentRef.current;
    });
  }, [parentRef]);

  /* React Modal for viewing HTML/CSS code of a element */
  const viewCodeModal = (
    <ReactModal
      isOpen={isModalOpen}
      onRequestClose={handleCloseModal}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          zIndex: 1000,
        },
        content: {
          position: "absolute",
          top: "20%",
          left: "20%",
          right: "20%",
          bottom: "20%",
          border: "4px solid #ccc",
          background: "#202020",
          overflow: "auto",
          borderRadius: "4px",
          outline: "none",
          padding: "20px",
          display: "flex",
          flexDirection: "row",
          resize: "both" /* Enables resizing */,
        },
      }}
    >
      {/* 'x' character used for closing the Modal */}
      <button className="modal-close-btn" onClick={handleCloseModal}>
        &times;
      </button>
      <div className="modal-container">
        <h3 className="html-modal-header">HTML</h3>
        <h3 className="css-modal-header">CSS</h3>
      </div>
      <div className="modal-code-container">
        {/* HTML Code */}
        <pre
          className="html-modal-code"
          dangerouslySetInnerHTML={{ __html: modalContent.html }}
        ></pre>

        {/* CSS Styles */}
        <pre
          className="css-modal-code"
          dangerouslySetInnerHTML={{ __html: modalContent.css }}
        ></pre>
      </div>
    </ReactModal>
  );

  return (
    <>
      {Element}
      {viewCodeModal}
    </>
  );
};
