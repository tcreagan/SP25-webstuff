import { RouteData } from "@remix-run/router/dist/utils";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Home from "../../components/pages/Home";

export const HomeRoutes:RouteObject[] = [
  {
    path: "/",
    element: <Home />
  }
]