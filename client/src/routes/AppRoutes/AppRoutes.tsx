import { RouteObject } from "react-router";
import AppPage from "../../components/pages/app/AppPage"

export const AppRoutes:RouteObject[] = [
  {
    path: "app",
    children:[
      {
        path: "editor",
        element: <AppPage />
      }
    ]
  }
]
