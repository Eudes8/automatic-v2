'use client'

import { OnboardingProvider } from '@/components/onboarding-provider'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OnboardingProvider>
      {children}
    </OnboardingProvider>
  )
}
