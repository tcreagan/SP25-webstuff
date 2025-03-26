import "./styles/App.scss"; 
import { BrowserRouter as Router } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoginForm from 'components/pages/Login';
import LogoutButton from './components/LogoutButton';
import RegisterForm from 'components/pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContainer from './components/pages/AuthContainer';
import MainApp from './components/MainApp';
// Import all required providers
import { EditorProvider } from './state/editor/EditorContext';
import { MouseProvider } from './state/mouse/MouseContext';
import { DragAndDropProvider } from './state/dragAndDrop/DragAndDropContext';
import { TextEditingProvider } from './state/textEditing/TextEditingContext';

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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if token exists in localStorage to persist login state
    const storedToken = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (storedToken && username) {
      setUser({ username, token: storedToken });
      setToken(storedToken);
    }
  }, []);

  const handleAuthSuccess = (email: string, token: string) => {
    setUser({ username: email, token });
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('username', email);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          {user ? (
            <>
              <LogoutButton handleLogout={handleLogout} />
              <MouseProvider>
                <TextEditingProvider>
                  <DragAndDropProvider>
                    <EditorProvider>
                      <MainApp user={user} />
                    </EditorProvider>
                  </DragAndDropProvider>
                </TextEditingProvider>
              </MouseProvider>
            </>
          ) : (
            <AuthContainer onAuthSuccess={handleAuthSuccess} />
          )}
        </div>
      </DndProvider>
    </Router>
  );
};

export default App;
