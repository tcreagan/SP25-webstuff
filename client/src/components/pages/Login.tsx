// pages/Login.tsx

import React, { useState } from 'react';
import './Login.scss'; // Import the scss file
import { authApi } from '../../services/api';

interface LoginProps {
  onLogin: (username: string, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugHelp, setShowDebugHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowDebugHelp(false);

    try {
      const data = await authApi.login(email, password);
      console.log('Login successful:', data);
      onLogin(data.username || data.email, data.accessToken || data.token);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Different error messages based on the type of error
      if (error.status === 500) {
        setError('Server error: The server encountered an internal error. Please check your input data.');
        setShowDebugHelp(true);
      } else if (error.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else if (error.status === 404) {
        setError('Login service not found. Please check server configuration.');
        setShowDebugHelp(true);
      } else if (error.message && error.message.includes('timed out')) {
        setError('Server connection timed out. Please check if the server is running.');
        setShowDebugHelp(true);
      } else if (error.message && error.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check if your server is running.');
        setShowDebugHelp(true);
      } else if (error.data?.error) {
        setError(error.data.error);
      } else if (error.message) {
        setError(error.message);
        setShowDebugHelp(true);
      } else {
        setError('An error occurred. Please try again later.');
        setShowDebugHelp(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Login'}
        </button>
        
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
            {showDebugHelp && (
              <div className="error-help">
                <p>
                  Click the "Show Debug" button in the bottom right corner to check server connectivity.
                </p>
                <p>
                  <strong>Server error?</strong> This typically indicates that your login data doesn't match what the server expects.
                  Make sure all fields are properly filled out and match the server's requirements.
                </p>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;

