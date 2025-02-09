import "./styles/App.scss"; 
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AllRoutes } from "./routes/AllRoutes";

const router = createBrowserRouter(AllRoutes)

function App() {
  return (
      <div className="App">
        <RouterProvider router={router}/>
      </div>
  );
}
//gpt generated 
//needs review 
//required for drag and drop to work
/*
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Editor from './components/Editor';

const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Editor />
    </DndProvider>
  );
};

*/

export default App;
