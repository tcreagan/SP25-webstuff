//thea
import React, { useEffect } from 'react'
import verticalContainer from "widgetFiles/verticalContainer.json"
import twoCol from "widgetFiles/twoCol.json"
import threeCol from "widgetFiles/threeCol.json"
import horizontalContainer from "widgetFiles/horizontalContainer.json"
import textbox from "widgetFiles/textbox.json"
import heading1 from "widgetFiles/heading1.json"
import heading2 from "widgetFiles/heading2.json"
import heading3 from "widgetFiles/heading3.json"
import image from "widgetFiles/image.json"
import link from "widgetFiles/link.json"
import logo from "widgetFiles/logo.json"
import video from "widgetFiles/video.json"
import audio from "widgetFiles/audio.json"
import { HtmlObject } from "types/HtmlObject";
import Widget from "components/pages/app/widgets/Widget";
import {ActionType, useEditor } from "state/editor/EditorReducer";
type Props = {};

const BlockSidebar = (props: Props) => {
  const { state: editor, dispatch: editorDispatch } = useEditor();

  const verticalD: HtmlObject = verticalContainer as HtmlObject;
  const horizontalD: HtmlObject = horizontalContainer as HtmlObject;
  const twoColD: HtmlObject = twoCol as HtmlObject;
  const threeColD: HtmlObject = threeCol as HtmlObject;
  const textboxD: HtmlObject = textbox as HtmlObject;
  const heading1D: HtmlObject = heading1 as HtmlObject;
  const heading2D: HtmlObject = heading2 as HtmlObject;
  const heading3D: HtmlObject = heading3 as HtmlObject;
  const imageD: HtmlObject = image as HtmlObject;
  const linkD: HtmlObject = link as HtmlObject;
  const logoD: HtmlObject = logo as HtmlObject;
  const videoD: HtmlObject = video as HtmlObject;
  const audioD: HtmlObject = audio as HtmlObject;


  useEffect(() => {
    if (editor.widgets.length === 0) {
      editorDispatch({
        type: ActionType.FETCHED_WIDGETS,
        widgets: [verticalD, horizontalD,  twoColD, threeColD, textboxD,
           heading1D, heading2D, heading3D, imageD, logoD, videoD, audioD, linkD],
      });
    }
  });
  if (editor.widgets && editor.widgets.length > 0) {
    return (
      <aside className="style-sidebar">
        <header className="sidebar-header">
          <h2>BLOCKS</h2>
        </header>
        <div className="grid-container">
          {editor.widgets.map((w,i) => {
            return <Widget widgetId={i} key={i} />
          })}
        </div>
      </aside>
    );
  } else {
    return <></>;
  }
};

export default BlockSidebar;
