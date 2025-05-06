
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
