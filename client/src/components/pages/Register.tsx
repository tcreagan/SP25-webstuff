import React, { useState } from 'react';
import './Register.scss'; // Import the scss file
import { authApi } from '../../services/api';

interface RegisterFormProps {
  onRegister: (username: string, token: string) => void;
}

const Register: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugHelp, setShowDebugHelp] = useState(false);
  const [serverResponse, setServerResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowDebugHelp(false);
    setServerResponse(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const data = await authApi.register(email, password, name);
      console.log('Registration successful:', data);
      onRegister(data.username || data.email, data.accessToken || data.token);
    } catch (error: any) {
      console.error('Registration failed:', error);
      setServerResponse(error);
      
      // Different error messages based on the type of error
      if (error.status === 500) {
        setError('Server error (500): The server encountered an internal error. This might be due to missing required fields or validation issues.');
        setShowDebugHelp(true);
      } else if (error.status === 400 && error.data?.error) {
        setError(error.data.error);
      } else if (error.status === 404) {
        setError('Registration service not found. Please check server configuration.');
        setShowDebugHelp(true);
      } else if (error.message && error.message.includes('timed out')) {
        setError('Server connection timed out. Please check if the server is running.');
        setShowDebugHelp(true);
      } else if (error.message && error.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check if your server is running.');
        setShowDebugHelp(true);
      } else if (error.data?.message) {
        setError(error.data.message);
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

  // Alternative approach - direct POST request bypassing our utility functions
  const handleDirectRegistration = async () => {
    setIsLoading(true);
    setError('');
    setShowDebugHelp(false);
    setServerResponse(null);

    try {
      // Make a direct fetch to the server
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          name,
          // Add any other fields the server might expect
        }),
      });
      
      console.log('Direct registration response status:', response.status);
      
      // Log the raw response for debugging
      let responseText;
      try {
        responseText = await response.text();
        console.log('Raw response:', responseText);
        
        // Try to parse as JSON if possible
        try {
          const data = JSON.parse(responseText);
          console.log('Parsed response data:', data);
          
          if (response.ok) {
            onRegister(data.username || data.email, data.accessToken || data.token);
          } else {
            setError(data.error || data.message || 'Registration failed');
            setServerResponse(data);
          }
        } catch (e) {
          console.log('Response is not JSON:', e);
          setError('Registration failed: Server returned non-JSON response');
          setServerResponse({ raw: responseText });
        }
      } catch (e) {
        console.error('Error reading response:', e);
        setError('Registration failed: Error reading server response');
      }
    } catch (e: any) {
      console.error('Direct registration error:', e);
      setError(`Registration failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Minimal payload approach
  const handleMinimalRegistration = async () => {
    setIsLoading(true);
    setError('');
    setShowDebugHelp(false);
    setServerResponse(null);

    try {
      // Try with just username and password
      const payload = {
        email: email,    // Try as username
        username: email, // Try as username 
        password: password
      };
      
      console.log('Using minimal registration payload:', payload);
      
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      console.log('Minimal registration response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      try {
        if (responseText) {
          const data = JSON.parse(responseText);
          console.log('Parsed minimal registration response:', data);
          
          if (response.ok) {
            onRegister(data.username || data.email, data.accessToken || data.token);
          } else {
            setError(data.error || data.message || 'Registration failed');
            setServerResponse(data);
          }
        } else {
          setError('Server returned empty response');
          setServerResponse({ empty: true });
        }
      } catch (e) {
        console.log('Response is not JSON:', e);
        setError('Registration failed: Server returned non-JSON response');
        setServerResponse({ raw: responseText });
      }
    } catch (e: any) {
      console.error('Minimal registration error:', e);
      setError(`Registration failed: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        
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
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          <span className="password-requirements">
            Password must be at least 8 characters
          </span>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
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
                  <strong>Server error (500)?</strong> This typically indicates that your registration data doesn't match what the server expects.
                  Make sure all fields are properly filled out and match the server's requirements.
                </p>
                
                {error.includes('500') && (
                  <div className="alternative-actions">
                    <p><strong>Try alternative registration methods:</strong></p>
                    <div className="button-group">
                      <button 
                        type="button" 
                        className="alternative-action-button"
                        onClick={handleDirectRegistration}
                        disabled={isLoading}
                      >
                        Try Direct Registration
                      </button>
                      <button 
                        type="button" 
                        className="alternative-action-button"
                        onClick={handleMinimalRegistration}
                        disabled={isLoading}
                      >
                        Try Minimal Registration
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {serverResponse && (
          <div className="server-response">
            <h4>Server Response Details:</h4>
            <pre>{JSON.stringify(serverResponse, null, 2)}</pre>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
