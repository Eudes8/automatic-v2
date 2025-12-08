"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Clock, 
  CheckCircle2,
  Code2,
  Smartphone,
  Cloud,
  Brain,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

const Hero = () => {
  const features = [
    {
      icon: Zap,
      title: "Rapide",
      description: "Lancement en 2 semaines"
    },
    {
      icon: Shield,
      title: "Fiable",
      description: "Garantie 12 mois"
    },
    {
      icon: Clock,
      title: "Efficace",
      description: "Processus optimisé"
    }
  ]

  const services = [
    {
      icon: Code2,
      title: "Applications Web",
      description: "Solutions modernes et performantes"
    },
    {
      icon: Smartphone,
      title: "Applications Mobiles",
      description: "iOS et Android natives"
    },
    {
      icon: Cloud,
      title: "Plateformes SaaS",
      description: "Évolutives et sécurisées"
    },
    {
      icon: Brain,
      title: "Intelligence IA",
      description: "Solutions intelligentes sur mesure"
    }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              La référence du développement logiciel sur-mesure
            </Badge>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Développez vos idées
            <span className="block text-primary">avec intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            AUTOMATIC transforme votre vision en réalité digitale. Une plateforme intégrée 
            pour concevoir, développer et déployer des solutions logicielles exceptionnelles.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-base px-8 py-6" asChild>
              <Link href="/configurateur">
                Configurer votre projet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6" asChild>
              <Link href="/processus">
                Découvrir notre processus
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 text-muted-foreground">
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="font-medium">{feature.title}</span>
                <span className="text-sm">• {feature.description}</span>
              </div>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 hover:scale-105 hover:border-primary/50"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center space-x-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="text-sm">100% de satisfaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Certifié ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-sm">Lancement garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero