//thea
import React, { useEffect } from 'react'
import twoCol from "widgetFiles/twoCol.json"
import threeCol from "widgetFiles/threeCol.json"
import horizontalContainer from "widgetFiles/container.json"
import textbox from "widgetFiles/textbox.json"
import heading from "widgetFiles/heading.json"
import image from "widgetFiles/image.json"
import link from "widgetFiles/link.json"
import logo from "widgetFiles/logo.json"
import navigation from "widgetFiles/navigation.json"
import video from "widgetFiles/video.json"
import audio from "widgetFiles/audio.json"
import { HtmlObject } from "types/HtmlObject";
import Widget from "components/pages/app/widgets/Widget";
import {ActionType, useEditor } from "state/editor/EditorReducer";
type Props = {};

const BlockSidebar = (props: Props) => {
  const { state: editor, dispatch: editorDispatch } = useEditor();

  const horizontalD: HtmlObject = horizontalContainer as HtmlObject;
  const twoColD: HtmlObject = twoCol as HtmlObject;
  const threeColD: HtmlObject = threeCol as HtmlObject;
  const textboxD: HtmlObject = textbox as HtmlObject;
  const heading1D: HtmlObject = heading as HtmlObject;
  const imageD: HtmlObject = image as HtmlObject;
  const linkD: HtmlObject = link as HtmlObject;
  const logoD: HtmlObject = logo as HtmlObject;
  const nav: HtmlObject = navigation as HtmlObject;
  const videoD: HtmlObject = video as HtmlObject;
  const audioD: HtmlObject = audio as HtmlObject;


  useEffect(() => {
    if (editor.widgets.length === 0) {
      editorDispatch({
        type: ActionType.FETCHED_WIDGETS,
        widgets: [horizontalD,  twoColD, threeColD, textboxD,
           heading1D, imageD, logoD, nav, videoD, audioD, linkD],
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
