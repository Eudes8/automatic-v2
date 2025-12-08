/**
 * useOnboardingStep Hook
 * Manages onboarding step persistence and auto-save
 * 
 * Features:
 * - Auto-save step to server on change (debounced)
 * - Restore step on component mount
 * - Handle offline scenarios gracefully
 * - Provide loading and error states
 */

'use client'

import { useCallback, useEffect, useState, useRef } from 'react'

interface UseOnboardingStepOptions {
  proposalId: string
  initialStep?: number
  debounceMs?: number
  autoSave?: boolean
}

interface OnboardingState {
  currentStep: number
  loading: boolean
  error: string | null
  isSaving: boolean
}

export function useOnboardingStep({
  proposalId,
  initialStep = 0,
  debounceMs = 500,
  autoSave = true
}: UseOnboardingStepOptions) {
  const [state, setState] = useState<OnboardingState>({
    currentStep: initialStep,
    loading: false,
    error: null,
    isSaving: false
  })

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef(true)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  /**
   * Save step to server
   */
  const saveStep = useCallback(
    async (step: number) => {
      if (!autoSave) return

      setState((prev) => ({ ...prev, isSaving: true }))

      try {
        const response = await fetch(`/api/proposals/${proposalId}/onboarding`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step })
        })

        if (!response.ok) {
          const data = await response.json()
          const errorMsg = data.errors?.[0]?.message || 'Failed to save step'
          if (isMountedRef.current) {
            setState((prev) => ({ ...prev, error: errorMsg, isSaving: false }))
          }
          return
        }

        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, error: null, isSaving: false }))
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Network error'
        console.error('Error saving onboarding step:', err)
        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, error: errorMsg, isSaving: false }))
        }
      }
    },
    [proposalId, autoSave]
  )

  /**
   * Update step with debounced auto-save
   */
  const updateStep = useCallback(
    (step: number) => {
      if (step < 0 || step > 6) {
        console.warn(`Invalid onboarding step: ${step}`)
        return
      }

      setState((prev) => ({ ...prev, currentStep: step, error: null }))

      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Set new debounced save
      debounceTimerRef.current = setTimeout(() => {
        saveStep(step)
      }, debounceMs)
    },
    [saveStep, debounceMs]
  )

  /**
   * Force immediate save (e.g., before navigation)
   */
  const forceSave = useCallback(async () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    await saveStep(state.currentStep)
  }, [state.currentStep, saveStep])

  /**
   * Fetch current step from server on mount
   */
  useEffect(() => {
    ;(async () => {
      setState((prev) => ({ ...prev, loading: true }))
      try {
        const response = await fetch(`/api/proposals/${proposalId}`)
        if (response.ok) {
          const data = await response.json()
          if (isMountedRef.current && typeof data.onboardingStep === 'number') {
            setState((prev) => ({
              ...prev,
              currentStep: data.onboardingStep,
              loading: false,
              error: null
            }))
          }
        }
      } catch (err) {
        console.warn('Failed to fetch initial onboarding step:', err)
        if (isMountedRef.current) {
          setState((prev) => ({ ...prev, loading: false }))
        }
      }
    })()
  }, [proposalId])

  return {
    ...state,
    updateStep,
    forceSave
  }
}
