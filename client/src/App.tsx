import "./styles/App.scss"; 
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AllRoutes } from "./routes/AllRoutes";
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoginForm from 'components/pages/Login';
import LogoutButton from 'components/LogoutButton';
import RegisterForm from 'components/pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';

/*
function App() {
  return (
      <div className="App">
        <RouterProvider router={router}/>
      </div>
  );
}
  */
 interface User {
  username: string;
  token: string;
 }

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);  // Toggle for registration form

  useEffect(() => {
    // Check if token exists in localStorage to persist login state
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ username, token });
    }
  }, []);

  const handleLogin = (username: string, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ username, token });
  };

  const handleRegister = (username: string, token: string) => {
    handleLogin(username, token);  // After registration, log in the user
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const router = createBrowserRouter(AllRoutes(user, handleLogin, handleLogout)); // Pass user and handleLogout to routes

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        {!user ? (
          <>
            {isRegistering ? (
              <RegisterForm onRegister={handleRegister} />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )}
            <button onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Switch to Login' : 'Switch to Register'}
            </button>
          </>
        ) : (
          <>
            <LogoutButton handleLogout={handleLogout} />
            <RouterProvider router={router} />
          </>
        )}
      </div>
    </DndProvider>
  );
};

export default App;
