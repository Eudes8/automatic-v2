/**
 * OnboardingProvider Component
 * Wraps onboarding pages and manages step persistence
 * 
 * Usage:
 * <OnboardingProvider proposalId={id} initialStep={1}>
 *   <YourPage />
 * </OnboardingProvider>
 */

'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useOnboardingStep } from '@/hooks/use-onboarding-step'

interface OnboardingContextType {
  currentStep: number
  loading: boolean
  error: string | null
  isSaving: boolean
  updateStep: (step: number) => void
  forceSave: () => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

interface OnboardingProviderProps {
  children: ReactNode
  proposalId?: string
  initialStep?: number
}

export function OnboardingProvider({ children, proposalId = '', initialStep = 0 }: OnboardingProviderProps) {
  const {
    currentStep,
    loading,
    error,
    isSaving,
    updateStep,
    forceSave
  } = useOnboardingStep({
    proposalId,
    initialStep,
    debounceMs: 500,
    autoSave: true
  })

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        loading,
        error,
        isSaving,
        updateStep,
        forceSave
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

/**
 * Hook to use onboarding context
 */
export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
