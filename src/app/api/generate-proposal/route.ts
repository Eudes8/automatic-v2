import { NextRequest, NextResponse } from 'next/server'
import jsPDF from 'jspdf'

export async function POST(request: NextRequest) {
  try {
    const projectData = await request.json()
    
    // Validation des données
    if (!projectData.projectName || !projectData.email || !projectData.description) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      )
    }

    // Génération du PDF de la proposition
    const pdfBuffer = generateProposalPDF(projectData)
    
    // Convertir en base64
    const base64Content = pdfBuffer.toString('base64')
    
    return NextResponse.json({
      success: true,
      proposal: {
        filename: `proposition-${projectData.projectName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
        content: base64Content,
        mimeType: 'application/pdf'
      }
    })
    
  } catch (error) {
    console.error('Erreur lors de la génération de la proposition:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la proposition' },
      { status: 500 }
    )
  }
}

function generateProposalPDF(data: any): Buffer {
  const doc = new jsPDF()
  const currentDate = new Date().toLocaleDateString('fr-FR')
  let y = 30

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('PROPOSITION DE DÉVELOPPEMENT LOGICIEL', 20, y)
  y += 15
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('=====================================', 20, y)
  y += 15
  doc.text(`Date: ${currentDate}`, 20, y)
  y += 10
  doc.text('Entreprise: AUTOMATIC', 20, y)
  y += 10
  doc.text('Contact: contact@automatic.dev', 20, y)
  y += 10
  doc.text('Téléphone: +33 1 23 45 67 89', 20, y)
  y += 20

  // INFORMATIONS CLIENT
  doc.setFont('helvetica', 'bold')
  doc.text('INFORMATIONS CLIENT', 20, y)
  y += 10
  doc.text('==================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text(`Nom du projet: ${data.projectName}`, 20, y)
  y += 10
  doc.text(`Entreprise: ${data.company}`, 20, y)
  y += 10
  doc.text(`Email: ${data.email}`, 20, y)
  y += 10
  doc.text(`Téléphone: ${data.phone || 'Non spécifié'}`, 20, y)
  y += 20

  // DESCRIPTION DU PROJET
  doc.setFont('helvetica', 'bold')
  doc.text('DESCRIPTION DU PROJET', 20, y)
  y += 10
  doc.text('====================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  const descLines = doc.splitTextToSize(data.description, 170)
  doc.text(descLines, 20, y)
  y += descLines.length * 5 + 10

  // SPÉCIFICATIONS TECHNIQUES
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('SPÉCIFICATIONS TECHNIQUES', 20, y)
  y += 10
  doc.text('========================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text(`Type de projet: ${getProjectTypeName(data.projectType)}`, 20, y)
  y += 10
  if (data.platforms?.length > 0) {
    doc.text(`Plateformes: ${data.platforms.join(', ')}`, 20, y)
    y += 10
  }

  // FONCTIONNALITÉS DEMANDÉES
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('FONCTIONNALITÉS DEMANDÉES', 20, y)
  y += 10
  doc.text('========================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  const features = data.features?.map((featureId: string) => getFeatureName(featureId)).join(', ') || 'Aucune fonctionnalité sélectionnée'
  const featureLines = doc.splitTextToSize(features, 170)
  doc.text(featureLines, 20, y)
  y += featureLines.length * 5 + 10
  if (data.customFeatures) {
    doc.text('Fonctionnalités personnalisées:', 20, y)
    y += 10
    const customLines = doc.splitTextToSize(data.customFeatures, 170)
    doc.text(customLines, 20, y)
    y += customLines.length * 5 + 10
  }

  // EXIGENCES DE DESIGN
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('EXIGENCES DE DESIGN', 20, y)
  y += 10
  doc.text('==================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text(`Complexité: ${getDesignComplexityName(data.designComplexity)}`, 20, y)
  y += 10
  doc.text(`Éléments de marque: ${data.brandAssets ? 'Oui' : 'Non'}`, 20, y)
  y += 10
  doc.text(`Recherche utilisateur: ${data.userResearch ? 'Oui' : 'Non'}`, 20, y)
  y += 20

  // EXIGENCES TECHNIQUES
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('EXIGENCES TECHNIQUES', 20, y)
  y += 10
  doc.text('===================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  const techReqs = data.technicalRequirements?.map((reqId: string) => getTechnicalRequirementName(reqId)).join(', ') || 'Aucune exigence technique spécifique'
  const techLines = doc.splitTextToSize(techReqs, 170)
  doc.text(techLines, 20, y)
  y += techLines.length * 5 + 10

  // INTÉGRATIONS
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('INTÉGRATIONS', 20, y)
  y += 10
  doc.text('============', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  const integrations = data.integrations?.map((intId: string) => getIntegrationName(intId)).join(', ') || 'Aucune intégration spécifiée'
  const intLines = doc.splitTextToSize(integrations, 170)
  doc.text(intLines, 20, y)
  y += intLines.length * 5 + 10
  doc.text(`Préférence d'hébergement: ${data.hostingPreference || 'Non spécifiée'}`, 20, y)
  y += 20

  // TIMELINE ET BUDGET
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('TIMELINE ET BUDGET', 20, y)
  y += 10
  doc.text('==================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text(`Timeline souhaitée: ${getTimelineName(data.timeline)}`, 20, y)
  y += 10
  doc.text(`Budget approximatif: ${getBudgetName(data.budget)}`, 20, y)
  y += 10
  doc.text(`Priorité: ${getPriorityName(data.priority)}`, 20, y)
  y += 20

  // ESTIMATION
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('ESTIMATION', 20, y)
  y += 10
  doc.text('==========', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text(`Prix estimé: ${calculateEstimatedPrice(data)}€`, 20, y)
  y += 10
  doc.text(`Durée estimée: ${calculateEstimatedTimeline(data)}`, 20, y)
  y += 20

  // PROCHAINES ÉTAPES
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('PROCHAINES ÉTAPES', 20, y)
  y += 10
  doc.text('================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text('1. Validation de cette proposition', 20, y)
  y += 10
  doc.text('2. Appel de clarification avec notre équipe technique', 20, y)
  y += 10
  doc.text('3. Signature du contrat', 20, y)
  y += 10
  doc.text('4. Lancement du projet', 20, y)
  y += 20

  // CONDITIONS COMMERCIALES
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('CONDITIONS COMMERCIALES', 20, y)
  y += 10
  doc.text('======================', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text('- Acompte de 30% à la signature', 20, y)
  y += 10
  doc.text('- Paiement de 40% à mi-projet', 20, y)
  y += 10
  doc.text('- Solde de 30% à la livraison', 20, y)
  y += 10
  doc.text('- Garantie de 3 mois sur les développements', 20, y)
  y += 10
  doc.text('- Support technique inclus pendant 6 mois', 20, y)
  y += 20

  // CONTACT
  if (y > 250) {
    doc.addPage()
    y = 30
  }
  doc.setFont('helvetica', 'bold')
  doc.text('CONTACT', 20, y)
  y += 10
  doc.text('=======', 20, y)
  y += 15
  doc.setFont('helvetica', 'normal')
  doc.text('Pour toute question ou pour accepter cette proposition:', 20, y)
  y += 10
  doc.text('Email: contact@automatic.dev', 20, y)
  y += 10
  doc.text('Téléphone: +33 1 23 45 67 89', 20, y)
  y += 20
  doc.text('Merci de votre confiance dans AUTOMATIC pour la réalisation de votre projet.', 20, y)

  return Buffer.from(doc.output('arraybuffer'))
}

function getProjectTypeName(typeId: string): string {
  const types: Record<string, string> = {
    'web': 'Application Web',
    'mobile': 'Application Mobile',
    'saas': 'Plateforme SaaS',
    'ai': 'Intelligence Artificielle'
  }
  return types[typeId] || typeId
}

function getFeatureName(featureId: string): string {
  const features: Record<string, string> = {
    'user-auth': 'Authentification utilisateurs',
    'dashboard': 'Tableau de bord',
    'payments': 'Intégration paiements',
    'notifications': 'Notifications push/email',
    'analytics': 'Analytics et reporting',
    'api': 'API RESTful',
    'realtime': 'Fonctionnalités temps réel',
    'offline': 'Support offline',
    'social': 'Intégration réseaux sociaux',
    'multilingual': 'Support multilingue',
    'search': 'Recherche avancée',
    'file-upload': 'Gestion de fichiers'
  }
  return features[featureId] || featureId
}

function getDesignComplexityName(complexityId: string): string {
  const complexities: Record<string, string> = {
    'simple': 'Simple',
    'standard': 'Standard',
    'premium': 'Premium'
  }
  return complexities[complexityId] || complexityId
}

function getTechnicalRequirementName(reqId: string): string {
  const requirements: Record<string, string> = {
    'scalability': 'Haute scalabilité',
    'security': 'Sécurité avancée',
    'performance': 'Optimisation performance',
    'monitoring': 'Monitoring avancé',
    'backup': 'Sauvegarde automatique'
  }
  return requirements[reqId] || reqId
}

function getIntegrationName(intId: string): string {
  const integrations: Record<string, string> = {
    'stripe': 'Stripe',
    'google-analytics': 'Google Analytics',
    'mailchimp': 'Mailchimp',
    'slack': 'Slack',
    'salesforce': 'Salesforce',
    'hubspot': 'HubSpot'
  }
  return integrations[intId] || intId
}

function getTimelineName(timelineId: string): string {
  const timelines: Record<string, string> = {
    'urgent': 'Urgent (4-6 semaines)',
    'standard': 'Standard (8-12 semaines)',
    'flexible': 'Flexible (12-20 semaines)'
  }
  return timelines[timelineId] || timelineId
}

function getBudgetName(budgetId: string): string {
  const budgets: Record<string, string> = {
    '15-25k': '15k€ - 25k€',
    '25-40k': '25k€ - 40k€',
    '40-60k': '40k€ - 60k€',
    '60k+': '60k€ et plus'
  }
  return budgets[budgetId] || budgetId
}

function getPriorityName(priorityId: string): string {
  const priorities: Record<string, string> = {
    'speed': 'Vitesse de livraison',
    'quality': 'Qualité et perfection',
    'cost': 'Optimisation des coûts',
    'scalability': 'Scalabilité à long terme'
  }
  return priorities[priorityId] || priorityId
}

function calculateEstimatedPrice(data: any): string {
  let price = 0
  
  // Prix de base selon le type de projet
  const basePrices: Record<string, number> = {
    'web': 15000,
    'mobile': 20000,
    'saas': 25000,
    'ai': 30000
  }
  
  price += basePrices[data.projectType] || 0
  
  // Prix des fonctionnalités
  const featurePrices: Record<string, number> = {
    'user-auth': 2000,
    'dashboard': 3000,
    'payments': 2500,
    'notifications': 1500,
    'analytics': 2000,
    'api': 3500,
    'realtime': 3000,
    'offline': 2000,
    'social': 1500,
    'multilingual': 2500,
    'search': 2000,
    'file-upload': 1500
  }
  
  data.features?.forEach((featureId: string) => {
    price += featurePrices[featureId] || 0
  })
  
  // Multiplicateur de design
  const designMultipliers: Record<string, number> = {
    'simple': 1,
    'standard': 1.3,
    'premium': 1.6
  }
  
  price *= designMultipliers[data.designComplexity] || 1
  
  // Exigences techniques
  const techPrices: Record<string, number> = {
    'scalability': 3000,
    'security': 2500,
    'performance': 2000,
    'monitoring': 1500,
    'backup': 1000
  }
  
  data.technicalRequirements?.forEach((reqId: string) => {
    price += techPrices[reqId] || 0
  })
  
  // Intégrations
  const integrationPrices: Record<string, number> = {
    'stripe': 1000,
    'google-analytics': 500,
    'mailchimp': 800,
    'slack': 600,
    'salesforce': 2000,
    'hubspot': 1500
  }
  
  data.integrations?.forEach((intId: string) => {
    price += integrationPrices[intId] || 0
  })
  
  // Multiplicateur de timeline
  const timelineMultipliers: Record<string, number> = {
    'urgent': 1.5,
    'standard': 1,
    'flexible': 0.9
  }
  
  price *= timelineMultipliers[data.timeline] || 1
  
  return Math.round(price).toLocaleString('fr-FR')
}

function calculateEstimatedTimeline(data: any): string {
  const baseTimelines: Record<string, string> = {
    'web': '6-8 semaines',
    'mobile': '8-12 semaines',
    'saas': '10-16 semaines',
    'ai': '12-20 semaines'
  }
  
  let baseWeeks = 8 // default
  
  switch (data.projectType) {
    case 'web':
      baseWeeks = 7
      break
    case 'mobile':
      baseWeeks = 10
      break
    case 'saas':
      baseWeeks = 13
      break
    case 'ai':
      baseWeeks = 16
      break
  }
  
  // Ajustement selon la timeline
  switch (data.timeline) {
    case 'urgent':
      baseWeeks = Math.round(baseWeeks * 0.6)
      break
    case 'flexible':
      baseWeeks = Math.round(baseWeeks * 1.3)
      break
  }
  
  const minWeeks = Math.round(baseWeeks * 0.8)
  const maxWeeks = baseWeeks
  
  return `${minWeeks}-${maxWeeks} semaines`
}