import React from "react";
import PageHeader from "./PageHeader";
import { Editor } from "./editor/Editor";
import Sidebar from "components/Sidebar/Sidebar";
import { EditorProvider } from "state/editor/EditorContext";
import { DragAndDropProvider } from "state/dragAndDrop/DragAndDropContext";
import { MouseProvider } from "state/mouse/MouseContext";
import { TextEditingProvider } from "state/textEditing/TextEditingContext";

type Props = {};

const AppPage = (props: Props) => {
  return (
    <MouseProvider>
      <DragAndDropProvider>
        <TextEditingProvider>
          <EditorProvider>
            <PageHeader />
            <div className="page-content">
              <Editor />
              <Sidebar />
            </div>
          </EditorProvider>
        </TextEditingProvider>
      </DragAndDropProvider>
    </MouseProvider>
  );
};

export default AppPage;
