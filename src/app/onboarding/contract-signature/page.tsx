"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  EyeOff,
  PenTool,
  Shield,
  Calendar,
  User,
  Building,
  Mail,
  Phone
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useOnboardingStep } from '@/hooks/use-onboarding-step'

interface ContractData {
  id: string
  proposalId: string
  title: string
  clientInfo: {
    company: string
    contact: string
    email: string
    phone: string
    address: string
  }
  projectInfo: {
    name: string
    description: string
    price: number
    timeline: string
    features: string[]
  }
  terms: {
    paymentSchedule: string[]
    deliverables: string[]
    responsibilities: string[]
  }
  createdAt: string
  validUntil: string
}

const ContractSignature = () => {
  const searchParams = useSearchParams()
  const proposalId = searchParams.get('proposalId')
  const { currentStep, updateStep } = useOnboardingStep({ proposalId: proposalId || '' })
  
  const [contract, setContract] = useState<ContractData | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [agreed, setAgreed] = useState(false)
  const [signatureData, setSignatureData] = useState({
    name: '',
    title: '',
    date: new Date().toISOString().split('T')[0]
  })
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    if (!proposalId) {
      setLoading(false)
      return
    }

    let mounted = true

    ;(async () => {
      try {
        let res = await fetch(`/api/contracts/${proposalId}`)

        // If contract not found, try to generate it server-side
        if (res.status === 404) {
          const gen = await fetch('/api/generate-contract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proposalId })
          })

          if (!gen.ok) throw new Error('Failed to generate contract')
          const genBody = await gen.json()
          // server returns created contract in genBody.contract
          if (mounted && genBody?.contract) {
            setContract(genBody.contract)
            return
          }

          // if generation didn't return contract, re-fetch
          res = await fetch(`/api/contracts/${proposalId}`)
        }

        if (!res.ok) throw new Error('Failed to fetch contract')
        const data = await res.json()
        if (mounted) setContract(data)
      } catch (err) {
        console.error('Error fetching contract:', err)
        if (mounted) setContract(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [proposalId])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#000'
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleSign = async () => {
    if (!agreed || !signatureData.name || !signatureData.title) {
      alert('Veuillez remplir toutes les informations et accepter les termes')
      return
    }
    
    setSigning(true)

    try {
      const canvas = canvasRef.current
      const signatureImage = canvas ? canvas.toDataURL('image/png') : null

      const res = await fetch(`/api/contracts/${contract?.id}/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signatureData, signatureImage })
      })

      if (!res.ok) throw new Error('Erreur serveur lors de la signature')

      setSigned(true)
      // Update step: Contract signed → step 5
      await updateStep(5)
    } catch (error) {
      console.error('Erreur lors de la signature:', error)
      alert('Erreur lors de la signature. Réessayez plus tard.')
    } finally {
      setSigning(false)
    }
  }

  const handleDownload = () => {
    if (!contract) return

    // Télécharge le PDF généré server-side
    ;(async () => {
      try {
        const res = await fetch(`/api/contracts/${contract.id}/pdf`)
        if (!res.ok) throw new Error('Impossible de générer le PDF')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `contrat-${contract.id}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } catch (err) {
        console.error('Erreur téléchargement PDF:', err)
        alert('Impossible de télécharger le PDF pour le moment.')
      }
    })()
  }

  const generateContractText = (contract: ContractData): string => {
    return `
CONTRAT DE DÉVELOPPEMENT LOGICIEL
===================================

Numéro: ${contract.id}
Date: ${new Date(contract.createdAt).toLocaleDateString('fr-FR')}
Valide jusqu'au: ${new Date(contract.validUntil).toLocaleDateString('fr-FR')}

PARTIES CONCERNÉES
==================

PRESTATAIRE: AUTOMATIC
SIRET: 12345678901234
Adresse: 456 Avenue de l'Innovation, 75002 Paris, France
Email: contact@automatic.dev
Téléphone: +33 1 23 45 67 89

CLIENT: ${contract.clientInfo.company}
Contact: ${contract.clientInfo.contact}
Email: ${contract.clientInfo.email}
Téléphone: ${contract.clientInfo.phone}
Adresse: ${contract.clientInfo.address}

OBJET DU CONTRAT
================

Le présent contrat a pour objet la réalisation des prestations de développement logiciel
décrites ci-après par AUTOMATIC pour le compte de ${contract.clientInfo.company}.

DESCRIPTION DU PROJET
====================

Nom du projet: ${contract.projectInfo.name}

Description: ${contract.projectInfo.description}

Livrables: ${contract.terms.deliverables.join(', ')}

Prix total: ${contract.projectInfo.price.toLocaleString('fr-FR')}€ HT
Durée estimée: ${contract.projectInfo.timeline}

CONDITIONS FINANCIÈRES
======================

Échéancier de paiement:
${contract.terms.paymentSchedule.map((term, index) => `${index + 1}. ${term}`).join('\n')}

RESPONSABILITÉS
=================

Responsabilités du client:
${contract.terms.responsibilities.map((resp, index) => `- ${resp}`).join('\n')}

SIGNATURES
==========

Le présent contrat est signé électroniquement par les deux parties,
ce qui lui confère la même valeur juridique qu'une signature manuscrite.

SIGNATURE DU CLIENT:
-------------------

Nom: ${signatureData.name}
Fonction: ${signatureData.title}
Date: ${signatureData.date}

[Signature électronique]

SIGNATURE DU PRESTATAIRE:
-------------------------

AUTOMATIC
Représenté par: Directeur Technique
Date: ${new Date().toLocaleDateString('fr-FR')}

[Signature électronique]
`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement du contrat...</p>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>Contrat non trouvé</CardTitle>
            <CardDescription>
              Le contrat demandé n'a pas été trouvé ou le lien a expiré.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/onboarding">
                Retour à l'onboarding
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (signed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Contrat signé avec succès !</CardTitle>
            <CardDescription>
              Votre contrat a été signé électroniquement et enregistré.
              Vous allez être redirigé vers la page de paiement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href={`/onboarding/payment?proposalId=${contract.proposalId}`}>
                Procéder au paiement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger le contrat
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sections = [
    { id: 0, title: 'Informations', icon: Building },
    { id: 1, title: 'Description projet', icon: FileText },
    { id: 2, title: 'Conditions', icon: Shield },
    { id: 3, title: 'Signature', icon: PenTool }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/onboarding">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <Badge variant="secondary">
                Contrat {contract.id}
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Signature du
              <span className="text-primary"> contrat</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Veuillez examiner attentivement le contrat et le signer électroniquement.
            </p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              {sections.map((section) => (
                <div key={section.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentSection(section.id)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                      currentSection >= section.id 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'bg-background border-border hover:border-primary/50'
                    }`}
                  >
                    {currentSection > section.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      React.createElement(section.icon, { className: "w-5 h-5" })
                    )}
                  </button>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${currentSection >= section.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {section.title}
                    </div>
                  </div>
                  {section.id < sections.length - 1 && (
                    <div className={`flex-1 h-1 mx-4 ${currentSection > section.id ? 'bg-primary' : 'bg-border'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contract Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>{contract.title}</span>
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                  <CardDescription>
                    Contrat n°{contract.id} • Valide jusqu'au {new Date(contract.validUntil).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-8">
                  {currentSection === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Informations des parties</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-medium text-primary">Prestataire</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>AUTOMATIC</strong></div>
                              <div>SIRET: 12345678901234</div>
                              <div>456 Avenue de l'Innovation</div>
                              <div>75002 Paris, France</div>
                              <div>contact@automatic.dev</div>
                              <div>+33 1 23 45 67 89</div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="font-medium text-primary">Client</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>{contract.clientInfo.company}</strong></div>
                              <div>Contact: {contract.clientInfo.contact}</div>
                              <div>{contract.clientInfo.email}</div>
                              <div>{contract.clientInfo.phone}</div>
                              <div>{contract.clientInfo.address}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Description du projet</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">{contract.projectInfo.name}</h4>
                            <p className="text-muted-foreground">{contract.projectInfo.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-muted rounded-lg">
                              <div className="text-2xl font-bold text-primary">
                                {contract.projectInfo.price.toLocaleString('fr-FR')}€
                              </div>
                              <div className="text-sm text-muted-foreground">Prix total HT</div>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <div className="text-lg font-semibold">
                                {contract.projectInfo.timeline}
                              </div>
                              <div className="text-sm text-muted-foreground">Durée estimée</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Livrables principaux</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {contract.projectInfo.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Conditions financières</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-3">Échéancier de paiement</h4>
                            <div className="space-y-2">
                              {contract.terms.paymentSchedule.map((term, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                    {index + 1}
                                  </div>
                                  <span>{term}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-3">Responsabilités du client</h4>
                            <div className="space-y-2">
                              {contract.terms.responsibilities.map((resp, index) => (
                                <div key={index} className="flex items-start space-x-2 text-sm">
                                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                                  <span>{resp}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Signature électronique</h3>
                        <Alert className="mb-6">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            La signature électronique a la même valeur juridique qu'une signature manuscrite. 
                            En signant, vous déclarez avoir lu, compris et accepté toutes les clauses du contrat.
                          </AlertDescription>
                        </Alert>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Nom complet *</Label>
                              <Input
                                id="name"
                                value={signatureData.name}
                                onChange={(e) => setSignatureData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Jean Dupont"
                              />
                            </div>
                            <div>
                              <Label htmlFor="title">Fonction *</Label>
                              <Input
                                id="title"
                                value={signatureData.title}
                                onChange={(e) => setSignatureData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Directeur Technique"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={signatureData.date}
                              onChange={(e) => setSignatureData(prev => ({ ...prev, date: e.target.value }))}
                            />
                          </div>
                          
                          <div>
                            <Label>Signature *</Label>
                            <div className="mt-2">
                              <div className="border-2 border-dashed border-border rounded-lg p-4 bg-muted/30">
                                <canvas
                                  ref={canvasRef}
                                  width={400}
                                  height={150}
                                  className="border border-border rounded bg-white cursor-crosshair w-full"
                                  onMouseDown={startDrawing}
                                  onMouseMove={draw}
                                  onMouseUp={stopDrawing}
                                  onMouseLeave={stopDrawing}
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    Signez avec votre souris dans la zone ci-dessus
                                  </span>
                                  <Button variant="outline" size="sm" onClick={clearSignature}>
                                    Effacer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="agreed"
                              checked={agreed}
                              onCheckedChange={(checked) => setAgreed(checked as boolean)}
                            />
                            <Label htmlFor="agreed" className="text-sm leading-relaxed">
                              Je certifie avoir lu, compris et accepté toutes les clauses du présent contrat. 
                              Je reconnais que cette signature électronique a la même valeur juridique qu'une signature manuscrite.
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Navigation Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Navigation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentSection === section.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {React.createElement(section.icon, { className: "w-4 h-4" })}
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Actions Card */}
              {currentSection === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      onClick={handleSign} 
                      className="w-full"
                      disabled={signing || !agreed || !signatureData.name || !signatureData.title}
                    >
                      {signing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Signature en cours...
                        </>
                      ) : (
                        <>
                          <PenTool className="w-4 h-4 mr-2" />
                          Signer le contrat
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le PDF
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Help Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Besoin d'aide ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Une question sur le contrat ? Notre équipe juridique est à votre disposition.
                  </p>
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter le support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContractSignature