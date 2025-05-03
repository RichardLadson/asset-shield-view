// src/services/api.ts
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

// Define interfaces for common data structures
export interface ClientInfo {
  name: string;
  age: number;
  maritalStatus: string;
  healthStatus?: string;
  [key: string]: any;
}

export interface Assets {
  [key: string]: any;
}

export interface Income {
  [key: string]: any;
}

export interface Expenses {
  [key: string]: any;
}

export interface MedicalInfo {
  [key: string]: any;
}

export interface LivingInfo {
  [key: string]: any;
}

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

// Export all API services
export const api = {
  eligibility: eligibilityApi,
  planning: planningApi,
  report: reportApi,
};

export default api;