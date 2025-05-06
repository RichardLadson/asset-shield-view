
// Re-export all API services from a single entry point
import { ApiResponse } from './apiClient';
import eligibilityApi from './eligibilityApi';
import planningApi from './planningApi';
import reportApi from './reportApi';

// Export all types from types.ts
export * from './types';
export { ApiResponse };

// Export all API services
export const api = {
  eligibility: eligibilityApi,
  planning: planningApi,
  report: reportApi,
};

export default api;
