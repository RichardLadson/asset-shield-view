
import axios from 'axios';

// Get the API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define types for the API responses
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  [key: string]: any;
}

export default apiClient;
