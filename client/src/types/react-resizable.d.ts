//used to make react-resizable recognizable in the project
declare module 'react-resizable' {
  import { Component, SyntheticEvent } from 'react';

  export interface ResizeCallbackData {
    node: HTMLElement;
    size: {
      width: number;
      height: number;
    };
    handle: string;
  }

  export interface ResizableBoxProps {
    width: number;
    height: number;
    onResizeStop?: (e: SyntheticEvent, data: ResizeCallbackData) => void;
    onResize?: (e: SyntheticEvent, data: ResizeCallbackData) => void;
    minConstraints?: [number, number];
    maxConstraints?: [number, number];
    resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
    draggableOpts?: {
      grid?: [number, number];
    };
    [key: string]: any;  // Add more specific props as needed
  }

  export class ResizableBox extends Component<ResizableBoxProps> {}
}
