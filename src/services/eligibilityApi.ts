
import axios from 'axios';
import apiClient, { ApiResponse } from './apiClient';
import { Assets, Income, ClientInfo } from './types';

// Debug flag - set to true for detailed logging
const DEBUG = true;

// Helper function to safely stringify objects for logging
const safeStringify = (obj: any) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return `[Object could not be stringified: ${e}]`;
  }
};

// Diagnostic logger that won't break anything if console is undefined
const log = (message: string, data?: any) => {
  if (DEBUG && typeof console !== 'undefined') {
    if (data) {
      console.log(`🔍 ELIGIBILITY API: ${message}`, data);
    } else {
      console.log(`🔍 ELIGIBILITY API: ${message}`);
    }
  }
};

// Eligibility API endpoints
export const eligibilityApi = {
  assessEligibility: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    income: Income;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      // Log the full payload being sent to API for debugging
      log("Preparing eligibility assessment request");
      log("Client info data:", data.clientInfo);
      log("State:", data.state);
      log("Assets data:", data.assets);
      log("Income data:", data.income);
      log("Full payload:", data);
      
      // Verify that required fields are present
      if (!data.clientInfo?.name || !data.clientInfo?.age || !data.clientInfo?.maritalStatus) {
        const missingFields = {
          name: !!data.clientInfo?.name,
          age: !!data.clientInfo?.age, 
          maritalStatus: !!data.clientInfo?.maritalStatus
        };
        
        log("❌ Missing required clientInfo fields:", missingFields);
        throw new Error(`Missing required client information fields: ${Object.keys(missingFields).filter(k => !missingFields[k as keyof typeof missingFields]).join(", ")}`);
      }

      if (!data.state) {
        log("❌ Missing required state field");
        throw new Error("Missing required state field");
      }
      
      // Convert age to number if it's a string
      if (data.clientInfo && typeof data.clientInfo.age === 'string') {
        log("Converting age from string to number:", data.clientInfo.age);
        data.clientInfo.age = Number(data.clientInfo.age);
      }

      // Network connection test before making the actual request
      log("Testing API connectivity before sending request...");
      
      try {
        // Use no-cors mode for the test to see if server is up, even if CORS blocks the response
        const testResponse = await fetch(`${apiClient.defaults.baseURL}/api/health`, { 
          method: 'HEAD',
          mode: 'cors', // Try with CORS first for diagnostic purposes
          headers: {
            'Content-Type': 'application/json'
          }
        });
        log(`API connectivity test: ${testResponse.ok ? 'Success' : 'Failed'} (Status: ${testResponse.status})`);
      } catch (error: any) {
        // Check if this is likely a CORS issue
        if (error.toString().includes('CORS')) {
          log("❌ CORS ERROR DETECTED in API connectivity test:", error);
          log("This indicates that your backend server is likely running but needs configuration changes:");
          log("1. Frontend origin: " + window.location.origin);
          log("2. The server needs to include this header: Access-Control-Allow-Origin: " + window.location.origin);
          log("3. If you control the backend, add the above header to ALL responses");
          log("4. If using Express.js, install cors middleware: npm install cors");
          log("5. And add to your server: app.use(cors({origin: '" + window.location.origin + "'}))");
        } else {
          log("❌ API connectivity test failed:", error);
          log("This suggests the API server is unreachable. Check the following:");
          log("1. Is the backend server running?");
          log("2. Is the API URL correct in apiClient.ts?");
          log("3. If using ngrok, has the URL expired or changed?");
          log("4. Are there CORS headers configured on the backend?");
        }
        throw new Error("API server is unreachable. Check console for troubleshooting steps.");
      }
      
      log("Sending API request to: /api/eligibility/assess");
      const response = await apiClient.post('/api/eligibility/assess', data);
      log("✅ API Response received:", response.data);
      return response.data;
    } catch (error) {
      log("❌ Error in eligibility assessment API call:", error);
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        };
        
        log("API Error details:", errorDetails);

        // CORS or network related errors
        if (!error.response) {
          if (error.message?.includes('Network Error') || error.message?.includes('CORS')) {
            log("This appears to be a CORS issue.");
            log("Frontend origin: " + window.location.origin);
            log("Backend server needs to set: Access-Control-Allow-Origin: " + window.location.origin);
            log("If using Express.js: app.use(cors({origin: '" + window.location.origin + "'}))");
          } else {
            log("This appears to be a network error.");
            log("1. Check that your backend server is running");
            log("2. Ensure CORS is properly configured on the backend");
            log("3. If using ngrok, verify the URL is current (they expire after a few hours on free tier)");
            log("4. Current API URL:", apiClient.defaults.baseURL);
          }
        }
        
        if (error.response) {
          return error.response.data as ApiResponse<any>;
        }
      }
      throw error;
    }
  },

  getStateMedicaidRules: async (state: string): Promise<ApiResponse<any>> => {
    try {
      log(`Fetching Medicaid rules for state: ${state}`);
      const response = await apiClient.get(`/api/eligibility/rules/${state}`);
      log("✅ State rules received:", response.data);
      return response.data;
    } catch (error) {
      log("❌ Error fetching state rules:", error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },
};

export default eligibilityApi;
