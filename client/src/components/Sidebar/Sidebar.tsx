
//thea (help from Chris)
import React, { useEffect, useState } from "react";
import SidebarControls from "./SidebarControls";
import "styles/sidebar.scss";
import TemplateSidebar from "./TemplateSidebar";
import BlockSidebar from "./BlockSidebar";
import ElementSidebar from "./ElementSidebar";
import SEOSidebar from "./SEOSidebar";
import MappingSidebar from "./MappingSidebar";
import { useEditor } from "state/editor/EditorReducer";



export type Page = "template-sidebar" | "block-sidebar" | "element-sidebar" | "SEO-sidebar" | "mapping-sidebar"

const pageMapping = {
  "template-sidebar": <TemplateSidebar />,
  "block-sidebar": <BlockSidebar />,
  "element-sidebar": <ElementSidebar />,
  "SEO-sidebar": <SEOSidebar />,
  "mapping-sidebar": <MappingSidebar />
}

const Sidebar: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("block-sidebar");
  const {state:editorState} = useEditor();

  useEffect(() => {
    if(editorState.selectedElementId){
      setCurrentPage("element-sidebar")
    }
  }, [editorState.selectedElementId])

  return (
    <div className="sidebar-container">
      <SidebarControls setCurrentPage={setCurrentPage} />
      {
        pageMapping[currentPage]
      }

      { }
    </div>
  );
};

export default Sidebar;
