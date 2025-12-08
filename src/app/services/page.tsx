import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Code2, 
  Smartphone, 
  Cloud, 
  Brain, 
  CheckCircle2,
  Clock,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Star,
  TrendingUp,
  Award
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Services - AUTOMATIC | Développement Logiciel sur-Mesure",
  description: "Découvrez nos services complets de développement logiciel : applications web, mobiles, plateformes SaaS et solutions IA.",
}

const services = [
  {
    id: "web",
    icon: Code2,
    title: "Applications Web",
    description: "Solutions web modernes, rapides et évolutives",
    color: "from-blue-500 to-cyan-500",
    image: "/api/placeholder/600/400",
    longDescription: "Nous développons des applications web sur mesure qui transforment vos idées en expériences digitales exceptionnelles. Notre approche combine les dernières technologies avec des meilleures pratiques pour garantir performance, sécurité et évolutivité.",
    features: [
      "React/Next.js & TypeScript",
      "Design responsive & accessible",
      "Performance optimisée (Core Web Vitals)",
      "SEO intégré et référencement naturel",
      "Maintenance continue et monitoring",
      "Intégration avec vos systèmes existants"
    ],
    deliverables: [
      "Application web production-ready",
      "Dashboard d'administration",
      "Documentation technique complète",
      "Tests automatisés",
      "Support 3 mois inclus"
    ],
    pricing: {
      base: "15 000€",
      timeline: "6-12 semaines",
      includes: "Design, développement, tests, déploiement"
    },
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Docker"],
    process: [
      "Découverte et cahier des charges",
      "Design UX/UI et prototypage",
      "Développement agile (sprints de 2 semaines)",
      "Tests et recette utilisateur",
      "Déploiement et formation"
    ],
    caseStudies: [
      {
        title: "Plateforme e-commerce B2B",
        client: "Industrie automobile",
        result: "Augmentation des ventes de 40%",
        tech: ["Next.js", "Stripe", "PostgreSQL"]
      },
      {
        title: "SaaS de gestion de projet",
        client: "Startup tech",
        result: "1000+ utilisateurs actifs",
        tech: ["React", "Node.js", "MongoDB"]
      }
    ]
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Applications Mobiles",
    description: "Applications iOS et Android natives performantes",
    color: "from-green-500 to-emerald-500",
    image: "/api/placeholder/600/400",
    longDescription: "Créons des applications mobiles qui offrent une expérience utilisateur exceptionnelle sur iOS et Android. Notre expertise couvre le développement natif et cross-platform pour répondre à vos besoins spécifiques.",
    features: [
      "React Native & Flutter",
      "Expérience native optimale",
      "Offline-first et synchronisation",
      "Push notifications ciblées",
      "App Store optimisation (ASO)",
      "Analytics et suivi utilisateur"
    ],
    deliverables: [
      "Applications iOS et Android",
      "Backend API RESTful",
      "Console d'administration",
      "Documentation de déploiement",
      "Support technique 6 mois"
    ],
    pricing: {
      base: "20 000€",
      timeline: "8-16 semaines",
      includes: "Design, développement natif, tests, publication"
    },
    technologies: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase", "AWS", "Node.js"],
    process: [
      "Analyse des besoins utilisateurs",
      "Design mobile-first",
      "Développement itératif",
      "Tests sur appareils réels",
      "Publication stores et marketing"
    ],
    caseStudies: [
      {
        title: "App de livraison de repas",
        client: "Restaurant chain",
        result: "50K+ téléchargements",
        tech: ["React Native", "Google Maps", "Stripe"]
      }
    ]
  },
  {
    id: "saas",
    icon: Cloud,
    title: "Plateformes SaaS",
    description: "Solutions cloud évolutives et sécurisées",
    color: "from-purple-500 to-pink-500",
    image: "/api/placeholder/600/400",
    longDescription: "Bâtissons des plateformes SaaS robustes qui évoluent avec votre croissance. Notre expertise en architecture cloud garantit performance, sécurité et scalabilité pour des milliers d'utilisateurs.",
    features: [
      "Architecture microservices",
      "Scalabilité automatique",
      "Multi-tenancy et isolation",
      "API RESTful et GraphQL",
      "Monitoring avancé et alerting",
      "Sauvegarde et recovery plan"
    ],
    deliverables: [
      "Plateforme SaaS complète",
      "API documentation",
      "Monitoring dashboard",
      "Infrastructure as Code",
      "Support 24/7 optionnel"
    ],
    pricing: {
      base: "25 000€",
      timeline: "10-20 semaines",
      includes: "Architecture, développement, infrastructure, monitoring"
    },
    technologies: ["Kubernetes", "Docker", "AWS/GCP", "Terraform", "Prometheus", "Grafana", "PostgreSQL"],
    process: [
      "Architecture design",
      "MVP développement",
      "Beta testing avec utilisateurs",
      "Scaling progressif",
      "Optimisation performance"
    ],
    caseStudies: [
      {
        title: "CRM pour agences immobilières",
        client: "PropTech startup",
        result: "200+ agences clientes",
        tech: ["Kubernetes", "React", "Node.js", "PostgreSQL"]
      }
    ]
  },
  {
    id: "ai",
    icon: Brain,
    title: "Intelligence Artificielle",
    description: "Solutions IA personnalisées et innovantes",
    color: "from-orange-500 to-red-500",
    image: "/api/placeholder/600/400",
    longDescription: "Intégrez l'intelligence artificielle dans vos processus métier. De la prédiction à l'automatisation, nous développons des solutions IA qui créent de la valeur réelle.",
    features: [
      "Machine Learning & Deep Learning",
      "Traitement NLP avancé",
      "Computer Vision et reconnaissance",
      "Predictive Analytics",
      "MLOps et automatisation",
      "Interprétabilité et éthique IA"
    ],
    deliverables: [
      "Modèles IA optimisés",
      "API de prédiction",
      "Dashboard d'analyse",
      "Documentation de modèles",
      "Formation équipes internes"
    ],
    pricing: {
      base: "30 000€",
      timeline: "12-24 semaines",
      includes: "R&D, modélisation, intégration, déploiement"
    },
    technologies: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "MLflow", "Kubeflow", "AWS SageMaker"],
    process: [
      "Data discovery et analyse",
      "Prototypage rapide",
      "Entraînement et validation",
      "Intégration production",
      "Monitoring et amélioration continue"
    ],
    caseStudies: [
      {
        title: "Prédiction churn clients",
        client: "Telecom company",
        result: "Réduction churn de 25%",
        tech: ["Python", "TensorFlow", "AWS", "Tableau"]
      }
    ]
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Nos Services
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Des solutions sur mesure pour
              <span className="text-primary"> votre ambition</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              De la stratégie à la réalisation, nous accompagnons votre transformation digitale 
              avec expertise et innovation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/configurateur">
                  Configurer votre projet
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
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={service.id} className="scroll-mt-24" id={service.id}>
                <Card className="overflow-hidden border-2 border-border/50 hover:border-primary/50 transition-all duration-300">
                  <div className="lg:grid lg:grid-cols-2 gap-8">
                    {/* Image Section */}
                    <div className="relative h-64 lg:h-auto bg-gradient-to-br from-muted to-muted/50">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                          <service.icon className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        <Badge variant="secondary">{service.title}</Badge>
                      </div>

                      <h2 className="text-3xl font-bold text-foreground mb-4">{service.title}</h2>
                      <p className="text-lg text-muted-foreground mb-6">{service.longDescription}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-sm">{service.pricing.timeline}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold">{service.pricing.base}</span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-foreground">Caractéristiques principales</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.features.slice(0, 4).map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center space-x-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild>
                          <Link href={`/configurateur?service=${service.id}`}>
                            Démarrer avec ce service
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/services/${service.id}`}>
                            Voir les détails
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Prêt à transformer votre vision en réalité ?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Discutons de votre projet et recevez une proposition détaillée en 48h.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/configurateur">
                  Lancer le configurateur
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
    </div>
  )
}