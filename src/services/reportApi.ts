
import axios from 'axios';
import apiClient, { ApiResponse } from './apiClient';
import { ClientInfo } from './types';

// Report API endpoints
export const reportApi = {
  generateReport: async (data: {
    planningResults: any;
    clientInfo: ClientInfo;
    reportType?: 'summary' | 'detailed' | 'professional' | 'client-friendly';
    outputFormat?: 'markdown' | 'plain' | 'html';
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/reports/generate', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  downloadReport: async (reportId: string): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.get(`/api/reports/download/${reportId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },
};

export default reportApi;
