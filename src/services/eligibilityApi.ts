
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
      // Log the payload being sent to API for debugging
      console.log("Sending eligibility assessment data to API:", data);
      
      const response = await apiClient.post('/api/eligibility/assess', data);
      return response.data;
    } catch (error) {
      console.error("Error in eligibility assessment API call:", error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
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
