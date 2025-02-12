//gpt helped
//used to make react-resizable recognizable in the project
declare module 'react-resizable' {
  import { Component } from 'react';

  export interface ResizableBoxProps {
    width: number;
    height: number;
    onResizeStop?: () => void;
    [key: string]: any;  // Add more specific props as needed
  }

  export class ResizableBox extends Component<ResizableBoxProps> {}
}
