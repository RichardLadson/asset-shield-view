
import axios from 'axios';
import apiClient, { ApiResponse } from './apiClient';
import { Assets, Income, ClientInfo } from './types';

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
      console.log("Sending eligibility assessment data to API:", JSON.stringify(data, null, 2));
      
      // Verify that required fields are present
      if (!data.clientInfo?.name || !data.clientInfo?.age || !data.clientInfo?.maritalStatus) {
        console.error("Missing required clientInfo fields:", {
          name: !!data.clientInfo?.name,
          age: !!data.clientInfo?.age, 
          maritalStatus: !!data.clientInfo?.maritalStatus
        });
        throw new Error("Missing required client information fields");
      }

      if (!data.state) {
        console.error("Missing required state field");
        throw new Error("Missing required state field");
      }
      
      // Convert age to number if it's a string
      if (data.clientInfo && typeof data.clientInfo.age === 'string') {
        data.clientInfo.age = Number(data.clientInfo.age);
      }
      
      const response = await apiClient.post('/api/eligibility/assess', data);
      console.log("API Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in eligibility assessment API call:", error);
      if (axios.isAxiosError(error)) {
        console.error("API Error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
        if (error.response) {
          return error.response.data as ApiResponse<any>;
        }
      }
      throw error;
    }
  },

  getStateMedicaidRules: async (state: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/api/eligibility/rules/${state}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },
};

export default eligibilityApi;
