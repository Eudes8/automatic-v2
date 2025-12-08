/**
 * PATCH /api/proposals/[id]/onboarding
 * Update the onboarding step for a proposal
 * 
 * Request body: { step: number }
 * Response: { success: boolean, data?: { id, onboardingStep, status }, errors?: [...] }
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { isValidOnboardingStep, createSuccessResponse, createErrorResponse, createValidationError } from '@/lib/api-validation'
import { logger } from '@/lib/api-logger'

const ROUTE = '/api/proposals/[id]/onboarding'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proposalId } = await params
  const startTime = Date.now()

  try {
    logger.debug(ROUTE, 'Updating onboarding step', { proposalId })

    // Parse request body
    let body
    try {
      body = await request.json()
    } catch {
      const errors = [createValidationError('body', 'Invalid JSON body')]
      logger.warn(ROUTE, 'Invalid JSON body', { proposalId })
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { step } = body

    // Validate step parameter
    if (step === undefined || step === null) {
      const errors = [createValidationError('step', 'Step is required')]
      logger.warn(ROUTE, 'Missing step parameter', { proposalId, body })
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    if (!isValidOnboardingStep(step)) {
      const errors = [createValidationError('step', 'Step must be an integer between 0 and 6')]
      logger.warn(ROUTE, 'Invalid step value', { proposalId, step })
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    // Fetch proposal to verify it exists
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { id: true, email: true, status: true, onboardingStep: true }
    })

    if (!proposal) {
      const errors = [createValidationError('id', 'Proposal not found')]
      logger.warn(ROUTE, 'Proposal not found', { proposalId })
      return NextResponse.json({ success: false, errors }, { status: 404 })
    }

    // Ensure step progression is forward-only (optional: can allow backtracking if needed)
    if (step < proposal.onboardingStep) {
      logger.debug(ROUTE, 'Allowing backtracking in onboarding steps', {
        proposalId,
        currentStep: proposal.onboardingStep,
        newStep: step
      })
    }

    // Update proposal onboarding step
    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: { onboardingStep: step },
      select: { id: true, onboardingStep: true, status: true, email: true }
    })

    const duration = Date.now() - startTime
    logger.info(ROUTE, 'Onboarding step updated successfully', {
      proposalId,
      newStep: step,
      duration
    })

    return NextResponse.json(
      createSuccessResponse({
        id: updated.id,
        onboardingStep: updated.onboardingStep,
        status: updated.status,
        email: updated.email
      }),
      { status: 200 }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error(ROUTE, 'Failed to update onboarding step', error as Error, {
      proposalId,
      duration
    })
    return NextResponse.json(
      { success: false, errors: [{ field: 'server', message: 'Internal server error' }] },
      { status: 500 }
    )
  }
}
