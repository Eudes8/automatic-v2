/**
 * GET /api/proposals/[id]
 * Fetch a proposal by ID (with onboarding state)
 * 
 * Response: { id, projectName, email, status, onboardingStep, validUntil, createdAt, ... }
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/api-logger'

const ROUTE = '/api/proposals/[id]'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: proposalId } = await params
  const startTime = Date.now()

  try {
    logger.debug(ROUTE, 'Fetching proposal', { proposalId })

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: {
        id: true,
        projectName: true,
        company: true,
        email: true,
        phone: true,
        description: true,
        projectType: true,
        price: true,
        timeline: true,
        features: true,
        onboardingStep: true,
        status: true,
        createdAt: true,
        validUntil: true,
        updatedAt: true
      }
    })

    if (!proposal) {
      logger.warn(ROUTE, 'Proposal not found', { proposalId })
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      )
    }

    const duration = Date.now() - startTime
    logger.info(ROUTE, 'Proposal fetched successfully', { proposalId, duration })

    return NextResponse.json(proposal, { status: 200 })
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error(ROUTE, 'Failed to fetch proposal', error as Error, {
      proposalId,
      duration
    })
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
