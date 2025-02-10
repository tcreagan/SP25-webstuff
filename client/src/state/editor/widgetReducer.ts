//gpt 
//review
//used to track widget styles and position
// state/editor/WidgetReducer.ts
const widgetReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_WIDGET_STYLE':
      return {
        ...state,
        [action.widgetId]: {
          ...state[action.widgetId],
          styles: { ...state[action.widgetId].styles, ...action.styles },
        },
      };
    case 'UPDATE_WIDGET_POSITION':
      return {
        ...state,
        [action.widgetId]: {
          ...state[action.widgetId],
          position: { x: action.x, y: action.y },
        },
      };
    case 'UPDATE_WIDGET_DIMENSIONS':
      return {
        ...state,
        [action.widgetId]: {
          ...state[action.widgetId],
          dimensions: { width: action.width, height: action.height },
        },
      };
    default:
      return state;
  }
};
