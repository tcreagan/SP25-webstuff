import { ReactComponent as TextIcon } from "./images/text-icon.svg";
import{ReactComponent as TemplateIcon} from "./images/Template-Icon.svg";
import { ReactComponent as BlocksIcon } from "./images/Blocks-Icon.svg";
import { ReactComponent as ElementIcon } from "./images/Element-Icon.svg";
import { ReactComponent as MappingIcon } from "./images/Mapping-Icon.svg";
import { ReactComponent as SEOIcon } from "./images/SEO-Icon.svg";
import { ReactComponent as AudioIcon } from "./images/audio-icon.svg";
import { ReactComponent as ImageIcon } from "./images/image-icon.svg";
import { ReactComponent as LinkIcon } from "./images/link-icon.svg";
import { ReactComponent as LogoIcon } from "./images/logo-icon.svg";
import { ReactComponent as TwoColumnsIcon } from "./images/two-columns-icon.svg";
//import { ReactComponent as ThreeColumnsIcon } from "./images/three-columns-icon.svg";
import { ReactComponent as VideoIcon } from "./images/video-icon.svg";


export const Assets = {
  images: {
    "text-icon": <TextIcon height="45" width="45" style={{ color: "#808080" }}/>,
    "audio-icon": <AudioIcon height="45" width="45" style={{ color: "#808080" }}/>,
    "image-icon": <ImageIcon height="45" width="45" style={{ color: "#808080" }}/>,
    "logo-icon": <LogoIcon height="45" width="45" style={{ color: "#808080" }}/>,
    "two-columns-icon": <TwoColumnsIcon height="45" width="45" style={{ color: "#808080" }}/>,
    //"three-columns-icon": <ThreeColumnsIcon height="45" width="45" style={{ color: "#808080" }}/>,
    "video-icon": <VideoIcon height="45" width="45" style={{ color: "#808080" }}/>,
    "link-icon": <LinkIcon  height="45" width="45" style={{ color: "#808080" }}/>,
    "Template-Icon": <TemplateIcon className="TemplateIcon"/>,
    "Blocks-Icon": <BlocksIcon className="BlocksIcon"/>,
    "Element-Icon": <ElementIcon className="ElementIcon"/>,
    "Mapping-Icon": <MappingIcon className="MappingIcon"/>,
    "SEO-Icon": <SEOIcon className="SEOIcon"/>

  }
}