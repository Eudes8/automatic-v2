/**
 * Prisma Seed Script
 * Creates test data for development and testing
 * 
 * Run with: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clean up existing test data
  await prisma.contract.deleteMany()
  await prisma.proposal.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.contact.deleteMany()

  console.log('✓ Cleaned up existing data')

  // Create a test proposal
  const testProposal = await prisma.proposal.create({
    data: {
      projectName: 'E-commerce Platform Migration',
      company: 'TechCorp Inc.',
      email: 'contact@techcorp.example.com',
      phone: '+33 1 23 45 67 89',
      description:
        'Complete migration of legacy e-commerce platform to modern cloud-based architecture with improved UX and performance',
      projectType: 'web-development',
      price: 75000, // 750€ (in cents for DB)
      timeline: '3-4 mois',
      features: [
        'Migration de base de données PostgreSQL',
        'Refonte frontend (React + Next.js)',
        'API REST modernisée',
        'Tests automatisés (unit + E2E)',
        'Documentation technique complète',
        'Formation équipe client'
      ],
      onboardingStep: 0,
      status: 'pending',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })

  console.log(`✓ Created test proposal: ${testProposal.id}`)

  // Create a test contract
  const testContract = await prisma.contract.create({
    data: {
      proposalId: testProposal.id,
      title: 'Contrat de Prestation - Migration E-commerce',
      clientInfo: {
        company: 'TechCorp Inc.',
        contact: 'Jean Dupont',
        email: 'contact@techcorp.example.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de la Tech, 75001 Paris, France'
      },
      projectInfo: {
        name: 'E-commerce Platform Migration',
        description:
          'Complete migration of legacy e-commerce platform to modern cloud-based architecture with improved UX and performance',
        price: 75000,
        timeline: '3-4 mois',
        features: [
          'Migration de base de données PostgreSQL',
          'Refonte frontend (React + Next.js)',
          'API REST modernisée',
          'Tests automatisés (unit + E2E)',
          'Documentation technique complète',
          'Formation équipe client'
        ],
        vatRate: 0.2
      },
      terms: {
        deliverables: [
          'Architecture documentation',
          'Codebase migré et testé',
          'CI/CD pipeline configuré',
          'Documentation utilisateur',
          'Formation équipe (2 jours)'
        ],
        paymentSchedule: [
          '30% (22,500€) à la signature',
          '40% (30,000€) à mi-parcours (fin mois 2)',
          '30% (22,500€) à livraison complète'
        ],
        responsibilities: [
          'Fournir accès à tous les systèmes legacy',
          'Désigner un point de contact technique',
          'Participer aux réunions de suivi hebdomadaires',
          'Valider les livrables intermédiaires'
        ]
      },
      status: 'generated',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  })

  console.log(`✓ Created test contract: ${testContract.id}`)

  // Create test payments
  const payment1 = await prisma.payment.create({
    data: {
      proposalId: testProposal.id,
      amount: 22500, // 225€
      currency: 'EUR',
      description: 'Acompte signature contrat (30%)',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      method: 'virement',
      status: 'pending'
    }
  })

  console.log(`✓ Created test payment 1: ${payment1.id}`)

  const payment2 = await prisma.payment.create({
    data: {
      proposalId: testProposal.id,
      amount: 30000, // 300€
      currency: 'EUR',
      description: 'Paiement étape 2 - mi-parcours (40%)',
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      method: 'virement',
      status: 'pending'
    }
  })

  console.log(`✓ Created test payment 2: ${payment2.id}`)

  // Create test conversation
  const conversation = await prisma.conversation.create({
    data: {
      title: 'Discussion Migration E-commerce',
      type: 'technical',
      messages: {
        create: [
          {
            content: 'Bonjour, avez-vous des questions sur le scope du projet ?',
            senderName: 'AUTOMATIC Support',
            senderId: 'auto-support',
            timestamp: new Date()
          },
          {
            content:
              'Oui, concernant la migration DB. Pouvez-vous préciser la période de downtime acceptée ?',
            senderName: 'Jean Dupont',
            senderId: 'techcorp-1',
            timestamp: new Date(Date.now() + 3600000)
          }
        ]
      }
    }
  })

  console.log(`✓ Created test conversation: ${conversation.id}`)

  // Create test contact submission
  const contact = await prisma.contact.create({
    data: {
      name: 'Pierre Martin',
      email: 'pierre@example.com',
      phone: '+33 2 34 56 78 90',
      company: 'StartupXYZ',
      subject: 'Demande de devis - Refonte mobile',
      message:
        'Nous cherchons un partenaire pour refondre notre application mobile. Pouvez-vous nous envoyer un devis estimé ?'
    }
  })

  console.log(`✓ Created test contact: ${contact.id}`)

  console.log('✅ Seed completed successfully!')
  console.log('')
  console.log('📋 Test Proposal ID:', testProposal.id)
  console.log('📄 Test Contract ID:', testContract.id)
  console.log('')
  console.log('Quick test URLs:')
  console.log(`  - Create proposal: POST http://localhost:3000/api/save-proposal`)
  console.log(`  - Get proposal: GET http://localhost:3000/api/proposals/${testProposal.id}`)
  console.log(`  - Get contract: GET http://localhost:3000/api/contracts/${testContract.id}`)
  console.log(`  - Download PDF: GET http://localhost:3000/api/contracts/${testContract.id}/pdf`)
  console.log(`  - Update onboarding step: PATCH http://localhost:3000/api/proposals/${testProposal.id}/onboarding`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
