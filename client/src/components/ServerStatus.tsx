import React, { useState, useEffect } from 'react';

interface ServerCheck {
  port: number;
  status: 'checking' | 'online' | 'offline';
  error?: string;
}

const ServerStatus: React.FC = () => {
  const [serverChecks, setServerChecks] = useState<ServerCheck[]>([
    { port: 3001, status: 'checking' },
    { port: 3000, status: 'checking' },
    { port: 5000, status: 'checking' },
    { port: 8080, status: 'checking' }
  ]);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [checkingComplete, setCheckingComplete] = useState(false);

  useEffect(() => {
    // Try the proxy health check first
    fetch('/health').then(res => {
      console.log('Dev server health check:', res.status);
    }).catch(err => {
      console.error('Dev server health check failed:', err);
    });

    // Check each port
    const checkPorts = async () => {
      const results = [...serverChecks];
      let foundServer = false;
      
      for (let i = 0; i < results.length; i++) {
        const check = results[i];
        try {
          console.log(`Checking server on port ${check.port}...`);
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

          const response = await fetch(`http://localhost:${check.port}/api/health`, {
            method: 'HEAD',
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          console.log(`Port ${check.port} response:`, response.status);
          results[i] = {
            ...check,
            status: 'online'
          };
          
          foundServer = true;
          
          // If this is the first successful port, select it
          if (selectedPort === null) {
            setSelectedPort(check.port);
            
            // Update the API_URL in localStorage for the api.ts service to use
            localStorage.setItem('API_SERVER_PORT', check.port.toString());
          }
        } catch (err) {
          console.log(`Port ${check.port} check failed:`, err);
          results[i] = {
            ...check,
            status: 'offline', 
            error: err instanceof Error ? err.message : 'Unknown error'
          };
        }
      }
      
      // If no servers were found, clear any stored port
      if (!foundServer) {
        console.warn('No servers found on any port. Clearing stored port.');
        localStorage.removeItem('API_SERVER_PORT');
        setSelectedPort(null);
      }
      
      setServerChecks(results);
      setCheckingComplete(true);
    };

    checkPorts();
  }, []);

  const handleSelectPort = (port: number) => {
    setSelectedPort(port);
    localStorage.setItem('API_SERVER_PORT', port.toString());
    
    // Refresh the page to apply the new API URL
    window.location.reload();
  };

  const handleManualPortInput = () => {
    const portInput = prompt('Enter the port number where your server is running:');
    if (!portInput) return;
    
    const port = parseInt(portInput, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      alert('Please enter a valid port number between 1 and 65535');
      return;
    }
    
    setSelectedPort(port);
    localStorage.setItem('API_SERVER_PORT', port.toString());
    
    // Add this port to the list if it's not already there
    if (!serverChecks.some(check => check.port === port)) {
      setServerChecks([...serverChecks, { port, status: 'online' }]);
    }
    
    // Refresh the page to apply the new API URL
    window.location.reload();
  };

  return (
    <div className="server-status">
      <h4>Server Status Check</h4>
      
      <table style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Port</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {serverChecks.map(check => (
            <tr key={check.port}>
              <td>{check.port}</td>
              <td>
                {check.status === 'checking' ? '...' : 
                 check.status === 'online' ? '✅ Online' : '❌ Offline'}
              </td>
              <td>
                {check.status === 'online' && (
                  <button 
                    onClick={() => handleSelectPort(check.port)}
                    className={selectedPort === check.port ? 'active' : ''}
                    style={{
                      background: selectedPort === check.port ? '#4CAF50' : '#f1f1f1',
                      color: selectedPort === check.port ? 'white' : 'black',
                      border: '1px solid #ddd',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    {selectedPort === check.port ? 'Selected' : 'Use This'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <button 
          onClick={handleManualPortInput}
          style={{
            background: '#f1f1f1',
            border: '1px solid #ddd',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Specify Custom Port
        </button>
      </div>

      {checkingComplete && !serverChecks.some(check => check.status === 'online') && (
        <div className="troubleshooting" style={{ marginTop: '15px' }}>
          <p><strong>No available servers found.</strong></p>
          <p>Troubleshooting steps:</p>
          <ol>
            <li>Make sure your server is running (check terminal)</li>
            <li>Verify server is running on one of the ports above</li>
            <li>Check for CORS configuration on your server</li>
            <li>Try restarting both client and server</li>
            <li>Check if firewall is blocking connections</li>
          </ol>
          <p>
            Current port in localStorage: {localStorage.getItem('API_SERVER_PORT') || 'None'}
            {localStorage.getItem('API_SERVER_PORT') && (
              <button 
                onClick={() => {
                  localStorage.removeItem('API_SERVER_PORT');
                  window.location.reload();
                }}
                style={{
                  background: '#ff5252',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                  fontSize: '12px'
                }}
              >
                Clear
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServerStatus; 
