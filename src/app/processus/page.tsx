"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Search, 
  Lightbulb, 
  FileText, 
  Code, 
  TestTube, 
  Rocket,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  Zap,
  Shield,
  Award,
  Star
} from 'lucide-react'
import Link from 'next/link'

const Processus = () => {
  const [activePhase, setActivePhase] = useState(0)

  const phases = [
    {
      id: 1,
      title: "Découverte & Analyse",
      description: "Comprendre vos besoins et définir la vision",
      icon: Search,
      color: "from-blue-500 to-cyan-500",
      duration: "1-2 semaines",
      deliverables: [
        "Cahier des charges détaillé",
        "Analyse des exigences techniques",
        "Recherche utilisateur",
        "Benchmark concurrentiel",
        "Architecture initiale"
      ],
      activities: [
        "Workshops de découverte",
        "Entretiens avec les parties prenantes",
        "Analyse des processus existants",
        "Définition des KPIs de succès"
      ]
    },
    {
      id: 2,
      title: "Design UX/UI",
      description: "Créer une expérience utilisateur exceptionnelle",
      icon: Lightbulb,
      color: "from-purple-500 to-pink-500",
      duration: "2-3 semaines",
      deliverables: [
        "Personas et parcours utilisateur",
        "Wireframes et maquettes",
        "Prototype interactif",
        "Design system",
        "Tests utilisateur"
      ],
      activities: [
        "Design thinking workshops",
        "Création des wireframes",
        "Design visuel et branding",
        "Prototypage et itérations"
      ]
    },
    {
      id: 3,
      title: "Architecture Technique",
      description: "Concevoir une base technique solide et scalable",
      icon: FileText,
      color: "from-green-500 to-emerald-500",
      duration: "1-2 semaines",
      deliverables: [
        "Architecture système",
        "Spécifications techniques",
        "Choix technologiques",
        "Plan de sécurité",
        "Stratégie de déploiement"
      ],
      activities: [
        "Design de l'architecture",
        "Sélection des technologies",
        "Planification de la scalabilité",
        "Analyse de sécurité"
      ]
    },
    {
      id: 4,
      title: "Développement Agile",
      description: "Construire votre produit avec méthode et rapidité",
      icon: Code,
      color: "from-orange-500 to-red-500",
      duration: "4-12 semaines",
      deliverables: [
        "Code production-ready",
        "Tests automatisés",
        "Documentation technique",
        "API documentation",
        "Déploiement continu"
      ],
      activities: [
        "Sprints de 2 semaines",
        "Revues de code régulières",
        "Intégration continue",
        "Déploiement continu"
      ]
    },
    {
      id: 5,
      title: "Tests & Qualité",
      description: "Garantir la qualité et la performance",
      icon: TestTube,
      color: "from-indigo-500 to-purple-500",
      duration: "1-2 semaines",
      deliverables: [
        "Plan de test complet",
        "Rapports de test",
        "Tests de charge",
        "Audit de sécurité",
        "Tests d'accessibilité"
      ],
      activities: [
        "Tests fonctionnels",
        "Tests de performance",
        "Tests de sécurité",
        "Recette utilisateur"
      ]
    },
    {
      id: 6,
      title: "Déploiement & Lancement",
      description: "Mettre votre produit en production avec succès",
      icon: Rocket,
      color: "from-pink-500 to-rose-500",
      duration: "1 semaine",
      deliverables: [
        "Production déployée",
        "Monitoring configuré",
        "Documentation utilisateur",
        "Formation équipe",
        "Support post-lancement"
      ],
      activities: [
        "Déploiement en production",
        "Configuration monitoring",
        "Formation des équipes",
        "Lancement officiel"
      ]
    }
  ]

  const benefits = [
    {
      icon: Zap,
      title: "Rapidité",
      description: "Lancement garanti en 12 semaines maximum"
    },
    {
      icon: Shield,
      title: "Qualité",
      description: "Tests automatisés et monitoring 24/7"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Transparence totale et communication continue"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Meilleures pratiques et standards industriels"
    }
  ]

  const timeline = phases.map((phase, index) => ({
    ...phase,
    progress: activePhase >= index ? 100 : activePhase === index - 1 ? 50 : 0,
    status: activePhase > index ? 'completed' : activePhase === index ? 'active' : 'upcoming'
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Notre Processus
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Une méthode éprouvée pour
              <span className="text-primary"> votre succès</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              De l'idée au lancement, nous suivons une approche structurée 
              qui garantit qualité, rapidité et transparence à chaque étape.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/configurateur">
                  Démarrer votre projet
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Prendre rendez-vous
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Notre roadmap interactive
            </h2>
            <p className="text-lg text-muted-foreground">
              Cliquez sur chaque phase pour découvrir les détails
            </p>
          </div>

          {/* Timeline Navigation */}
          <div className="mb-12">
            <div className="relative">
              <div className="absolute left-0 top-1/2 w-full h-1 bg-border transform -translate-y-1/2"></div>
              <div 
                className="absolute left-0 top-1/2 h-1 bg-primary transform -translate-y-1/2 transition-all duration-500"
                style={{ width: `${(activePhase / (phases.length - 1)) * 100}%` }}
              ></div>
              
              <div className="relative flex justify-between">
                {phases.map((phase, index) => (
                  <button
                    key={phase.id}
                    onClick={() => setActivePhase(index)}
                    className={`relative z-10 w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      activePhase >= index 
                        ? 'bg-primary border-primary text-primary-foreground' 
                        : 'bg-background border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{phase.id}</span>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {phase.title.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Phase Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${phases[activePhase].color} flex items-center justify-center`}>
                    {React.createElement(phases[activePhase].icon, { className: "w-8 h-8 text-white" })}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{phases[activePhase].title}</CardTitle>
                    <CardDescription className="text-base">
                      {phases[activePhase].description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{phases[activePhase].duration}</span>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Livrables principaux</h4>
                  <div className="space-y-2">
                    {phases[activePhase].deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-3">Activités clés</h4>
                  <div className="space-y-2">
                    {phases[activePhase].activities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progression du projet</CardTitle>
                <CardDescription>
                  Suivez l'avancement de votre projet à chaque étape
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {timeline.map((phase, index) => (
                  <div key={phase.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{phase.title}</span>
                      <span className="text-xs text-muted-foreground">{phase.duration}</span>
                    </div>
                    <Progress 
                      value={phase.progress} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Pourquoi notre processus est différent
            </h2>
            <p className="text-lg text-muted-foreground">
              Nous combinons agilité, expertise et transparence pour garantir votre succès
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-2 border-border/50 hover:border-primary/50 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Prêt à commencer votre voyage ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Configurons votre projet ensemble et lançons-nous dans l'aventure.
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
                  Parler à un expert
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Processus