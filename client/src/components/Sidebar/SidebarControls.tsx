//thea (setCurrentPage functionality help from Chris)
import React, { Dispatch, SetStateAction } from "react";
import { Assets } from "assets/assets";
import { AssertsThisTypePredicate } from "typescript";
import { Page } from "./Sidebar";

type Props = {
  setCurrentPage:Dispatch<SetStateAction<Page>>;
}

const SidebarControls = ({setCurrentPage}:Props) => {
  return (
    <aside className="sidebar-controls" >
        
        <div className="sidebar-control" onClick= {( ) => {setCurrentPage("template-sidebar")}}>
          { 
            Assets.images["Template-Icon" as keyof typeof Assets.images]
          }
          <div className="sidebar-text">Templates</div>
          
        </div>

        <div className="sidebar-control" onClick= {( ) => {setCurrentPage("block-sidebar")}}>
          {
            Assets.images["Blocks-Icon" as keyof typeof Assets.images]
          }
          <div className="sidebar-text">Blocks</div>

        </div>
          

        <div className="sidebar-control" onClick= {( ) => {setCurrentPage("element-sidebar")}} >
          {
            Assets.images["Element-Icon" as keyof typeof Assets.images]
          }
          <div className="sidebar-text">Element</div>
        </div>


        <div className="sidebar-control" onClick= {( ) => {setCurrentPage("mapping-sidebar")}}>
          {
            Assets.images["Mapping-Icon" as keyof typeof Assets.images]
          }
          <div className="sidebar-text">Mapping</div>
        </div>

        <div className="sidebar-control" onClick= {( ) => {setCurrentPage("SEO-sidebar")}}>
          {
            Assets.images["SEO-Icon" as keyof typeof Assets.images]
          }
          <div className="sidebar-text">SEO</div>
        </div>

         {/* New control for the Widget Gallery */}
       <div className="sidebar-control" onClick= {( ) => {setCurrentPage("ImageGallery-sidebar")}}>
        
          {Assets.images["Gallery-Icon" as keyof typeof Assets.images]} {/* Use a relevant icon for the gallery */}
          <div className="sidebar-text">Images</div>
        
      </div>
      
    </aside>
  );
};

export default SidebarControls;
