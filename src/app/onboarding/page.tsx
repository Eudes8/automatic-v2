"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Clock,
  DollarSign,
  Shield,
  User,
  Calendar,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useOnboardingStep } from '@/hooks/use-onboarding-step'

interface ProposalData {
  id: string
  projectName: string
  company: string
  email: string
  phone: string
  description: string
  projectType: string
  price: number
  timeline: string
  features: string[]
  status: 'pending' | 'validated' | 'contract_signed' | 'paid' | 'active'
  createdAt: string
  validUntil: string
}

const Onboarding = () => {
  const searchParams = useSearchParams()
  const proposalId = searchParams.get('proposalId')
  const { currentStep, updateStep, loading: stepLoading } = useOnboardingStep({ proposalId: proposalId || '' })
  
  const [proposal, setProposal] = useState<ProposalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [contractGenerated, setContractGenerated] = useState(false)
  const [contractSigned, setContractSigned] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadProposal = async () => {
      try {
        if (proposalId) {
          const response = await fetch(`/api/get-proposal?proposalId=${proposalId}`)
          if (response.ok) {
            const data = await response.json()
            if (data.success) {
              if (mounted) {
                setProposal(data.proposal)
                setLoading(false)
                return
              }
            }
          }
        }

        // Fallback: essayer de récupérer une proposition générique
        const fallbackResponse = await fetch(`/api/get-proposal?proposalId=${proposalId || 'PROP-2024-001'}`)
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          if (data.success && mounted) setProposal(data.proposal)
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la proposition:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProposal()

    return () => { mounted = false }
  }, [proposalId])

  const handleValidateProposal = async () => {
    if (!proposal) return
    
    try {
      const response = await fetch('/api/validate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposalId: proposal.id })
      })
      
      if (response.ok) {
        setProposal(prev => prev ? { ...prev, status: 'validated' } : null)
        // Update step: Validation complete → move to step 1
        await updateStep(1)
        // Génération automatique du contrat après validation
        setContractGenerated(true)
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error)
    }
  }

  const handleGenerateContract = async () => {
    if (!proposal) return
    
    try {
      const response = await fetch('/api/generate-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposalId: proposal.id })
      })
      
      if (response.ok) {
        setContractGenerated(true)
        // Update step: Contract generated → step 2
        await updateStep(2)
      }
    } catch (error) {
      console.error('Erreur lors de la génération du contrat:', error)
    }
  }

  const handleSignContract = async () => {
    // Update step before navigation: Ready to sign → step 3
    await updateStep(3)
    // Redirection vers la page de signature
    window.location.href = `/onboarding/contract-signature?proposalId=${proposal?.id}`
  }

  const handleProceedToPayment = async () => {
    // Update step before navigation: Contract signed → step 4
    await updateStep(4)
    // Redirection vers la page de paiement
    window.location.href = `/onboarding/payment?proposalId=${proposal?.id}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'validated': return 'bg-blue-100 text-blue-800'
      case 'contract_signed': return 'bg-purple-100 text-purple-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'active': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente de validation'
      case 'validated': return 'Proposition validée'
      case 'contract_signed': return 'Contrat signé'
      case 'paid': return 'Paiement effectué'
      case 'active': return 'Projet actif'
      default: return 'Statut inconnu'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement de votre proposition...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>Proposition non trouvée</CardTitle>
            <CardDescription>
              Aucune proposition n'a été trouvée ou le lien a expiré.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/configurateur">
                Créer une nouvelle proposition
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Tunnel d'Onboarding
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Finalisons votre
              <span className="text-primary"> projet</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Suivez les étapes pour valider votre proposition, signer le contrat et lancer votre projet.
            </p>
          </div>
        </div>
      </section>

      {/* Progress Steps */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              {[
                { id: 1, title: 'Proposition', completed: proposal.status !== 'pending', current: proposal.status === 'pending' },
                { id: 2, title: 'Contrat', completed: contractGenerated, current: proposal.status === 'validated' && !contractGenerated },
                { id: 3, title: 'Signature', completed: contractSigned, current: contractGenerated && !contractSigned },
                { id: 4, title: 'Paiement', completed: proposal.status === 'paid', current: contractSigned && proposal.status !== 'paid' },
                { id: 5, title: 'Lancement', completed: proposal.status === 'active', current: false }
              ].map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    step.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : step.current
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'bg-background border-border'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${step.completed || step.current ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                  {step.id < 5 && (
                    <div className={`flex-1 h-1 mx-4 ${step.completed ? 'bg-green-500' : 'bg-border'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Proposal Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Proposal Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>Proposition {proposal.id}</span>
                    </CardTitle>
                    <Badge className={getStatusColor(proposal.status)}>
                      {getStatusText(proposal.status)}
                    </Badge>
                  </div>
                  <CardDescription>
                    Créée le {new Date(proposal.createdAt).toLocaleDateString('fr-FR')}
                    {' • '}Valide jusqu'au {new Date(proposal.validUntil).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Informations projet</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-muted-foreground">Nom:</span> {proposal.projectName}</div>
                        <div><span className="text-muted-foreground">Entreprise:</span> {proposal.company}</div>
                        <div><span className="text-muted-foreground">Type:</span> {proposal.projectType}</div>
                        <div><span className="text-muted-foreground">Durée:</span> {proposal.timeline}</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Contact</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-muted-foreground">Email:</span> {proposal.email}</div>
                        <div><span className="text-muted-foreground">Téléphone:</span> {proposal.phone}</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Description</h4>
                    <p className="text-muted-foreground">{proposal.description}</p>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Fonctionnalités incluses</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {proposal.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {proposal.price.toLocaleString('fr-FR')}€
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Prix total HT
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Cards */}
              {proposal.status === 'pending' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500" />
                      <span>Valider la proposition</span>
                    </CardTitle>
                    <CardDescription>
                      En validant cette proposition, vous acceptez le devis et passez à l'étape de génération du contrat.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleValidateProposal} className="w-full">
                      Valider la proposition
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {proposal.status === 'validated' && !contractGenerated && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span>Génération du contrat</span>
                    </CardTitle>
                    <CardDescription>
                      Nous générons votre contrat personnalisé basé sur la proposition validée.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleGenerateContract} className="w-full">
                      Générer le contrat
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {contractGenerated && !contractSigned && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Edit className="w-5 h-5 text-orange-500" />
                      <span>Signature du contrat</span>
                    </CardTitle>
                    <CardDescription>
                      Votre contrat est prêt. Veuillez le signer électroniquement pour continuer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button onClick={handleSignContract} className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir et signer le contrat
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {contractSigned && proposal.status !== 'paid' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <span>Paiement de l'acompte</span>
                    </CardTitle>
                    <CardDescription>
                      Le contrat est signé. Veuillez régler l'acompte de 30% pour lancer le projet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-lg font-semibold text-green-800">
                        Acompte à régler: {(proposal.price * 0.3).toLocaleString('fr-FR')}€
                      </div>
                      <div className="text-sm text-green-600">
                        Soit 30% du montant total ({proposal.price.toLocaleString('fr-FR')}€)
                      </div>
                    </div>
                    <Button onClick={handleProceedToPayment} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Procéder au paiement
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Timeline du projet</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { step: 'Validation', date: 'Aujourd\'hui', status: proposal.status === 'pending' ? 'current' : 'completed' },
                      { step: 'Génération contrat', date: 'Demain', status: proposal.status === 'validated' ? 'current' : contractGenerated ? 'completed' : 'upcoming' },
                      { step: 'Signature', date: contractGenerated ? 'Cette semaine' : 'Prochainement', status: contractGenerated && !contractSigned ? 'current' : contractSigned ? 'completed' : 'upcoming' },
                      { step: 'Paiement', date: contractSigned ? 'Cette semaine' : 'Prochainement', status: contractSigned && proposal.status !== 'paid' ? 'current' : proposal.status === 'paid' ? 'completed' : 'upcoming' },
                      { step: 'Lancement', date: 'Prochainement', status: proposal.status === 'active' ? 'completed' : 'upcoming' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'current' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.step}</div>
                          <div className="text-xs text-muted-foreground">{item.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Besoin d'aide ?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Notre équipe est disponible pour vous accompagner dans chaque étape.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact">
                        Contacter le support
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Prendre rendez-vous
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Sécurité</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Données chiffrées</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Signature électronique légale</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Paiement sécurisé</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>RGPD compliant</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Onboarding