import { useEffect, useCallback } from 'react';
import { MedicaidFormData } from '../types/medicaidForm';

const STORAGE_KEY = 'medicaid-form-draft';
const STORAGE_VERSION = '1.0';
const AUTOSAVE_DELAY = 30000; // 30 seconds

interface PersistedFormData {
  version: string;
  timestamp: number;
  formData: Partial<MedicaidFormData>;
  isComplete: boolean;
}

interface UseFormPersistenceReturn {
  saveDraft: (formData: Partial<MedicaidFormData>) => void;
  loadDraft: () => Partial<MedicaidFormData> | null;
  clearDraft: () => void;
  hasDraft: () => boolean;
  getDraftAge: () => number | null; // Returns age in hours
}

export const useFormPersistence = (): UseFormPersistenceReturn => {
  
  const saveDraft = useCallback((formData: Partial<MedicaidFormData>) => {
    try {
      // Don't save if form is essentially empty
      if (!formData.applicantName && !formData.applicantBirthDate && !formData.maritalStatus) {
        return;
      }

      const dataToSave: PersistedFormData = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        formData,
        isComplete: false
      };

      // Encrypt sensitive data (basic encoding)
      const encodedData = btoa(JSON.stringify(dataToSave));
      localStorage.setItem(STORAGE_KEY, encodedData);
      
      if (import.meta.env.DEV) {
        console.log('💾 Form draft saved automatically');
      }
    } catch (error) {
      console.error('Failed to save form draft:', error);
    }
  }, []);

  const loadDraft = useCallback((): Partial<MedicaidFormData> | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      // Decode the data
      const decodedData = JSON.parse(atob(saved)) as PersistedFormData;
      
      // Check version compatibility
      if (decodedData.version !== STORAGE_VERSION) {
        console.warn('Form draft version mismatch, clearing old draft');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      // Check if draft is not too old (7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (Date.now() - decodedData.timestamp > maxAge) {
        console.warn('Form draft is too old, clearing');
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      if (import.meta.env.DEV) {
        const age = Math.round((Date.now() - decodedData.timestamp) / (1000 * 60 * 60));
        console.log(`📋 Loaded form draft from ${age} hours ago`);
      }

      return decodedData.formData;
    } catch (error) {
      console.error('Failed to load form draft:', error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    if (import.meta.env.DEV) {
      console.log('🗑️ Form draft cleared');
    }
  }, []);

  const hasDraft = useCallback((): boolean => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }, []);

  const getDraftAge = useCallback((): number | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const decodedData = JSON.parse(atob(saved)) as PersistedFormData;
      return Math.round((Date.now() - decodedData.timestamp) / (1000 * 60 * 60)); // hours
    } catch {
      return null;
    }
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
    getDraftAge
  };
};

// Auto-save hook that works with any form state
export const useAutoSave = (
  formData: Partial<MedicaidFormData>,
  enabled: boolean = true
) => {
  const { saveDraft } = useFormPersistence();

  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      saveDraft(formData);
    }, AUTOSAVE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [formData, saveDraft, enabled]);
};