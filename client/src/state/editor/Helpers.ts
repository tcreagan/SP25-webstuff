import { RenderableHtmlNode, StorableHtmlNode } from "types/HtmlNodes";
import { HtmlObject } from "types/HtmlObject";
import { EditorState, DropTargetData, useEditor } from "./EditorReducer";
import { EditorContext } from "./EditorContext";
import { MouseState } from "state/mouse/MouseReducer";
import { ImgHTMLAttributes} from "react";
import {
  ActionType,
  EditorAction,
} from "state/editor/EditorReducer";

 
 
export const sectionFromId = (id: string) => {
  const prefix = id.split("-")[0];
  return prefix === "h" ? "header" : prefix === "b" ? "body" : "footer";
};

export const parseId = (id: string) => {
  const [prefix, indexString] = id.split("-")
  const index = parseInt(indexString)
  const section: "header" | "body" | "footer" = prefix === "h" ? "header" : prefix === "b" ? "body" : "footer";

  return { section, index }
}


export const storableNodeToHtmlObject = (id: number, source: HtmlObject) => {
  // Create a copy of the source nodes for reference
  const sourceNodes = { ...source.html.nodes };

  // Initialize the return object
  let retObject: HtmlObject = {
    metadata: {
      type: "WIDGET",
    },
    html: {
      nodes: [],
    },
  };

  // Create a copy of the root node being converted
  // then add it to the return object's nodes
  const newRoot = { ...sourceNodes[id] };
  retObject.html.nodes.push(newRoot);

  // Recursive function that will add a node and its children to a given list of nodes
  const addWithChildren = (nodes: StorableHtmlNode[], newNode: StorableHtmlNode) => {
    // First push the root node to the list
    nodes.push(newNode)
    const ret = nodes.length - 1

    let newChildren = []
    // loop through node's children if they exist
    if (newNode.children) {
      for (let i = 0; i < newNode.children.length; i++) {
        // Extract child nodes index in source from the node's
        // children array
        const cIndex = newNode.children[i];
        let child = { ...sourceNodes[cIndex] }

        // recursively add the child to the list being built
        const id = addWithChildren(nodes, child);
        // push the returned id onto the new children array
        newChildren.push(id)
      }
    }

    newNode.children = newChildren

    return ret;
  }

  let children: StorableHtmlNode[] = []
  addWithChildren(children, newRoot)
  retObject.html.nodes = children

  return retObject;

};


// Helper function to deep clone a node and its children
export function deepCloneNode(
  node: StorableHtmlNode, 
  allNodes: StorableHtmlNode[],
  indexMap: Map<number, number>
): StorableHtmlNode {
  const clonedNode: StorableHtmlNode = {...node};

  if (node.children) {
    clonedNode.children = node.children.map(childIndex => {
      if (!indexMap.has(childIndex)) {
        // Clone the child node recursively and get the new index
        const newChildNode = deepCloneNode(allNodes[childIndex], allNodes, indexMap);

        // Add the cloned node to the list of all nodes
        allNodes.push(newChildNode);

        // Get the new index of the cloned node
        const newChildIndex = allNodes.length - 1;

        // Update the index map with the new index
        indexMap.set(childIndex, newChildIndex);

        // Return the new index
        return newChildIndex;
      } else {
        // The ! means we are using a non-null assertion, i.e., certain that the the key exists in the map
        return indexMap.get(childIndex)!;
      }
    });
  }

  return clonedNode;
}

// Helper function to find the parent node of a given child node
export function findParentNode(allNodes: StorableHtmlNode[], childIndex: number): StorableHtmlNode | null {
  for (const node of allNodes) {
    // If the current node has children and the children array includes the child index, return the parent node
    if (node.children && node.children.includes(childIndex)) {
      return node;
    }
  }
  return null; // If no parent found
}

/**
 * Estimate the index in the parent elements child array where the dropped item should be inserted
 * based on the current cursor position
 * @param editorState
 * @param parentId
 * @param mouseY
 * @returns
 */
export const getDropChildId = (mouseState: MouseState, editorState: EditorState, parentId: string): number => {
  const parentElement = document.getElementById(parentId);

  if (!parentElement) return 0;

  // Extract positional information of the parent element (element into which something is being dropped)
  // top = distance from top of the element to top of the viewport
  // bottom = distance from botoom of element to top of the viewport
  const { top, bottom, left, right } = parentElement.getBoundingClientRect();

  // Calculate the total height of the parent element
  const totalHeight = bottom - top;

  const totalWidth = right - left;

  // Calculate the mouse cursor position zeroed at the top left of the parent element
  // i.e. get where the cursor is inside of the element
  const yOffset = mouseState.mouseY! - top;
  const xOffset = mouseState.mouseX! - left;

  const section = sectionFromId(parentId);

  // Get the html object from the state
  const parentObject =
    editorState[section].html.nodes[parseInt(parentId.split("-")[1])];

  if (!parentObject) return -1;

  const dimKey =
    parentObject.metadata?.childDirection === "vertical"
      ? "height"
      : "width";

  const position =
    parentObject.metadata?.childDirection === "vertical"
      ? yOffset
      : xOffset;

  const accumulator = (childIndex: number, sum: number) => {
    let retSum = sum
    const childId = parentId[0] + "-" + childIndex.toString()

    const childElement = document.getElementById(childId)

    if (childElement) {
      const { width, height } = childElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(childElement);
      // Extract margins
      const marginTop = parseFloat(computedStyle.marginTop);
      const marginRight = parseFloat(computedStyle.marginRight);
      const marginBottom = parseFloat(computedStyle.marginBottom);
      const marginLeft = parseFloat(computedStyle.marginLeft);

      const dims = {
        height: height + marginBottom + marginTop,
        width: width + marginLeft + marginRight
      }

      retSum = sum + dims[dimKey]
    }

    return retSum;
  }

  if (!parentObject.children) {
    parentObject.children = [];
  }

  let calculatedIndex = parentObject.children.length;
  let sum = 0;
  for (let i = 0; i < parentObject.children.length; i++) {
    const index = parentObject.children[i]
    sum = accumulator(index, sum)
    
    if(sum >= position){
      calculatedIndex = i;
      break
    }

    if(i >= parentObject.children.length - 1) break;

    const nIndex = parentObject.children[i+1]
    const nSum = accumulator(nIndex, sum)

    if(nSum >= position && sum <= position){
      calculatedIndex = i + 1;
      break;
    }
  }

  return calculatedIndex;
};

 

// Helper function to update the indices of the children arrays based on the nodes removed.
// Takes the current list of nodes and the set of indices that have been removed.
const updateIndices = (
  nodes: StorableHtmlNode[],
  removedIndices: Set<number>
): StorableHtmlNode[] => {

  // Create a mapping from old indices to new indices.
  const indexMap: { [key: number]: number } = {};
  let newNodes = [...nodes]

  let newIndex = 0;
  for (let i = 0; i < newNodes.length; i++) {
    // If the current index is not in the set of removed indices, map it to a new index.
    if (!removedIndices.has(i)) {

      indexMap[i] = newIndex++;
    }
  }

  // Update the children array of each node to reflect the new indices.
  newNodes.forEach((node) => {
    if (node.children) {
      // Map each child index to its new index and filter out undefined entries.
      node.children = node.children
        .map((childIndex) => indexMap[childIndex])
        .filter((index) => index !== undefined);
    }
  });

  return newNodes;
};

export const removeNode = (id: number, source: HtmlObject): HtmlObject => {
  const nodes: StorableHtmlNode[] = [...source.html.nodes];
  const removedIndices: Set<number> = new Set<number>();

  const markForRemoval = (currentIndex: number) => {

    if (currentIndex < 0 || currentIndex >= nodes.length) {
      console.error(
        "Attempted to mark a non-existing node for removal:",
        currentIndex
      );
      return;
    }
    removedIndices.add(currentIndex);
    const currentNode = nodes[currentIndex];
    if (currentNode.children) {
      currentNode.children.forEach((childIndex) => {
        if (childIndex < 0 || childIndex >= nodes.length) {
          console.error("Invalid child index:", childIndex);
          return;
        }
        markForRemoval(childIndex);
      });
    }
  };



  markForRemoval(id);

  // Use the updateIndices function to update the children indices of the remaining nodes.
  const updatedNodes: StorableHtmlNode[] = updateIndices(
    nodes,
    removedIndices
  );

  // Filter out the nodes that are not marked for removal.
  const filteredNodes: StorableHtmlNode[] = updatedNodes.filter(
    (_, index) => !removedIndices.has(index)
  );


  // Update the source object with the new list of nodes, excluding the removed ones.
  source.html.nodes = filteredNodes;

  return source;
};

export const insertDroppedElement = (
  childIndex: number,
  editorState: EditorState,
  droppedElement: HtmlObject,
  targetId: string
): EditorState => {


  // Copy the current state
  let newState: EditorState = structuredClone(editorState);

  // Check for necessary conditions
  if (!targetId || !droppedElement) {
    return editorState; // Return the original state if conditions aren't met
  }

  const { section, index } = parseId(targetId)

  // newState[section] = { ...editorState[section] }
  // newState[section].html.nodes = [...editorState[section].html.nodes]

  let nodes = [...newState[section].html.nodes];
  const offset = nodes.length;

  // Extract parent index from hoveredItemId
  let parent = nodes[index];

  // If parent is undefined, return the current state as no valid operation can be performed
  if (!parent) {
    console.error("Parent node not found.");
    return editorState;
  }

  // Ensure parent's children array is initialized
  if (!parent.children) {
    parent.children = [];
  }

  // Determine the index where the dropped element should be inserted
  const dropIndex =
    childIndex !== -1 ? childIndex : parent.children.length;

  // Clone and adjust the dropped element's nodes
  const clonedNodes = droppedElement.html.nodes.map((node) => {
    const clonedNode = { ...node };
    if (clonedNode.children) {
      clonedNode.children = clonedNode.children.map((child) => child + offset);
    }
    return clonedNode;
  });

  // Insert the offset at the calculated index in the parent's children array
  parent.children.splice(dropIndex, 0, offset);

  // Update the state with the new nodes, including the cloned ones
  newState[section].html.nodes = [
    ...newState[section].html.nodes,
    ...clonedNodes,
  ];

  // Replace the updated parent node in the state
  newState[section].html.nodes[index] = parent;

  return newState;
};


export const setFocus = (target: HTMLElement) => {
  let selection = window.getSelection();
  const pos = selection?.focusOffset ?? 0
  let range = document.createRange();
  console.log(target)
  range.setStart(target, 0)
  range.setEnd(target, 0)
  selection?.removeAllRanges()
  selection?.addRange(range)
  //target.focus()
}

export const appendChild = (targetObject: HtmlObject, parentIndex: number, child: StorableHtmlNode) => {
  const targetHtml = { ...targetObject.html }
  const targetNode = { ...targetHtml.nodes[parentIndex] }

  targetHtml.nodes.push(child)

  if (!targetNode.children) {
    targetNode.children = []
  }

  targetNode.children.push(targetHtml.nodes.length - 1)

  targetHtml.nodes[parentIndex] = { ...targetNode }

  targetObject.html = targetHtml

  return targetObject
}

export const copyHtmlObject = (source: HtmlObject, id: number): HtmlObject => {
  // Retrieve the node to be copied using its ID.
  const nodeToCopy = source.html.nodes[id];

  // Deep clone the node
  const newNode: StorableHtmlNode = {
    ...nodeToCopy,
    children: nodeToCopy.children ? [...nodeToCopy.children] : []  // Clone children array if it exists
  };

  // Initialize a new HtmlObject with the same metadata.
  const objectCopy: HtmlObject = {
    metadata: { ...source.metadata },
    html: {
      nodes: [...source.html.nodes, newNode]  // Add the cloned node to the existing nodes array
    }
  };

  return objectCopy;
};

export const getAspectRatio = (imageUrl: string) => {
  // return a promise that either resolves with the aspect ratio or rejects with an error
  // promise: an asynchronous operation and serves as a placeholder for its eventual success or failure outcome
  return new Promise<number>((resolve, reject) => {
    // instantiate an image object
    const img = new Image(); 

    img.onload = function() { 
      // calculate and resolve the aspect ratio
      // resolve: function used to transition a Promise from its initial pending state to a fulfilled state
      resolve(img.width / img.height); 
    };

    img.onerror = function() { 
      // reject the Promise if the image fails to load
      reject(new Error('Failed to load image')); 
    };
    // set src url
    img.src = imageUrl; 
  });
}



// Define a custom hook for saving and loading editor states
export const useSaveLoadActions = () => {
  // Access the current editor state and dispatch function
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  
  // Function to save the editor state to local storage
  const saveToLocalStorage = () => {
    // Serialize the editor state to JSON
    const jsonString = JSON.stringify({
      header: editorState.header,
      body: editorState.body,
      footer: editorState.footer
    });
    // Store the serialized state in local storage
    localStorage.setItem('editorState', jsonString);
  };

  // Function to load the editor state from local storage
  const loadFromLocalStorage = () => {
    // Retrieve the serialized editor state from local storage
    const jsonString = localStorage.getItem('editorState');
    if (jsonString) {
      // Parse the serialized state into a JavaScript object
      const newState = JSON.parse(jsonString);
      // Dispatch a load state action to update the editor with the loaded state
      editorDispatch({
        type: ActionType.LOAD_STATE,   
        payload: newState
      });
    }
  };

  const loadFromTemplate = (temp: string) => {
    const jsonString = temp;
    if (jsonString) {
      const newState = JSON.parse(jsonString);
      editorDispatch({
        type: ActionType.LOAD_STATE,   
        payload: newState
      });
    }
  };

  // Return the save and load functions for external use
  return { saveToLocalStorage, loadFromLocalStorage, loadFromTemplate };
}
