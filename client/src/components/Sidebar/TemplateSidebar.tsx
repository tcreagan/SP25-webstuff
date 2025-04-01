//thea
import React from 'react'
import one from "../../templates/templateone.json"
import two from "../../templates/templatetwo.json"
import { useSaveLoadActions } from "../../state/editor/Helpers";


type Props = {}

type PropsTemplate = {
  img: string;
}

const Template = ({ img, onClick }: { img: string, onClick: () => void })=>{
  return (
    <div>
       <img src={img} onClick={onClick}/>
    </div>
  );
}

const templateImages = [require('../../assets/images/templates/templateone.png'),
  require('../../assets/images/templates/templatetwo.png'),];
  const templateArray = [one, two];


  const TemplateSidebar = (props: Props) => {
    const { loadFromLocalStorage, loadFromTemplate } = useSaveLoadActions();
    
    const handleTemplateLoad = (index: number) => {
      loadFromTemplate(templateArray[index]);
    }
  
    return (
      <aside className='style-sidebar'>
        <header className='sidebar-header'>
          <h2>TEMPLATE</h2>
        </header>
        <div className="grid-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
          {templateImages.map((img: string, index: number) => (
            <Template key={index} img={img} onClick={() => handleTemplateLoad(index)} />
          ))}
        </div>
      </aside>
    );
  }

export default TemplateSidebar