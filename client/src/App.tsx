import "./styles/App.scss"; 
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AllRoutes } from "./routes/AllRoutes";
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoginForm from 'components/pages/Login';
import RegisterForm from 'components/pages/Register';
import DebugLogin from 'components/pages/DebugLogin';
import LogoutButton from 'components/LogoutButton';
import ServerStatus from 'components/ServerStatus';
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
  const [useDebugLogin, setUseDebugLogin] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [isDebugMinimized, setIsDebugMinimized] = useState(false);

  useEffect(() => {
    // Check if token exists in localStorage to persist login state
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ username, token });
    }
  }, []);

  const handleLogin = (username: string, token: string) => {
    console.log('Login successful:', { username, token });
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ username, token });
    
    // Auto-minimize the debug panel on successful login
    setIsDebugMinimized(true);
  };

  const handleRegister = (username: string, token: string) => {
    console.log('Registration successful:', { username, token });
    handleLogin(username, token);  // After registration, log in the user
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  const router = createBrowserRouter(AllRoutes(user, handleLogin, handleLogout)); // Pass user and handleLogout to routes

  const renderAuthForms = () => {
    if (useDebugLogin) {
      return <DebugLogin onLogin={handleLogin} />;
    }
    
    return isRegistering ? (
      <RegisterForm onRegister={handleRegister} />
    ) : (
      <LoginForm onLogin={handleLogin} />
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        {/* Debug button in corner */}
        <button 
          className="debug-toggle" 
          onClick={() => {
            if (showDebug && !isDebugMinimized) {
              setIsDebugMinimized(true);
            } else if (showDebug && isDebugMinimized) {
              setIsDebugMinimized(false);
            } else {
              setShowDebug(true);
              setIsDebugMinimized(false);
            }
          }}
          style={{ 
            position: 'fixed', 
            bottom: '10px', 
            right: '10px',
            zIndex: 1000,
            background: '#f0f0f0',
            border: '1px solid #ccc',
            padding: '5px 10px',
            borderRadius: '4px'
          }}
        >
          {!showDebug ? 'Show Debug' : 
           isDebugMinimized ? 'Expand Debug' : 'Minimize Debug'}
        </button>

        {showDebug && (
          <div className="debug-panel" style={{ 
            position: 'fixed', 
            bottom: '50px', 
            right: '10px',
            zIndex: 999,
            background: 'rgba(240, 240, 240, 0.9)',
            border: '1px solid #ccc',
            padding: isDebugMinimized ? '10px' : '15px',
            borderRadius: '4px',
            width: isDebugMinimized ? 'auto' : '300px',
            height: isDebugMinimized ? 'auto' : 'auto',
            maxHeight: isDebugMinimized ? '40px' : '80vh',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            textAlign: 'left'
          }}>
            {isDebugMinimized ? (
              <div className="minimized-info">
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Debug Panel (Minimized)
                </span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>Debug Information</h3>
                  <button
                    onClick={() => setShowDebug(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: '0'
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="debug-option" style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={useDebugLogin}
                      onChange={() => setUseDebugLogin(!useDebugLogin)}
                      style={{ marginRight: '8px' }}
                    />
                    Use Debug Login
                  </label>
                  <p style={{ fontSize: '0.8rem', margin: '5px 0 0 0', color: '#666' }}>
                    Bypasses server authentication for development
                  </p>
                </div>
                <ServerStatus />
              </>
            )}
          </div>
        )}

        {!user ? (
          <>
            {renderAuthForms()}
            <div className="auth-toggle">
              {!useDebugLogin && (
                <button 
                  className="toggle-button"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                </button>
              )}
            </div>
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
