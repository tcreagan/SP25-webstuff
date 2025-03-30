import React, { useState } from 'react';
import './Login.scss'; // Reuse login styles

interface DebugLoginProps {
  onLogin: (username: string, token: string) => void;
}

const DebugLogin: React.FC<DebugLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // This function simulates a successful login without actually hitting the server
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      console.log('Debug login activated for:', email);
      
      // Create a dummy token (for development only!)
      const dummyToken = btoa(`${email}:${new Date().getTime()}`);
      
      // Call the onLogin callback with the user info
      onLogin(email, dummyToken);
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Debug Login</h2>
        <p className="debug-warning" style={{ color: '#e53935', marginBottom: '1rem', fontSize: '0.875rem' }}>
          ⚠️ This is a development-only login that bypasses server authentication.
        </p>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter any email"
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
            placeholder="Enter any password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Debug Login'}
        </button>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button 
            type="button" 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0066cc',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {showDebugInfo ? 'Hide Debug Info' : 'Show Debug Info'}
          </button>
        </div>
        
        {showDebugInfo && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8f8f8', borderRadius: '4px', fontSize: '0.8rem' }}>
            <p><strong>What is this?</strong></p>
            <p>This is a development login that bypasses the normal authentication flow. Use this when:</p>
            <ul>
              <li>The server authentication is not working</li>
              <li>You need to test front-end features that require login</li>
              <li>The server is unavailable or experiencing errors</li>
            </ul>
            <p><strong>How it works:</strong></p>
            <p>This login creates a simulated token and user session without contacting the server. This is <em>not secure</em> and should only be used during development.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default DebugLogin; 
