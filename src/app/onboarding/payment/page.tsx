"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2,
  AlertCircle,
  Shield,
  Calendar,
  DollarSign,
  Building,
  FileText,
  Lock,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useOnboardingStep } from '@/hooks/use-onboarding-step'

interface PaymentData {
  proposalId: string
  contractId: string
  amount: number
  currency: string
  dueDate: string
  description: string
  paymentMethods: string[]
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

const Payment = () => {
  const searchParams = useSearchParams()
  const proposalId = searchParams.get('proposalId')
  const { currentStep, updateStep } = useOnboardingStep({ proposalId: proposalId || '' })
  
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const res = await fetch(`/api/payments?proposalId=${proposalId || 'PROP-2024-001'}`)
        if (!res.ok) throw new Error('Failed to fetch payment data')
        const data = await res.json()
        if (mounted) setPaymentData(data)
      } catch (err) {
        console.error('Error loading payment data:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [proposalId])

  const handlePayment = async () => {
    if (!paymentData) return
    
    // Validation basique
    if (selectedMethod === 'card') {
      if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Veuillez remplir tous les champs de la carte bancaire')
        return
      }
    }
    
    setProcessing(true)

    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentData, selectedMethod, cardDetails })
      })

      if (!res.ok) throw new Error('Erreur lors du traitement du paiement')

      const result = await res.json()
      if (result.success) {
        setCompleted(true)
        // Update step: Payment completed → step 6
        await updateStep(6)
      }
      else throw new Error('Paiement échoué')
    } catch (error) {
      console.error('Erreur lors du paiement:', error)
      alert('Le paiement a échoué. Veuillez réessayer.')
    } finally {
      setProcessing(false)
    }
  }

  const handleTransferPayment = () => {
    // Redirection vers les instructions de virement
    window.open('/onboarding/payment/transfer-instructions', '_blank')
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ')
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement des informations de paiement...</p>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <CardTitle>Paiement non trouvé</CardTitle>
            <CardDescription>
              Les informations de paiement n'ont pas été trouvées.
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

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Paiement effectué avec succès !</CardTitle>
            <CardDescription>
              Votre acompte de {paymentData.amount.toLocaleString('fr-FR')}€ a été reçu. 
              Votre projet va maintenant être activé.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm text-green-800">
                <div className="font-semibold">Récapitulatif du paiement:</div>
                <div>Montant: {paymentData.amount.toLocaleString('fr-FR')}€</div>
                <div>Date: {new Date().toLocaleDateString('fr-FR')}</div>
                <div>Référence: PAY-{Date.now()}</div>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/client/dashboard">
                Accéder à mon espace client
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/onboarding">
                Retour à l'onboarding
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
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="outline" size="sm" asChild>
                <Link href="/onboarding">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
              </Button>
              <Badge variant="secondary">
                Paiement sécurisé
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Paiement de
              <span className="text-primary"> l'acompte</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Finalisez votre acompte de 30% pour lancer le développement de votre projet.
            </p>
          </div>
        </div>
      </section>

      {/* Payment Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Récapitulatif de la commande</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Projet:</span>
                      <span className="font-medium">{paymentData.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contrat:</span>
                      <span className="font-medium">{paymentData.contractId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date d'échéance:</span>
                      <span className="font-medium">{new Date(paymentData.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Montant total:</span>
                      <span className="font-bold text-primary">
                        {paymentData.amount.toLocaleString('fr-FR')}€
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Soit 30% d'acompte sur le montant total du projet
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Méthode de paiement</CardTitle>
                  <CardDescription>
                    Choisissez votre méthode de paiement préférée
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <CreditCard className="w-5 h-5" />
                        <div>
                          <div className="font-medium">Carte bancaire</div>
                          <div className="text-sm text-muted-foreground">Paiement immédiat et sécurisé</div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="flex items-center space-x-3 cursor-pointer flex-1">
                        <Building className="w-5 h-5" />
                        <div>
                          <div className="font-medium">Virement bancaire</div>
                          <div className="text-sm text-muted-foreground">2-3 jours ouvrés</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {selectedMethod === 'card' && (
                    <div className="space-y-4">
                      <Alert>
                        <Lock className="h-4 w-4" />
                        <AlertDescription>
                          Vos informations bancaires sont chiffrées et sécurisées. 
                          Nous ne stockons jamais vos données de carte.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => setCardDetails(prev => ({ 
                              ...prev, 
                              number: formatCardNumber(e.target.value) 
                            }))}
                            maxLength={19}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cardName">Nom du titulaire</Label>
                          <Input
                            id="cardName"
                            placeholder="JEAN DUPONT"
                            value={cardDetails.name}
                            onChange={(e) => setCardDetails(prev => ({ 
                              ...prev, 
                              name: e.target.value.toUpperCase() 
                            }))}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Date d'expiration</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/AA"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails(prev => ({ 
                                ...prev, 
                                expiry: formatExpiry(e.target.value) 
                              }))}
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails(prev => ({ 
                                ...prev, 
                                cvv: e.target.value.replace(/\D/g, '') 
                              }))}
                              maxLength={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 'transfer' && (
                    <div className="space-y-4">
                      <Alert>
                        <Calendar className="h-4 w-4" />
                        <AlertDescription>
                          Le virement bancaire prend 2-3 jours ouvrés pour être traité. 
                          Votre projet sera activé dès réception du paiement.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <h4 className="font-medium">Coordonnées bancaires:</h4>
                        <div className="text-sm space-y-1">
                          <div><strong>Titulaire:</strong> AUTOMATIC</div>
                          <div><strong>IBAN:</strong> FR76 3000 4000 1234 5678 9012 345</div>
                          <div><strong>BIC:</strong> BNPAFRPP</div>
                          <div><strong>Banque:</strong> BNP Paribas</div>
                          <div><strong>Référence:</strong> {paymentData.contractId}</div>
                        </div>
                      </div>
                      
                      <Button variant="outline" onClick={handleTransferPayment} className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        Télécharger les instructions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Button */}
              {selectedMethod === 'card' && (
                <Button 
                  onClick={handlePayment} 
                  className="w-full" 
                  size="lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Payer {paymentData.amount.toLocaleString('fr-FR')}€
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
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
                    <span>Paiement 3D Secure</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Chiffrement SSL</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Conformité PCI DSS</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Garantie remboursement</span>
                  </div>
                </CardContent>
              </Card>

              {/* Support Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Une question ?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Notre équipe de support est disponible pour vous aider avec votre paiement.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" size="sm">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Contacter le support financier
                    </Button>
                    <Button variant="outline" className="w-full" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Planifier un appel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Prochaines étapes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">1</div>
                    <span>Paiement de l'acompte</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">2</div>
                    <span>Activation du projet</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">3</div>
                    <span>Accès espace client</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-xs font-medium">4</div>
                    <span>Lancement du développement</span>
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

export default Payment