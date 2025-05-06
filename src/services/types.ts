
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
