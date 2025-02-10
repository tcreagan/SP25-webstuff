import { EditorState } from "state/editor/EditorReducer";
import { NodeAttribute, StorableHtmlNode } from "types/HtmlNodes";
import { HtmlObject } from "types/HtmlObject";
import DOMPurify from "dompurify";

export const findPrimaryAttributes = (parentID: number, editor:EditorState, section:string): {attributes:any, style:any} | null => {
  const parentNode = (editor[section as keyof EditorState] as HtmlObject).html.nodes[parentID]

  if(!parentNode){
    return null;
  }

  if (parentNode.metadata?.primary) {
    return {attributes: {...parentNode.attributes},style: {...parentNode.style}};
  }
  else {
    if (parentNode.children) {
      for (let a = 0; a < parentNode.children.length; a++) {
        const child_attributes = findPrimaryAttributes(parentNode.children[a], editor, section);
        if (child_attributes !== null) {
          return child_attributes;
        }
      }
    }
    return null;
  }
}
  export const findPrimaryNode = (parentID: number, editor:EditorState, section:string): number | null => {
    console.log("parentID",parentID)
    console.log((editor[section as keyof EditorState] as HtmlObject).html.nodes)
    const parentNode = (editor[section as keyof EditorState] as HtmlObject).html.nodes[parentID]
    console.log(parentNode)
    if (parentNode.metadata?.primary) {
      return parentID
    }
    else {
      if (parentNode.children) {
        for (let a = 0; a < parentNode.children.length; a++) {
          const childNode = findPrimaryNode(parentNode.children[a], editor, section);
          if (childNode !== null) {
            return childNode;
          }
        }
      }
      return null;
    }
  }


 // Sanitizes the class name by removing any characters that are not alphanumeric, hyphens, or underscores.
export function sanitizeClassName(value: string, defaultValue: string) {
 // First, remove any invalid characters
 value = value.replace(/[^a-zA-Z0-9-_]/g, '');

 // CSS class names can't start with a digit, two hyphens, or a hyphen followed by a digit.
 const startsWithInvalidChar = /^(?:\d|--|\-\d)/;

 
 if (startsWithInvalidChar.test(value)) {
  return defaultValue;
 }

 return value;
}

// Sanitizes dimensions (like width and height for an image) to ensure they are in a valid format.
export function sanitizeWidthOrHeight(value: string, defaultValue: string) {
  const regexPattern = /^\d+\.\d+$/;
  if (regexPattern.test(value)) {
    return value;
  } else {
    return defaultValue;
  }
}

// Sanitizes a URL to ensure it is valid and uses a safe protocol.
export function sanitizeImageUrl(value: string, defaultValue: string) {
  let url;
  try {
    // Attempt to create a new URL object, which will throw an error if the value is not a valid URL.
    url = new URL(value);
    // If the protocol of the URL is not HTTP or HTTPS, throw an error as it's not considered safe.
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Invalid URL");
    }
     // Define the regex pattern to match only http, https, ftp protocols, and valid data URI for images.
     const pattern = /^(?:(?:https?|ftp):\/\/|data:image\/(png|jpe?g|gif);base64,)/i;
     
    // If no error was thrown, return the URL as a string.
    const urlString = url.toString();

     // Test the urlString against the regex pattern.
     if (pattern.test(urlString)) {
      // If the test passes, the URL is valid and safe based on our regex pattern.
      return urlString;
    } else {
      // If the test fails, return the default value.
      throw new Error('URL does not match the required pattern.');
    }

  } catch (e) {
    // If an error occurs (i.e., invalid URL or protocol), log the error and return an empty string.
    console.error("Invalid URL", e);
    return defaultValue; // Returning the original value is also an option.  
  }
}

//gpt 
//review
//used to help handle child widgets update their own styles, positions, etc
export function updateWidgetStyle(widgetId, styles, dispatch) {
  dispatch({
    type: 'UPDATE_WIDGET_STYLE',
    widgetId,
    styles,
  });
}

export function updateWidgetPosition(widgetId, x, y, dispatch) {
  dispatch({
    type: 'UPDATE_WIDGET_POSITION',
    widgetId,
    x,
    y,
  });
}
//gpt
//review
//added the ability to reset inherited values incase it happens so they are independent
// Removes inherited styles from child widgets, ensuring independence from the parent
export const resetInheritedStyles = (widgetId: number, editor: EditorState, section: string) => {
  const widget = (editor[section as keyof EditorState] as HtmlObject).html.nodes[widgetId];

  if (!widget) {
    return null; // Widget not found
  }

  // Clear any inherited properties
  widget.style = {
    ...widget.style,
    position: 'absolute',  // Ensure absolute positioning
    width: widget.style.width || 'auto', // Ensure width is independently managed
    height: widget.style.height || 'auto', // Ensure height is independently managed
  };

  return widget.style;
};

