"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle2, 
  X, 
  Star, 
  ArrowRight,
  Zap,
  Shield,
  Users,
  Clock,
  Award,
  Crown,
  Rocket,
  Building
} from 'lucide-react'
import Link from 'next/link'

const Tarifs = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const plans = [
    {
      name: "Starter",
      description: "Parfait pour les startups et petits projets",
      icon: Rocket,
      price: { monthly: 15000, yearly: 13500 },
      color: "from-blue-500 to-cyan-500",
      popular: false,
      features: [
        "Application web ou mobile",
        "Design responsive",
        "Technologies standards",
        "Tests de base",
        "Déploiement sur 1 environnement",
        "Support 3 mois",
        "Documentation de base"
      ],
      limitations: [
        "Pas d'architecture complexe",
        "Support limité (9h-17h)",
        "1 révision majeure"
      ],
      deliverables: [
        "Code source complet",
        "Documentation technique",
        "Guide de déploiement",
        "3 mois de support technique"
      ],
      timeline: "6-8 semaines",
      idealFor: "Startups, MVP, projets pilotes"
    },
    {
      name: "Business",
      description: "Solution complète pour entreprises en croissance",
      icon: Building,
      price: { monthly: 25000, yearly: 22500 },
      color: "from-purple-500 to-pink-500",
      popular: true,
      features: [
        "Application complète (web + mobile)",
        "Design sur mesure",
        "Architecture scalable",
        "Tests automatisés complets",
        "Déploiement multi-environnements",
        "Support 6 mois",
        "Documentation complète",
        "Monitoring avancé",
        "API RESTful",
        "Base de données optimisée"
      ],
      limitations: [],
      deliverables: [
        "Code source complet",
        "Architecture documentation",
        "API documentation",
        "Dashboard d'administration",
        "Tests automatisés",
        "6 mois de support prioritaire"
      ],
      timeline: "8-12 semaines",
      idealFor: "PME, scale-ups, projets complexes"
    },
    {
      name: "Enterprise",
      description: "Solutions sur mesure pour grandes entreprises",
      icon: Crown,
      price: { monthly: 40000, yearly: 36000 },
      color: "from-orange-500 to-red-500",
      popular: false,
      features: [
        "Solutions multi-plateformes",
        "Architecture microservices",
        "Intelligence artificielle intégrée",
        "Tests de charge et sécurité",
        "Infrastructure cloud complète",
        "Support 12 mois 24/7",
        "Documentation enterprise",
        "Formation équipes internes",
        "Consulting technique",
        "SLA garanti",
        "Audit de sécurité",
        "Optimisation performance"
      ],
      limitations: [],
      deliverables: [
        "Solution complète enterprise",
        "Infrastructure as code",
        "CI/CD pipeline",
        "Monitoring et alerting",
        "Formation personnalisée",
        "Support 24/7 dédié"
      ],
      timeline: "12-20 semaines",
      idealFor: "Grandes entreprises, transformations digitales"
    }
  ]

  const additionalServices = [
    {
      name: "Maintenance & Support",
      description: "Support continu et mises à jour",
      price: "à partir de 2000€/mois",
      features: [
        "Support prioritaire 24/7",
        "Mises à jour de sécurité",
        "Optimisation performance",
        "Sauvegardes automatiques",
        "Monitoring proactif"
      ]
    },
    {
      name: "Hébergement & Infrastructure",
      description: "Infrastructure cloud gérée",
      price: "à partir de 500€/mois",
      features: [
        "Hébergement cloud performant",
        "SSL et sécurité",
        "Sauvegardes quotidiennes",
        "CDN intégré",
        "Scaling automatique"
      ]
    },
    {
      name: "Formation & Accompagnement",
      description: "Formation de vos équipes",
      price: "à partir de 3000€",
      features: [
        "Formation technique",
        "Workshops pratiques",
        "Documentation personnalisée",
        "Accompagnement post-lancement",
        "Support transition"
      ]
    }
  ]

  const getDiscount = () => billingCycle === 'yearly' ? 10 : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Tarifs Transparents
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Des tarifs clairs pour
              <span className="text-primary"> votre croissance</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Pas de frais cachés, pas de surprises. Juste des solutions 
              de qualité adaptées à vos besoins et votre budget.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Facturation mensuelle
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${billingCycle === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                Facturation annuelle
                {getDiscount() > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    -{getDiscount()}%
                  </Badge>
                )}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`relative overflow-hidden border-2 ${
                plan.popular 
                  ? 'border-primary/50 shadow-2xl scale-105' 
                  : 'border-border/50 hover:border-primary/30'
              } transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
                    <Star className="w-4 h-4 inline mr-1" />
                    Plus populaire
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price[billingCycle].toLocaleString('fr-FR')}€
                      </span>
                      <span className="text-muted-foreground ml-2">
                        /{billingCycle === 'monthly' ? 'mois' : 'mois (annuel)'}
                      </span>
                    </div>
                    {plan.timeline && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {plan.timeline}
                      </p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Inclus dans le plan</h4>
                    <div className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Limitations</h4>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-center space-x-2">
                            <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Livrables</h4>
                    <div className="space-y-2">
                      {plan.deliverables.map((deliverable, deliverIndex) => (
                        <div key={deliverIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{deliverable}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary' : ''}`} 
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <Link href={`/configurateur?plan=${plan.name.toLowerCase()}`}>
                      {plan.popular ? 'Commencer maintenant' : 'Choisir ce plan'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>

                  {plan.idealFor && (
                    <p className="text-xs text-muted-foreground text-center">
                      Idéal pour : {plan.idealFor}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Services additionnels
            </h2>
            <p className="text-lg text-muted-foreground">
              Complétez votre solution avec nos services additionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <Card key={index} className="border-2 border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                  <div className="text-lg font-semibold text-primary">{service.price}</div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Questions fréquentes
              </h2>
              <p className="text-lg text-muted-foreground">
                Tout ce que vous devez savoir sur nos tarifs
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Les prix sont-ils fixes ou peuvent-ils changer ?",
                  answer: "Nos prix sont fixes une fois le devis signé. Aucun coût caché ne sera ajouté sans votre accord préalable."
                },
                {
                  question: "Puis-je personnaliser un plan existant ?",
                  answer: "Absolument ! Nos plans sont des points de départ. Nous pouvons personnaliser chaque offre selon vos besoins spécifiques."
                },
                {
                  question: "Quelles sont les modalités de paiement ?",
                  answer: "Nous acceptons les paiements par virement bancaire, carte bancaire et proposeons des échelonnements sur 3-6 mois pour les projets importants."
                },
                {
                  question: "Le support est-il inclus après la livraison ?",
                  answer: "Oui, chaque plan inclut une période de support (3 à 12 mois). Au-delà, vous pouvez souscrire à notre service de maintenance continue."
                }
              ].map((faq, index) => (
                <Card key={index} className="border-2 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Prêt à investir dans votre croissance ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Configurons ensemble la solution parfaite pour votre projet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/configurateur">
                  Configurer mon projet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Demander un devis personnalisé
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Tarifs