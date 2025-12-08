"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Code2, 
  Smartphone, 
  Cloud, 
  Brain, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Globe,
  Database,
  Cpu,
  BarChart3,
  Users,
  Clock,
  Star
} from 'lucide-react'
import Link from 'next/link'

const Services = () => {
  const services = [
    {
      icon: Code2,
      title: "Applications Web",
      description: "Solutions web modernes, rapides et évolutives",
      color: "from-blue-500 to-cyan-500",
      features: [
        "React/Next.js & TypeScript",
        "Design responsive & accessible",
        "Performance optimisée",
        "SEO intégré",
        "Maintenance continue"
      ],
      pricing: "À partir de 15 000€",
      duration: "6-12 semaines",
      popular: true
    },
    {
      icon: Smartphone,
      title: "Applications Mobiles",
      description: "Applications iOS et Android natives performantes",
      color: "from-green-500 to-emerald-500",
      features: [
        "React Native & Flutter",
        "Expérience native optimale",
        "Offline-first",
        "Push notifications",
        "App Store optimisation"
      ],
      pricing: "À partir de 20 000€",
      duration: "8-16 semaines",
      popular: false
    },
    {
      icon: Cloud,
      title: "Plateformes SaaS",
      description: "Solutions cloud évolutives et sécurisées",
      color: "from-purple-500 to-pink-500",
      features: [
        "Architecture microservices",
        "Scalabilité automatique",
        "Multi-tenancy",
        "API RESTful",
        "Monitoring avancé"
      ],
      pricing: "À partir de 25 000€",
      duration: "10-20 semaines",
      popular: false
    },
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Solutions IA personnalisées et innovantes",
      color: "from-orange-500 to-red-500",
      features: [
        "Machine Learning & Deep Learning",
        "Traitement NLP",
        "Computer Vision",
        "Predictive Analytics",
        "MLOps intégrés"
      ],
      pricing: "À partir de 30 000€",
      duration: "12-24 semaines",
      popular: false
    }
  ]

  const technologies = [
    { name: "React/Next.js", category: "Frontend" },
    { name: "TypeScript", category: "Langage" },
    { name: "Node.js", category: "Backend" },
    { name: "PostgreSQL", category: "Base de données" },
    { name: "AWS/GCP", category: "Cloud" },
    { name: "Docker/K8s", category: "DevOps" },
    { name: "Python", category: "IA/ML" },
    { name: "GraphQL", category: "API" }
  ]

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Nos Services
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Des solutions sur mesure pour
            <span className="text-primary"> votre ambition</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            De la conception à la livraison, nous transformons vos idées en 
            produits digitaux exceptionnels avec les technologies les plus modernes.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className={`relative overflow-hidden border-2 ${service.popular ? 'border-primary/50' : 'border-border/50'} hover:shadow-2xl transition-all duration-300 group`}>
              {service.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div>
                    <div className="text-lg font-semibold text-foreground">{service.pricing}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {service.duration}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/services/${service.title.toLowerCase().replace(' applications ', '').replace(' plateformes ', '').replace(' intelligence ', '')}`}>
                      En savoir plus
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technologies Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
            Technologies que nous maîtrisons
          </h3>
          <p className="text-muted-foreground mb-8">
            Nous utilisons les meilleures technologies pour garantir la performance et la pérennité de vos projets
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {technologies.map((tech, index) => (
            <div key={index} className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-all duration-300 text-center">
              <div className="text-sm font-medium text-foreground">{tech.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{tech.category}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 lg:p-12">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Prêt à démarrer votre projet ?
            </h3>
            <p className="text-muted-foreground mb-6">
              Configurez votre projet en quelques minutes et recevez une proposition détaillée gratuitement.
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
                  Contacter un expert
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services