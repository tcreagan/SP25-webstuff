//thea
import React from 'react'
import templateone from "../../templates/templateone.json"
import { useSaveLoadActions } from "../../state/editor/Helpers";


type Props = {}

type PropsTemplate = {
  img: string;
}

///Leaving this here in case i need to revert to it
/*class Template extends React.Component<PropsTemplate>{
  image: string;
  constructor(props: PropsTemplate){
    super(props);
    this.image = props.img
  }


  render() {
    return (
      <div>
         <img src={this.image} />
      </div>
    );

}};*/

const Template = ({ img, onClick }: { img: string, onClick: () => void })=>{
  return (
    <div>
       <img src={img} onClick={onClick}/>
    </div>
  );
}

const templateImages = [require('../../assets/images/templates/template1wip.png'),
  require('../../assets/images/templates/template2wip.png'),
  require('../../assets/images/templates/template3wip.png')];

const templatearr = [String(templateone)];


const TemplateSidebar = (props: Props) => {
  const { loadFromLocalStorage } = useSaveLoadActions();
  const handleTemplateLoad = () => {
    loadFromLocalStorage();
    console.log("Click recieved")
  }
  return (
    <aside className='style-sidebar'>
       <header className='sidebar-header'>
        <h2>TEMPLATE</h2>
      </header>
      <div className="grid-container">
      {templateImages.map((img: string, index: number) => (
          <Template key={index} img={img} onClick={() => handleTemplateLoad()}/>
        ))}
      </div>
      </aside>
    
    
          
  )
}

export default TemplateSidebar