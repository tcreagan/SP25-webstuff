import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthContainerProps {
  onAuthSuccess: (email: string, token: string) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleRegisterSuccess = (email: string) => {
    // After successful registration, switch to login view
    setIsLoginView(true);
  };

  return (
    <div>
      {isLoginView ? (
        <Login
          onLogin={onAuthSuccess}
          onNavigateToRegister={() => setIsLoginView(false)}
        />
      ) : (
        <Register
          onRegister={handleRegisterSuccess}
          onNavigateToLogin={() => setIsLoginView(true)}
        />
      )}
    </div>
  );
};

export default AuthContainer; 
