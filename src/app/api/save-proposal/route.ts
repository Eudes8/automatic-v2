/**
 * POST /api/save-proposal
 * Create a new proposal with comprehensive validation
 *
 * Request body:
 * {
 *   projectName: string (required, 3-255 chars)
 *   description: string (required, 10+ chars)
 *   email: string (required, valid email)
 *   company?: string (0-255 chars)
 *   phone?: string (0-20 chars)
 *   projectType?: string (default: 'unknown')
 *   timeline?: string (0-100 chars)
 *   features?: string[] (max 100 items)
 *   price?: number (default: 0, must be >= 0)
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { logger } from '@/lib/api-logger'
import {
  isValidEmail,
  isValidPositiveInt,
  sanitizeString,
  sanitizeStringArray,
  createValidationError,
  createSuccessResponse,
  createErrorResponse,
  ValidationError
} from '@/lib/api-validation'

const ROUTE = '/api/save-proposal'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    logger.debug(ROUTE, 'Processing new proposal request')

    // Parse request body
    let proposalData
    try {
      proposalData = await request.json()
    } catch {
      const errors = [createValidationError('body', 'Invalid JSON body')]
      logger.warn(ROUTE, 'Invalid JSON body')
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const errors: ValidationError[] = []

    // Sanitize and validate inputs
    const projectName = sanitizeString(proposalData.projectName, 255)
    const description = sanitizeString(proposalData.description, 5000)
    const email = sanitizeString(proposalData.email, 255)
    const company = sanitizeString(proposalData.company || '', 255)
    const phone = sanitizeString(proposalData.phone || '', 20)
    const projectType = sanitizeString(proposalData.projectType || 'unknown', 50)
    const timeline = sanitizeString(proposalData.timeline || '', 100)
    const features = sanitizeStringArray(proposalData.features || [])

    // Validate projectName
    if (!projectName || projectName.length < 3) {
      errors.push(createValidationError('projectName', 'Project name required (min 3 characters)'))
    }

    // Validate description
    if (!description || description.length < 10) {
      errors.push(createValidationError('description', 'Description too short (min 10 characters)'))
    }

    // Validate email
    if (!email || !isValidEmail(email)) {
      errors.push(createValidationError('email', 'Invalid email address'))
    }

    // Validate price
    const price = Number(proposalData.price ?? 0)
    if (!isValidPositiveInt(price)) {
      errors.push(createValidationError('price', 'Price must be a positive number'))
    }

    if (errors.length > 0) {
      logger.warn(ROUTE, 'Validation failed', { errorCount: errors.length })
      return NextResponse.json(createErrorResponse(errors), { status: 400 })
    }

    // Create proposal with 30-day validity
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    const created = await prisma.proposal.create({
      data: {
        projectName,
        company,
        email,
        phone,
        description,
        projectType,
        price: Math.round(price),
        timeline,
        features,
        onboardingStep: 0,
        status: 'pending',
        validUntil
      }
    })

    const duration = Date.now() - startTime
    logger.info(ROUTE, 'Proposal created successfully', {
      proposalId: created.id,
      email,
      duration
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Proposition sauvegardée avec succès',
        proposalId: created.id,
        proposal: created
      },
      { status: 201 }
    )
  } catch (error) {
    const duration = Date.now() - startTime
    logger.error(ROUTE, 'Failed to create proposal', error as Error, { duration })
    return NextResponse.json(
      createErrorResponse([createValidationError('server', 'Internal server error')]),
      { status: 500 }
    )
  }
}