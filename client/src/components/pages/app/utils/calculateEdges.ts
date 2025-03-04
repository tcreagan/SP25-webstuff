export interface WidgetPosition {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
  }
  
  export function getWidgetEdges(widget: WidgetPosition) {
    return {
      left: widget.left,
      right: widget.left + widget.width,
      top: widget.top,
      bottom: widget.top + widget.height,
    };
  }
  
  export function isCloseEnough(edge1: number, edge2: number, threshold: number = 10) {
    return Math.abs(edge1 - edge2) <= threshold;
  }
  
