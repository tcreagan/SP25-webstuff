import { RouteObject, Navigate } from "react-router-dom";
import { HomeRoutes } from "./HomeRoutes/HomeRoutes";
import { AppRoutes } from "./AppRoutes/AppRoutes";
import ImageGallery from "components/Sidebar/ImageGallery";
import Home from 'components/pages/Home';  // Assuming you have a Home page component
import Editor from 'components/pages/app/editor/Editor';  // Assuming you have an Editor component
//import Login from 'components/pages/Login';


interface User {
  username: string;
  token: string;
}

export const AllRoutes = (user: User | null, handleLogin: (username: string, token: string) => void, handleLogout: () => void): RouteObject[] => [
  ...HomeRoutes,
  ...AppRoutes,
  {
    path: "/gallery",  // Add a new route for the image gallery
    element: <ImageGallery onSelect={(url) => console.log("Selected image URL:", url)} />,
  },
  {
    path: '/',
    element: <Home />,  // Public route
  },/*
  {
    path: '/login',
    element: user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />,  // If logged in, redirect to home
  },*/
  {
    path: '/editor',
    element: user ? <Editor /> : <Navigate to="/login" />,  // Protect this route, redirect if not logged in
  }
]
