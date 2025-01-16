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

export default App;
