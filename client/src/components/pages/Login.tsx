// pages/Login.tsx

import React, { useState } from 'react';
import '../../styles/Login.scss';

interface LoginProps {
  onLogin: (email: string, token: string) => void;
  onNavigateToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password }),
      });

      // Check content type to avoid parsing HTML as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        
        if (response.ok) {
          // If the backend doesn't return a token, we can just pass an empty string
          onLogin(data.email, data.accessToken || '');
        } else {
          setError(data.error || 'Login failed');
        }
      } else {
        // Not JSON, likely an HTML error page
        const text = await response.text();
        console.error('Received non-JSON response:', text.substring(0, 150) + '...');
        throw new Error('Server returned an invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
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
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className="error-message">{error}</p>}
        <p className="switch-auth">
          Don't have an account?{' '}
          <button 
            type="button" 
            onClick={onNavigateToRegister} 
            className="text-button"
            disabled={isLoading}
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;

