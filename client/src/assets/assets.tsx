import { RxLetterCaseCapitalize } from "react-icons/rx";
import { HiOutlineDocument } from "react-icons/hi2";
import { LuBlocks } from "react-icons/lu";
import { BiEdit } from "react-icons/bi";
import { PiTreeViewFill } from "react-icons/pi";
import { LuZoomIn } from "react-icons/lu";
import { IoVolumeHigh } from "react-icons/io5";
import { BsImage } from "react-icons/bs";
import { FaLink } from "react-icons/fa6";
import { FaCircle } from "react-icons/fa";
import { LuColumns2 } from "react-icons/lu";
import { LuColumns3 } from "react-icons/lu";
import { FaVideo } from "react-icons/fa";
import { BsPlusLg } from "react-icons/bs";
import { RiInsertRowBottom } from "react-icons/ri";
import { BiSolidNavigation } from "react-icons/bi";
  
/*Need to add a new icon? Look at https://react-icons.github.io for options!
Common hex colors for icons include...
Sidebar controls: #f0d1ff
Widget icons: #333333
Clicked-Widget Menu (what pops up in the upper right when clicking a widget): #1c274c
If the icon is for a widget, use size = 45, if for sidebar controls use 30.*/

export const Assets = {
  images: {
    "text-icon": <RxLetterCaseCapitalize size="45" style={{ color: "#333333" }}/>,
    "audio-icon": <IoVolumeHigh size="45" style={{ color: "#333333" }}/>,
    "image-icon": <BsImage size="45" style={{ color: "#333333" }}/>,
    "logo-icon": <FaCircle size="45" style={{ color: "#333333" }}/>,
    "two-columns-icon": <LuColumns2 size="45" style={{ color: "#333333" }}/>,
    "three-columns-icon": <LuColumns3 size="45" style={{ color: "#333333" }}/>,
    "row-icon": <RiInsertRowBottom size="45" style={{ color: "#333333" }}/>,
    "nav-icon": <BiSolidNavigation size="45" style={{ color: "#333333" }}/>,
    "video-icon": <FaVideo size="45" style={{ color: "#333333" }}/>,
    "link-icon": <FaLink size="45" style={{ color: "#333333" }}/>,
    "Template-Icon": <HiOutlineDocument className="TemplateIcon" size = "30" style={{color:"#f0d1ff"}}/>,
    "Blocks-Icon": <LuBlocks className="BlocksIcon" size = "30" style={{color:"#f0d1ff"}}/>,
    "Element-Icon": <BiEdit className="ElementIcon" size = "30" style={{color:"#f0d1ff"}}/>,
    "Mapping-Icon": <PiTreeViewFill className="MappingIcon" size = "30" style={{color:"#f0d1ff"}}/>,
    "Gallery-Icon": <BsImage size="30" style={{ color: "#f0d1ff" }}/>,
    "SEO-Icon": <LuZoomIn className="SEOIcon" size = "30" style={{color:"#f0d1ff"}}/>,
    "add-icon": <BsPlusLg className = "AddIcon" size="45" style={{color:"#1c274c"}}/>
  }
}