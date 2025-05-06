
import axios from 'axios';
import apiClient, { ApiResponse } from './apiClient';
import { 
  ClientInfo, 
  Assets, 
  Income, 
  Expenses, 
  MedicalInfo, 
  LivingInfo 
} from './types';

// Planning API endpoints
export const planningApi = {
  comprehensivePlanning: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    income: Income;
    expenses?: Expenses;
    medicalInfo?: MedicalInfo;
    livingInfo?: LivingInfo;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/comprehensive', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  assetPlanning: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    income?: Income;
    expenses?: Expenses;
    homeInfo?: any;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/asset', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  incomePlanning: async (data: {
    clientInfo: ClientInfo;
    income: Income;
    expenses?: Expenses;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/income', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  trustPlanning: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    income: Income;
    eligibilityResults: any;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/trust', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  annuityPlanning: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    income?: Income;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/annuity', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  divestmentPlanning: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    pastTransfers?: any[];
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/divestment', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  carePlanning: async (data: {
    clientInfo: ClientInfo;
    medicalInfo: MedicalInfo;
    livingInfo: LivingInfo;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/care', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  communitySpousePlanning: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    income?: Income;
    expenses?: Expenses;
    state: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/community-spouse', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },

  postEligibilityPlanning: async (data: {
    clientInfo: ClientInfo;
    assets: Assets;
    income: Income;
    state: string;
    maritalStatus?: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await apiClient.post('/api/planning/post-eligibility', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data as ApiResponse<any>;
      }
      throw error;
    }
  },
};

export default planningApi;
