import { useState, useCallback } from 'react';

export interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ProgressState {
  steps: ProgressStep[];
  currentStep: number;
  progress: number;
  message: string;
}

export const useProgressTracking = (initialSteps: Omit<ProgressStep, 'status'>[]) => {
  const [state, setState] = useState<ProgressState>({
    steps: initialSteps.map((step, index) => ({
      ...step,
      status: index === 0 ? 'active' : 'pending'
    })),
    currentStep: 0,
    progress: 0,
    message: initialSteps[0]?.label || ''
  });

  const updateStep = useCallback((stepId: string, status: ProgressStep['status']) => {
    setState(prev => {
      const steps = prev.steps.map(step => 
        step.id === stepId ? { ...step, status } : step
      );
      
      const completedSteps = steps.filter(s => s.status === 'completed').length;
      const progress = (completedSteps / steps.length) * 100;
      
      return { ...prev, steps, progress };
    });
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => {
      if (prev.currentStep >= prev.steps.length - 1) return prev;
      
      const steps = [...prev.steps];
      steps[prev.currentStep].status = 'completed';
      
      const nextIndex = prev.currentStep + 1;
      if (nextIndex < steps.length) {
        steps[nextIndex].status = 'active';
      }
      
      const completedSteps = steps.filter(s => s.status === 'completed').length;
      const progress = (completedSteps / steps.length) * 100;
      
      return {
        steps,
        currentStep: nextIndex,
        progress,
        message: steps[nextIndex]?.label || ''
      };
    });
  }, []);

  const setError = useCallback((errorMessage: string) => {
    setState(prev => {
      const steps = [...prev.steps];
      if (prev.currentStep < steps.length) {
        steps[prev.currentStep].status = 'error';
      }
      
      return {
        ...prev,
        steps,
        message: errorMessage
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      steps: initialSteps.map((step, index) => ({
        ...step,
        status: index === 0 ? 'active' : 'pending'
      })),
      currentStep: 0,
      progress: 0,
      message: initialSteps[0]?.label || ''
    });
  }, [initialSteps]);

  return {
    ...state,
    updateStep,
    nextStep,
    setError,
    reset
  };
};