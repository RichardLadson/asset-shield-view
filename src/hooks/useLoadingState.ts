import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
  progress: number | null;
}

export const useLoadingState = () => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    loadingMessage: '',
    progress: null,
  });

  const setLoading = useCallback((isLoading: boolean, message: string = '', progress: number | null = null) => {
    setState({ isLoading, loadingMessage: message, progress });
  }, []);

  const resetLoading = useCallback(() => {
    setState({ isLoading: false, loadingMessage: '', progress: null });
  }, []);

  return {
    ...state,
    setLoading,
    resetLoading,
  };
};