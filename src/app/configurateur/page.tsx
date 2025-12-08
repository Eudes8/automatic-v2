"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Smartphone, 
  Cloud, 
  Brain,
  Users,
  Clock,
  DollarSign,
  FileText,
  Zap,
  Shield,
  Star,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface ProjectData {
  // Étape 1: Informations de base
  projectName: string
  company: string
  email: string
  phone: string
  description: string
  
  // Étape 2: Type de projet
  projectType: string
  platforms: string[]
  
  // Étape 3: Fonctionnalités
  features: string[]
  customFeatures: string
  
  // Étape 4: Design et UX
  designComplexity: string
  brandAssets: boolean
  userResearch: boolean
  
  // Étape 5: Technique et Infrastructure
  technicalRequirements: string[]
  integrations: string[]
  hostingPreference: string
  
  // Étape 6: Timeline et Budget
  timeline: string
  budget: string
  priority: string
}

const Configurateur = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    company: '',
    email: '',
    phone: '',
    description: '',
    projectType: '',
    platforms: [],
    features: [],
    customFeatures: '',
    designComplexity: '',
    brandAssets: false,
    userResearch: false,
    technicalRequirements: [],
    integrations: [],
    hostingPreference: '',
    timeline: '',
    budget: '',
    priority: ''
  })

  const [estimatedPrice, setEstimatedPrice] = useState(0)
  const [estimatedTimeline, setEstimatedTimeline] = useState('')

  const steps = [
    { id: 1, title: "Informations de base", icon: Users },
    { id: 2, title: "Type de projet", icon: Code2 },
    { id: 3, title: "Fonctionnalités", icon: Zap },
    { id: 4, title: "Design & UX", icon: Star },
    { id: 5, title: "Technique", icon: Shield },
    { id: 6, title: "Timeline & Budget", icon: Clock }
  ]

  const projectTypes = [
    { 
      id: 'web', 
      title: 'Application Web', 
      description: 'Site web ou application web progressive',
      icon: Code2,
      basePrice: 15000,
      baseTimeline: '6-8 semaines'
    },
    { 
      id: 'mobile', 
      title: 'Application Mobile', 
      description: 'Application iOS et/ou Android',
      icon: Smartphone,
      basePrice: 20000,
      baseTimeline: '8-12 semaines'
    },
    { 
      id: 'saas', 
      title: 'Plateforme SaaS', 
      description: 'Solution cloud multi-utilisateurs',
      icon: Cloud,
      basePrice: 25000,
      baseTimeline: '10-16 semaines'
    },
    { 
      id: 'ai', 
      title: 'Intelligence IA', 
      description: 'Solution avec IA/ML intégrée',
      icon: Brain,
      basePrice: 30000,
      baseTimeline: '12-20 semaines'
    }
  ]

  const features = [
    { id: 'user-auth', name: 'Authentification utilisateurs', price: 2000, category: 'core' },
    { id: 'dashboard', name: 'Tableau de bord', price: 3000, category: 'core' },
    { id: 'payments', name: 'Intégration paiements', price: 2500, category: 'business' },
    { id: 'notifications', name: 'Notifications push/email', price: 1500, category: 'engagement' },
    { id: 'analytics', name: 'Analytics et reporting', price: 2000, category: 'business' },
    { id: 'api', name: 'API RESTful', price: 3500, category: 'technical' },
    { id: 'realtime', name: 'Fonctionnalités temps réel', price: 3000, category: 'technical' },
    { id: 'offline', name: 'Support offline', price: 2000, category: 'technical' },
    { id: 'social', name: 'Intégration réseaux sociaux', price: 1500, category: 'engagement' },
    { id: 'multilingual', name: 'Support multilingue', price: 2500, category: 'engagement' },
    { id: 'search', name: 'Recherche avancée', price: 2000, category: 'technical' },
    { id: 'file-upload', name: 'Gestion de fichiers', price: 1500, category: 'core' }
  ]

  const designComplexities = [
    { id: 'simple', name: 'Simple', description: 'Design basique avec templates', multiplier: 1 },
    { id: 'standard', name: 'Standard', description: 'Design sur mesure', multiplier: 1.3 },
    { id: 'premium', name: 'Premium', description: 'Design haute couture', multiplier: 1.6 }
  ]

  const technicalRequirements = [
    { id: 'scalability', name: 'Haute scalabilité', price: 3000 },
    { id: 'security', name: 'Sécurité avancée', price: 2500 },
    { id: 'performance', name: 'Optimisation performance', price: 2000 },
    { id: 'monitoring', name: 'Monitoring avancé', price: 1500 },
    { id: 'backup', name: 'Sauvegarde automatique', price: 1000 }
  ]

  const integrations = [
    { id: 'stripe', name: 'Stripe', price: 1000 },
    { id: 'google-analytics', name: 'Google Analytics', price: 500 },
    { id: 'mailchimp', name: 'Mailchimp', price: 800 },
    { id: 'slack', name: 'Slack', price: 600 },
    { id: 'salesforce', name: 'Salesforce', price: 2000 },
    { id: 'hubspot', name: 'HubSpot', price: 1500 }
  ]

  const timelines = [
    { id: 'urgent', name: 'Urgent (4-6 semaines)', multiplier: 1.5 },
    { id: 'standard', name: 'Standard (8-12 semaines)', multiplier: 1 },
    { id: 'flexible', name: 'Flexible (12-20 semaines)', multiplier: 0.9 }
  ]

  const budgets = [
    { id: '15-25k', name: '15k€ - 25k€', range: [15000, 25000] },
    { id: '25-40k', name: '25k€ - 40k€', range: [25000, 40000] },
    { id: '40-60k', name: '40k€ - 60k€', range: [40000, 60000] },
    { id: '60k+', name: '60k€ et plus', range: [60000, 100000] }
  ]

  // Calcul du prix estimé
  useEffect(() => {
    let price = 0
    
    // Prix de base selon le type de projet
    const selectedType = projectTypes.find(type => type.id === projectData.projectType)
    if (selectedType) {
      price = selectedType.basePrice
    }
    
    // Ajout des fonctionnalités
    projectData.features.forEach(featureId => {
      const feature = features.find(f => f.id === featureId)
      if (feature) {
        price += feature.price
      }
    })
    
    // Multiplicateur de design
    const designComplexity = designComplexities.find(d => d.id === projectData.designComplexity)
    if (designComplexity) {
      price *= designComplexity.multiplier
    }
    
    // Exigences techniques
    projectData.technicalRequirements.forEach(reqId => {
      const req = technicalRequirements.find(r => r.id === reqId)
      if (req) {
        price += req.price
      }
    })
    
    // Intégrations
    projectData.integrations.forEach(intId => {
      const integration = integrations.find(i => i.id === intId)
      if (integration) {
        price += integration.price
      }
    })
    
    // Multiplicateur de timeline
    const timeline = timelines.find(t => t.id === projectData.timeline)
    if (timeline) {
      price *= timeline.multiplier
    }
    
    setEstimatedPrice(Math.round(price))
    
    // Calcul de la timeline estimée
    if (selectedType) {
      const weeksRaw = selectedType.baseTimeline.split('-')[1].replace(' semaines', '')
      let weeks = parseInt(weeksRaw, 10)

      if (projectData.timeline === 'urgent') weeks = Math.round(weeks * 0.6)
      else if (projectData.timeline === 'flexible') weeks = Math.round(weeks * 1.3)

      setEstimatedTimeline(`${Math.round(weeks * 0.8)}-${weeks} semaines`)
    }
  }, [projectData])

  const updateProjectData = (field: keyof ProjectData, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectName">Nom du projet *</Label>
                <Input
                  id="projectName"
                  value={projectData.projectName}
                  onChange={(e) => updateProjectData('projectName', e.target.value)}
                  placeholder="Mon application incroyable"
                />
              </div>
              <div>
                <Label htmlFor="company">Entreprise *</Label>
                <Input
                  id="company"
                  value={projectData.company}
                  onChange={(e) => updateProjectData('company', e.target.value)}
                  placeholder="Ma société SAS"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={projectData.email}
                  onChange={(e) => updateProjectData('email', e.target.value)}
                  placeholder="contact@entreprise.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={projectData.phone}
                  onChange={(e) => updateProjectData('phone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description du projet *</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => updateProjectData('description', e.target.value)}
                placeholder="Décrivez votre projet, vos objectifs, votre public cible..."
                rows={4}
              />
            </div>
          </div>
        )
        
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label>Quel type de projet souhaitez-vous développer ?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {projectTypes.map((type) => (
                  <Card 
                    key={type.id}
                    className={`cursor-pointer transition-all ${
                      projectData.projectType === type.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => updateProjectData('projectType', type.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <type.icon className="w-5 h-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                      </div>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <div>À partir de {type.basePrice.toLocaleString('fr-FR')}€</div>
                        <div>{type.baseTimeline}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            {projectData.projectType === 'mobile' && (
              <div>
                <Label>Plateformes cibles</Label>
                <div className="flex space-x-4 mt-2">
                  {['iOS', 'Android'].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={projectData.platforms.includes(platform)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateProjectData('platforms', [...projectData.platforms, platform])
                          } else {
                            updateProjectData('platforms', projectData.platforms.filter(p => p !== platform))
                          }
                        }}
                      />
                      <Label htmlFor={platform}>{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label>Quelles fonctionnalités souhaitez-vous inclure ?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {features.map((feature) => (
                  <Card key={feature.id} className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={feature.id}
                        checked={projectData.features.includes(feature.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateProjectData('features', [...projectData.features, feature.id])
                          } else {
                            updateProjectData('features', projectData.features.filter(f => f !== feature.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={feature.id} className="font-medium">
                          {feature.name}
                        </Label>
                        <div className="text-sm text-primary font-medium">
                          +{feature.price.toLocaleString('fr-FR')}€
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="customFeatures">Fonctionnalités personnalisées</Label>
              <Textarea
                id="customFeatures"
                value={projectData.customFeatures}
                onChange={(e) => updateProjectData('customFeatures', e.target.value)}
                placeholder="Décrivez les fonctionnalités spécifiques à votre projet..."
                rows={3}
              />
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label>Complexité du design</Label>
              <RadioGroup
                value={projectData.designComplexity}
                onValueChange={(value) => updateProjectData('designComplexity', value)}
                className="mt-4"
              >
                {designComplexities.map((complexity) => (
                  <div key={complexity.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={complexity.id} id={complexity.id} />
                    <Label htmlFor={complexity.id}>
                      <div>
                        <div className="font-medium">{complexity.name}</div>
                        <div className="text-sm text-muted-foreground">{complexity.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="brandAssets"
                  checked={projectData.brandAssets}
                  onCheckedChange={(checked) => updateProjectData('brandAssets', checked as boolean)}
                />
                <Label htmlFor="brandAssets">
                  J'ai déjà des éléments de marque (logo, couleurs, etc.)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="userResearch"
                  checked={projectData.userResearch}
                  onCheckedChange={(checked) => updateProjectData('userResearch', checked as boolean)}
                />
                <Label htmlFor="userResearch">
                  Je souhaite inclure une recherche utilisateur
                </Label>
              </div>
            </div>
          </div>
        )
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Exigences techniques</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {technicalRequirements.map((req) => (
                  <Card key={req.id} className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={req.id}
                        checked={projectData.technicalRequirements.includes(req.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateProjectData('technicalRequirements', [...projectData.technicalRequirements, req.id])
                          } else {
                            updateProjectData('technicalRequirements', projectData.technicalRequirements.filter(r => r !== req.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={req.id} className="font-medium">
                          {req.name}
                        </Label>
                        <div className="text-sm text-primary font-medium">
                          +{req.price.toLocaleString('fr-FR')}€
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Intégrations tierces</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {integrations.map((integration) => (
                  <Card key={integration.id} className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={integration.id}
                        checked={projectData.integrations.includes(integration.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateProjectData('integrations', [...projectData.integrations, integration.id])
                          } else {
                            updateProjectData('integrations', projectData.integrations.filter(i => i !== integration.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={integration.id} className="font-medium">
                          {integration.name}
                        </Label>
                        <div className="text-sm text-primary font-medium">
                          +{integration.price.toLocaleString('fr-FR')}€
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Préférence d'hébergement</Label>
              <Select value={projectData.hostingPreference} onValueChange={(value) => updateProjectData('hostingPreference', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez votre préférence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cloud">Cloud (AWS/GCP/Azure)</SelectItem>
                  <SelectItem value="managed">Hébergement géré</SelectItem>
                  <SelectItem value="onpremise">On-premise</SelectItem>
                  <SelectItem value="hybrid">Hybride</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
        
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label>Timeline souhaitée</Label>
              <RadioGroup
                value={projectData.timeline}
                onValueChange={(value) => updateProjectData('timeline', value)}
                className="mt-4"
              >
                {timelines.map((timeline) => (
                  <div key={timeline.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={timeline.id} id={timeline.id} />
                    <Label htmlFor={timeline.id}>
                      <div>
                        <div className="font-medium">{timeline.name}</div>
                        {timeline.multiplier > 1 && (
                          <div className="text-sm text-orange-600">Majoration de +{((timeline.multiplier - 1) * 100).toFixed(0)}%</div>
                        )}
                        {timeline.multiplier < 1 && (
                          <div className="text-sm text-green-600">Réduction de -{((1 - timeline.multiplier) * 100).toFixed(0)}%</div>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label>Budget approximatif</Label>
              <RadioGroup
                value={projectData.budget}
                onValueChange={(value) => updateProjectData('budget', value)}
                className="mt-4"
              >
                {budgets.map((budget) => (
                  <div key={budget.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={budget.id} id={budget.id} />
                    <Label htmlFor={budget.id} className="font-medium">
                      {budget.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label>Priorité principale</Label>
              <Select value={projectData.priority} onValueChange={(value) => updateProjectData('priority', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Quelle est votre priorité ?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speed">Vitesse de livraison</SelectItem>
                  <SelectItem value="quality">Qualité et perfection</SelectItem>
                  <SelectItem value="cost">Optimisation des coûts</SelectItem>
                  <SelectItem value="scalability">Scalabilité à long terme</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return projectData.projectName && projectData.company && projectData.email && projectData.description
      case 1:
        return projectData.projectType !== ''
      case 2:
        return true
      case 3:
        return projectData.designComplexity !== ''
      case 4:
        return true
      case 5:
        return projectData.timeline && projectData.budget && projectData.priority
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-8 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Configurateur de Projet
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Configurons votre projet
              <span className="text-primary"> ensemble</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Répondez à quelques questions et recevez une estimation 
              personnalisée en temps réel.
            </p>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                    index <= currentStep 
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-border bg-background'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-full h-1 mx-2 transition-colors ${
                      index < currentStep ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <div key={step.id} className={`text-center ${index <= currentStep ? 'text-foreground font-medium' : ''}`}>
                  {step.title}
                </div>
              ))}
            </div>
            <Progress value={(currentStep / (steps.length - 1)) * 100} className="mt-4" />
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {React.createElement(steps[currentStep].icon, { className: "w-5 h-5" })}
                      <span>Étape {currentStep + 1} : {steps[currentStep].title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderStep()}
                    
                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Précédent
                      </Button>
                      
                      {currentStep < steps.length - 1 ? (
                        <Button onClick={nextStep} disabled={!canProceed()}>
                          Suivant
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button 
                          disabled={!canProceed()}
                          onClick={async () => {
                            // Sauvegarder les données du projet et rediriger vers l'onboarding
                            try {
                              const response = await fetch('/api/save-proposal', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(projectData)
                              })
                              
                              if (response.ok) {
                                const result = await response.json()
                                // Rediriger vers la page d'onboarding avec l'ID de la proposition
                                window.location.href = `/onboarding?proposalId=${result.proposalId}`
                              } else {
                                alert('Erreur lors de la sauvegarde de la proposition')
                              }
                            } catch (error) {
                              console.error('Erreur:', error)
                              alert('Erreur lors de la sauvegarde de la proposition')
                            }
                          }}
                        >
                          Générer la proposition
                          <FileText className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Estimation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Estimation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {estimatedPrice.toLocaleString('fr-FR')}€
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {estimatedTimeline && `Durée estimée : ${estimatedTimeline}`}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Type de projet</span>
                        <span>
                          {projectTypes.find(t => t.id === projectData.projectType)?.basePrice.toLocaleString('fr-FR')}€
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fonctionnalités</span>
                        <span>
                          {projectData.features.reduce((sum, featureId) => {
                            const feature = features.find(f => f.id === featureId)
                            return sum + (feature?.price || 0)
                          }, 0).toLocaleString('fr-FR')}€
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Exigences techniques</span>
                        <span>
                          {projectData.technicalRequirements.reduce((sum, reqId) => {
                            const req = technicalRequirements.find(r => r.id === reqId)
                            return sum + (req?.price || 0)
                          }, 0).toLocaleString('fr-FR')}€
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Help */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>Besoin d'aide ?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Notre équipe est disponible pour vous accompagner dans la configuration de votre projet.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact">
                        Contacter un expert
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Configurateur