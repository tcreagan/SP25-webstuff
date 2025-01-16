import { HtmlObject } from "types/HtmlObject";
import { ActionType, EditorAction, EditorState } from "../EditorReducer";
import { sectionFromId, storableNodeToHtmlObject, removeNode, insertDroppedElement, parseId, getDropChildId, getAspectRatio } from "../Helpers";

export function handleDragAndDropAction(state: EditorState, action: EditorAction): EditorState {
    let newState: EditorState
    let dropped: HtmlObject;
    let idNum: number;
    let section: "header" | "body" | "footer";

    switch (action.type) {
        case ActionType.START_DRAG:
            newState = { ...state }

            console.log(action.payload)
            if (action.dragRootId) {
                section = sectionFromId(action.dragRootId)
                idNum = parseInt(action.dragRootId.split("-")[1])
                //newState.widgets.push(storableNodeToHtmlObject(idNum, newState[section]))
                newState[section] = { ...removeNode(idNum, newState[section]) }

                newState.isDragging = true
                //newState.draggedItemId = newState.widgets.length - 1
                console.log(newState.widgets)
                return { ...newState }
            }
            console.log(newState)
            return {
                ...newState,
                isDragging: true,
                draggedItemId: action.payload as number,
            };
        case ActionType.DRAG_OVER: {
            const { section, index } = parseId(action.targetId!)
            const newState = { ...state }
            if (action.targetId !== undefined) {
                let dragged = { ...state.widgets[action.payload.widgetId] }
                if (!dragged) {
                    dragged = { ...state.widgets[state.widgets.length - 1] }
                }
            }

            return {
                ...newState,
                hoveredItemId: action.targetId.toString(),
            };
        }
        case ActionType.DRAG_OUT: {
            const { section, index } = parseId(action.targetId)

            const newState = { ...state }

            newState[section].metadata.preview = undefined

            return { ...state }
        }
        case ActionType.DROP:

            newState = { ...state };
            // Drop data will use the section in the hovered ID
            section = sectionFromId(action.targetId)

            const parent = document.getElementById(action.targetId)

            dropped = structuredClone(action.payload)
            dropped.html.nodes.forEach((node) => {
                console.log("foo")
                if (node.element === "img") {
                    getAspectRatio(node.attributes.src.value).then((aspectRatio: number) => {
                        if (parent) {
                            const width = (parent.clientWidth * 0.90)
                            console.log(width)
                            node.attributes["height"] = {
                                value: `${(width * (1 / aspectRatio)).toFixed(3)}`,
                                input: {
                                    type: "number"
                                }
                            }
                            node.attributes["width"] = {
                                value: `${width.toFixed(3)}`,
                                input: {
                                    type: "number"
                                }
                            }
                        }
                    })
                }

            })

            const calculatedIndex = getDropChildId(action.mouseState, newState, action.targetId)
            newState = insertDroppedElement(calculatedIndex, newState, dropped, action.targetId);

            newState[section].metadata.preview = undefined;

            return {
                ...newState
            };

        case ActionType.CANCEL_DRAG:
            return {
                ...state,
                isDragging: false,
                draggedItemId: null,
                hoveredItemId: null,
            };

        default:
            return state

    }
}