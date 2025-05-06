
import axios from 'axios';
import apiClient, { ApiResponse } from './apiClient';
import { Assets, Income } from './types';

// Eligibility API endpoints
export const eligibilityApi = {
  assessEligibility: async (data: {
    assets: Assets;
    income: Income;
    maritalStatus: string;
    state: string;
    age: number;
    healthStatus?: string;
    isCrisis?: boolean;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/eligibility/assess', data);
      return response.data;
    } catch (error) {
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
