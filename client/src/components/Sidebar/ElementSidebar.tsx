import { findPrimaryAttributes } from "components/pages/app/Helpers";
import React, { ChangeEvent, useEffect, useRef } from "react"; //Added useRef, useEffect for Quill handling
import { ActionType, useEditor } from "state/editor/EditorReducer";
import { parseId } from "state/editor/Helpers";
import { NodeAttribute, StorableHtmlNode } from "types/HtmlNodes";
import ImageGallery from "./ImageGallery";
import { Tooltip } from "react-tooltip"; // Handles hover-over tooltips
import Quill from 'quill';

type Props = {};

const ElementSidebar = (props: Props) => {
  const [color, setColor] = React.useState({});
  const { state: editorState, dispatch } = useEditor();
  let isImageElement = false;

  let attributes: { [key: string]: NodeAttribute } = {
    font: { value: "Helvetica" },
    size: { value: "12px" },
  };
  let style: { [key: string]: NodeAttribute } = {};

  const { state: editor, dispatch: editorDispatch } = useEditor();

  if (editor.selectedElementId) {
    const { section, index } = parseId(editor.selectedElementId);
    let target = editor[section].html.nodes[index];

    console.log("TARGET", target);

    if (target) {
      ({ attributes, style } = findPrimaryAttributes(
        index,
        editorState,
        section
      ) ?? {
        attributes: { ...target.attributes },
        style: { ...target.style },
      });
    }
  }
 
  //ChatGPT assisted (not fully generated) until line 85
  const quillRef = useRef<HTMLDivElement | null>(null); // Reference for Quill container
  const quillInstance = useRef<Quill | null>(null); // Store Quill instance

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            ["blockquote", "code-block"],
            ["link", "image", "video"],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ direction: "rtl" }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ["clean"],
          ],
        },
        readOnly: attributes["richtext"]?.readonly || false, // Readonly based on attribute
      });

      quillInstance.current.on("text-change", () => {
        dispatch({
          type: ActionType.ATTRIBUTE_CHANGED,
          target: "attributes",
          attribute: "richtext",
          newValue: quillInstance.current?.root.innerHTML || "",
        });
      });

      // Set initial value
      quillInstance.current.root.innerHTML = attributes["richtext"]?.value || "";
    }

    return () => {
      quillInstance.current?.off("text-change");
    };
  }, [attributes["richtext"]?.value]);


  const buildInput = (
    source: { [key: string]: NodeAttribute },
    index: number,
    key: string,
    target: "style" | "attributes"
  ) => {
    const val = source[key];

    let input = (
      <input
        onChange={(ev: ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: ActionType.ATTRIBUTE_CHANGED,
            target: target,
            attribute: key,
            newValue: ev.currentTarget.value,
          });
        }}
        type={source[key].input?.type ?? "text"}
        value={source[key].value}
        readOnly={val.readonly ? true : false}
        data-tooltip-id={key} // Handles tooltip association
      />
    );

    if (val.value === "image") {
      isImageElement = true;
    }

    if (val.input?.type === "richtext") {//Sets up container for Quill editor AND editor itself
      input = <div className="quill-editor-container"> 
      <div ref={quillRef} className="quill-editor" />
    </div>;
    } 
    else if (val.input?.type === "select" && val.input.options) {
      input = (
        <select
          onChange={(ev: ChangeEvent<HTMLSelectElement>) => {
            dispatch({
              type: ActionType.ATTRIBUTE_CHANGED,
              target,
              attribute: key,
              newValue: ev.currentTarget.value,
            });
          }}
          data-tooltip-id={key}
        >
          {val.input.options.map((op) => (
            <option key={op.value} value={op.value}>{op.text}</option>
          ))}
        </select>
      );
    } 
    else {
      input = (
        <input
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            dispatch({
              type: ActionType.ATTRIBUTE_CHANGED,
              target,
              attribute: key,
              newValue: ev.currentTarget.value,
            });
          }}
          type={val.input?.type ?? "text"}
          value={val.value}
          readOnly={val.readonly || false}
          data-tooltip-id={key}
        />
      );
    }

    return (
      <div className="element-attribute-input" key={index}>
        <div className="attribute-label-container">
          <label htmlFor="">{val.input?.displayName ?? key}</label>
        </div>
        {input}
      </div>
    );
  };

  return (
    <aside className="style-sidebar">
      <header className="sidebar-header">
        <h2>ELEMENT</h2>
      </header>
      <h3>Attributes</h3>
      <div className="element-attributes">
        {Object.keys(attributes)
          .sort()
          .map((k, i) => {
            const attr = attributes[k];

            if (attr.hidden) {
              return;
            }

            return buildInput(attributes, i, k, "attributes");
          })}
      </div>
      <h3>Style</h3>
      <div className="element-style">
        {Object.keys(style)
          .sort()
          .map((k, i) => {
            const attr = style[k];

            if (attr.hidden) {
              return;
            }

            return buildInput(style, i, k, "style");
          })}
      </div>

      {/* Conditionally render the ImageGallery if the selected element is an image */}
      {isImageElement && (
        <>
        <h3>Image Gallery</h3>
        <ImageGallery
          onSelect={(imageUrl) => {
            // Update the src attribute of the selected image element
            editorDispatch({
              type: ActionType.ATTRIBUTE_CHANGED,
              target: "attributes",
              attribute: "src",
              newValue: imageUrl,
            });
          }}
        />
      </>
      )}

      {/* Handles tooltip display for widget attributes - ChatGPT assisted*/}
      {Object.keys(attributes).map((key) => {
        const tooltipText = attributes[key]?.input?.tooltip;
        return (
          tooltipText && (
            <Tooltip 
           className="sidebarTooltip"
            key={key} 
            id={key} 
            content={tooltipText}
            >
              <span>{key}</span> {/* Tooltip wrapped element */}
            </Tooltip>
          )
        );
      })}
    </aside>
  );
};

export default ElementSidebar;