import { RouteObject } from "react-router";
import { HomeRoutes } from "./HomeRoutes/HomeRoutes";
import { AppRoutes } from "./AppRoutes/AppRoutes";

export const AllRoutes:RouteObject[] = [
  ...HomeRoutes,
  ...AppRoutes
]