// API service to handle all server requests

// Use the port discovered by ServerStatus component, or fall back to the proxy
const getApiBaseUrl = (): string => {
  const serverPort = localStorage.getItem('API_SERVER_PORT');
  if (serverPort) {
    return `http://localhost:${serverPort}/api`;
  }
  return '/api'; // Use relative URL with proxy
};

// When a direct connection fails, try the proxy route
const getApiProxyUrl = (): string => {
  return '/api'; // Use relative URL with proxy
};

// Helper function to handle API responses with timeout
const handleResponse = async (response: Response) => {
  console.log(`API Response: ${response.status} ${response.statusText}`);
  
  try {
    // Check if response has JSON content
    const contentType = response.headers.get('content-type');
    let data: any = null;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        // For a 500 error, if we can't parse JSON, create an error object
        if (response.status === 500) {
          throw { 
            status: response.status, 
            data: { error: 'Server encountered an error. Check that all required fields are provided.' } 
          };
        }
        throw jsonError;
      }
    } else {
      // Handle non-JSON response
      const text = await response.text();
      console.error('Non-JSON response:', text);
      
      // If it's a 500 error, create a more helpful error
      if (response.status === 500) {
        throw { 
          status: response.status, 
          data: { error: 'Server error: ' + (text || 'Internal Server Error') } 
        };
      }
      
      throw new Error(`Server returned a non-JSON response: ${text}`);
    }

    if (!response.ok) {
      throw { status: response.status, data };
    }
    
    return data;
  } catch (error: any) {
    // Ensure we're always throwing an object with status and data
    if (error.status && (error.data || error.message)) {
      throw error;
    }
    
    console.error('Error in handleResponse:', error);
    throw { 
      status: response.status, 
      data: { error: error.message || 'Unknown error occurred' } 
    };
  }
};

// Fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 5000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Fetch with fallback to proxy
const fetchWithFallback = async (endpoint: string, options: RequestInit) => {
  // Try direct connection first if a port is specified
  const directUrl = `${getApiBaseUrl()}${endpoint}`;
  const proxyUrl = `${getApiProxyUrl()}${endpoint}`;
  
  // If we're already using a proxy URL, don't try direct connection
  if (directUrl === proxyUrl) {
    console.log(`Using proxy URL for ${endpoint}: ${proxyUrl}`);
    return await fetchWithTimeout(proxyUrl, options, 8000);
  }
  
  try {
    console.log(`Trying direct connection for ${endpoint}: ${directUrl}`);
    return await fetchWithTimeout(directUrl, options, 8000);
  } catch (error) {
    // If direct connection fails, try proxy
    console.warn(`Direct connection failed for ${endpoint}, falling back to proxy`, error);
    
    // Clear any stored port that's not working
    if (localStorage.getItem('API_SERVER_PORT')) {
      console.warn('Clearing stored port due to connection failure');
      localStorage.removeItem('API_SERVER_PORT');
    }
    
    console.log(`Using proxy fallback for ${endpoint}: ${proxyUrl}`);
    return await fetchWithTimeout(proxyUrl, options, 8000);
  }
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      console.log('Login request with email:', email);
      const response = await fetchWithFallback('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Login request failed:', error);
      
      // If it's an AbortError, provide a clearer message
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Server connection timed out. Please try again or check if the server is running.');
      }
      
      throw error;
    }
  },
  
  register: async (email: string, password: string, name: string) => {
    try {
      console.log('Registration request with email:', email, 'and name:', name);
      
      // Try alternative payload formats - the server might expect a different structure
      // Create a more comprehensive payload with multiple field combinations
      const payload = {
        email: email,
        password: password,
        name: name,
        username: email,  // Some servers use username instead of email
        fullName: name,   // Some servers use fullName instead of name
        displayName: name, // Another possible field name
        confirmPassword: password // Some servers require this
      };
      
      console.log('Using registration payload:', payload);
      
      const response = await fetchWithFallback('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Registration request failed:', error);
      
      // If it's an AbortError, provide a clearer message
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error('Server connection timed out. Please try again or check if the server is running.');
      }
      
      throw error;
    }
  },
  
  // Add a simple API health check method
  checkHealth: async () => {
    try {
      const response = await fetchWithTimeout(`${getApiBaseUrl()}/health`, { method: 'HEAD' }, 3000);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

export default {
  auth: authApi
}; 
