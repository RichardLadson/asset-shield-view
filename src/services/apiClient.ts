
import axios from 'axios';

// Get the API URL from environment variable or use localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const isDevelopment = import.meta.env.DEV;

// Only log in development
if (isDevelopment) {
  console.log(`🔌 API Client: Using API base URL: ${API_BASE_URL}`);
}

// Check if the API is reachable
const checkApiConnection = async () => {
  try {
    // Use options that show the potential CORS issue more clearly
    const response = await fetch(`${API_BASE_URL}/api/health`, { 
      method: 'HEAD',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(`🔌 API Client: Connection check ${response.ok ? 'successful' : 'failed'} with status ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error('🔌 API Client: Connection check failed:', error);
    
    // Check if this is likely a CORS issue
    if (error.toString().includes('CORS')) {
      console.error('🔌 API Client: CORS ERROR DETECTED! Your backend server needs configuration changes:');
      console.error('1. Update your server to allow requests from: ' + window.location.origin);
      console.error('2. Current allowed origin appears to be: http://localhost:8080');
      console.error('3. Add this to your server: res.header("Access-Control-Allow-Origin", "' + window.location.origin + '")');
    } else {
      console.warn('🔌 API Client: If using ngrok, remember that free tier URLs expire after a few hours and need to be updated');
    }
    
    return false;
  }
};

// Call the check function immediately
checkApiConnection();

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to avoid hanging requests
  timeout: 30000, // 30 seconds
});

// Add request interceptor for logging and timing
apiClient.interceptors.request.use(
  config => {
    // Add timing to track API performance (store on config using any)
    (config as any).requestStartTime = performance.now();
    
    if (isDevelopment) {
      console.log(`🔌 API Client: Sending ${config.method?.toUpperCase()} request to ${config.baseURL}${config.url}`);
    }
    return config;
  },
  error => {
    console.error('🔌 API Client: Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling and performance logging
apiClient.interceptors.response.use(
  response => {
    // Calculate API call duration
    const startTime = (response.config as any).requestStartTime;
    const duration = startTime ? performance.now() - startTime : 0;
    
    // Performance logging
    const emoji = duration < 200 ? '⚡' : duration < 1000 ? '🔄' : '🐌';
    if (isDevelopment && duration > 0) {
      console.log(`${emoji} API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration.toFixed(1)}ms (${response.status})`);
    }
    
    // Warn about slow API calls even in production
    if (duration > 2000) {
      console.warn(`Slow API call: ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration.toFixed(1)}ms`);
    }
    
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('🔌 API Client: Request timed out. Check if your API server is running.');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🔌 API Client: Network error. Check your internet connection and API server.');
      console.warn('🔌 API Client: If using ngrok, ensure the URL is current and the tunnel is active.');
    } else if (error.message?.includes('Network Error') || error.message?.includes('CORS')) {
      console.error('🔌 API Client: CORS ERROR DETECTED! Your backend server needs configuration changes:');
      console.error('1. Update your server to allow requests from: ' + window.location.origin);
      console.error('2. Current allowed origin may be limited to: http://localhost:8080');
      console.error(`3. Add this to your server: res.header("Access-Control-Allow-Origin", "${window.location.origin}")`);
    } else if (error.response?.status === 0 || !error.response) {
      console.error('🔌 API Client: No response from server. CORS issue or server is down.');
    } else {
      console.error(`🔌 API Client: Error ${error.response?.status} from ${error.config?.url}:`, error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

// Define types for the API responses
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  [key: string]: any;
}

// Provide CORS debugging info for the developer
console.info(`🔌 API Client: Your frontend origin is: ${window.location.origin}`);
console.info('🔌 API Client: Backend server must include this header: Access-Control-Allow-Origin: ' + window.location.origin);

export default apiClient;
