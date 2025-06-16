
import axios from 'axios';
import apiClient, { ApiResponse } from './apiClient';
import { Assets, Income, ClientInfo } from './types';

// Debug flag - only enabled in development
const DEBUG = import.meta.env.DEV;

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
      log("Current API base URL:", apiClient.defaults.baseURL);
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

      // Enhanced API connectivity test with more detailed error information
      log("Testing API connectivity before sending request...");
      
      try {
        // First try a simple fetch to the base URL
        const baseUrlTest = await fetch(`${apiClient.defaults.baseURL}`, { 
          method: 'HEAD',
          mode: 'cors'
        });
        log(`Base URL test: ${baseUrlTest.ok ? 'Success' : 'Failed'} (Status: ${baseUrlTest.status})`);
      } catch (baseError: any) {
        log("❌ Base URL test failed:", baseError.message);
        
        // Try the health endpoint
        try {
          const healthResponse = await fetch(`${apiClient.defaults.baseURL}/api/health`, { 
            method: 'HEAD',
            mode: 'cors'
          });
          log(`Health endpoint test: ${healthResponse.ok ? 'Success' : 'Failed'} (Status: ${healthResponse.status})`);
        } catch (healthError: any) {
          log("❌ Health endpoint test failed:", healthError.message);
          
          if (healthError.toString().includes('CORS') || healthError.message.includes('CORS')) {
            log("❌ CORS ERROR DETECTED:");
            log("This indicates that the backend server may be running but needs CORS configuration:");
            log("1. Frontend origin: " + window.location.origin);
            log("2. The server needs Access-Control-Allow-Origin header");
            log("3. The server needs Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            log("4. The server needs Access-Control-Allow-Headers: Content-Type, Authorization");
          } else if (healthError.message.includes('Failed to fetch')) {
            log("❌ NETWORK/SERVER ERROR DETECTED:");
            log("This suggests the API server is unreachable:");
            log("1. Check if the backend server is running");
            log("2. Verify the API URL is correct: " + apiClient.defaults.baseURL);
            log("3. Check if there are any network connectivity issues");
            log("4. If using a hosting service, verify the deployment is active");
          }
          
          // For development, provide a mock response so the UI can be tested
          if (DEBUG) {
            log("🔧 Development mode: Returning mock eligibility response for testing");
            return {
              status: 'success',
              data: {
                isResourceEligible: false,
                isIncomeEligible: true,
                resourceAmount: 197000,
                incomeAmount: 3600,
                resourceLimit: 2000,
                incomeLimit: 4000,
                excessResources: 195000,
                strategies: [
                  'Consider spending down excess resources on exempt assets',
                  'Explore Medicaid planning strategies like asset protection trusts',
                  'Consult with an elder law attorney for personalized advice'
                ],
                reasoning: 'Mock response for development testing - API server unreachable'
              }
            } as ApiResponse<any>;
          }
          
          throw new Error("API server is unreachable. Please check if the backend server is running and accessible.");
        }
      }
      
      log("Sending API request to: /api/eligibility/assess");
      const response = await apiClient.post('/api/eligibility/assess', data);
      log("✅ API Response received:", response.data);
      log("✅ Response status:", response.status);
      log("✅ Response data type:", typeof response.data);
      log("✅ Response data keys:", response.data ? Object.keys(response.data) : 'null');
      log("✅ Full response.data structure:", JSON.stringify(response.data, null, 2));
      
      // The backend returns { status: 'success', data: {...} }
      // We need to return the whole response object for the usePlanningActions hook
      return response.data as ApiResponse<any>;
    } catch (error) {
      log("❌ Error in eligibility assessment API call:", error);
      if (axios.isAxiosError(error)) {
        const errorDetails = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          message: error.message
        };
        
        log("Axios Error details:", errorDetails);

        // Enhanced error categorization
        if (!error.response) {
          if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
            log("❌ NETWORK/CONNECTION ERROR:");
            log("Frontend origin: " + window.location.origin);
            log("API URL: " + apiClient.defaults.baseURL);
            log("Possible causes:");
            log("1. Backend server is not running");
            log("2. Incorrect API URL");
            log("3. Network connectivity issues");
            log("4. Server deployment issues");
          } else if (error.message?.includes('CORS')) {
            log("❌ CORS ERROR:");
            log("Frontend origin: " + window.location.origin);
            log("Backend needs CORS headers:");
            log("Access-Control-Allow-Origin: " + window.location.origin);
            log("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            log("Access-Control-Allow-Headers: Content-Type, Authorization");
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
