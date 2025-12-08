import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { proposalId } = await request.json()
    
    // Validation des données
    if (!proposalId) {
      return NextResponse.json(
        { error: 'ID de proposition manquant' },
        { status: 400 }
      )
    }

    // Créer un contrat lié à la proposition
    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } })
    if (!proposal) return NextResponse.json({ error: 'Proposition non trouvée' }, { status: 404 })

    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const created = await prisma.contract.create({
      data: {
        proposalId: proposal.id,
        title: 'Contrat de Développement Logiciel',
        clientInfo: {
          company: proposal.company,
          contact: proposal.company,
          email: proposal.email,
          phone: proposal.phone,
          address: ''
        },
        projectInfo: {
          name: proposal.projectName,
          description: proposal.description,
          price: proposal.price,
          timeline: proposal.timeline,
          features: proposal.features
        },
        terms: {
          paymentSchedule: ['30% à la signature du contrat', '40% à mi-projet', '30% à la livraison finale'],
          deliverables: [],
          responsibilities: []
        },
        validUntil
      }
    })

    return NextResponse.json({ success: true, message: 'Contrat généré avec succès', contract: created })
    
  } catch (error) {
    console.error('Erreur lors de la génération du contrat:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du contrat' },
      { status: 500 }
    )
  }
}