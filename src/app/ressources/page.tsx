"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  BookOpen,
  Download,
  ArrowRight,
  Filter,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  Code,
  Smartphone,
  Cloud,
  Brain
} from 'lucide-react'
import Link from 'next/link'

const Ressources = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Toutes les ressources', icon: BookOpen },
    { id: 'guides', name: 'Guides', icon: BookOpen },
    { id: 'tutorials', name: 'Tutoriels', icon: Code },
    { id: 'webinars', name: 'Webinaires', icon: Zap },
    { id: 'case-studies', name: 'Études de cas', icon: Target },
    { id: 'whitepapers', name: 'Livres blancs', icon: Lightbulb }
  ]

  const articles = [
    {
      id: 1,
      title: "Guide complet du développement web moderne",
      excerpt: "Découvrez les meilleures pratiques et technologies pour créer des applications web performantes et évolutives.",
      category: "guides",
      author: "Marie Dubois",
      date: "2024-01-15",
      readTime: "15 min",
      image: "/api/placeholder/400/250",
      tags: ["React", "Next.js", "TypeScript", "Performance"],
      featured: true,
      downloads: 1234
    },
    {
      id: 2,
      title: "Comment choisir la bonne architecture pour votre SaaS",
      excerpt: "Analyse comparative des architectures microservices vs monolithes pour les applications SaaS.",
      category: "whitepapers",
      author: "Thomas Martin",
      date: "2024-01-10",
      readTime: "20 min",
      image: "/api/placeholder/400/250",
      tags: ["Architecture", "SaaS", "Cloud", "Scalabilité"],
      featured: true,
      downloads: 892
    },
    {
      id: 3,
      title: "Tutoriel : Créer une application mobile avec React Native",
      excerpt: "Pas à pas pour développer votre première application iOS et Android avec React Native.",
      category: "tutorials",
      author: "Sophie Bernard",
      date: "2024-01-08",
      readTime: "25 min",
      image: "/api/placeholder/400/250",
      tags: ["React Native", "Mobile", "iOS", "Android"],
      featured: false,
      downloads: 567
    },
    {
      id: 4,
      title: "Étude de cas : Migration d'une legacy app vers le cloud",
      excerpt: "Comment nous avons aidé une entreprise du CAC 40 à moderniser son infrastructure applicative.",
      category: "case-studies",
      author: "Jean-Pierre Laurent",
      date: "2024-01-05",
      readTime: "18 min",
      image: "/api/placeholder/400/250",
      tags: ["Cloud", "Migration", "AWS", "DevOps"],
      featured: false,
      downloads: 445
    },
    {
      id: 5,
      title: "Webinaire : L'IA au service du développement logiciel",
      excerpt: "Découvrez comment l'intelligence artificielle transforme les pratiques de développement.",
      category: "webinars",
      author: "Dr. Claire Moreau",
      date: "2024-01-03",
      readTime: "45 min",
      image: "/api/placeholder/400/250",
      tags: ["IA", "Machine Learning", "Productivité", "Innovation"],
      featured: true,
      downloads: 789
    },
    {
      id: 6,
      title: "Les tendances tech 2024 : Ce qu'il faut savoir",
      excerpt: "Analyse des technologies émergentes qui vont impacter le développement logiciel cette année.",
      category: "guides",
      author: "Lucas Petit",
      date: "2024-01-01",
      readTime: "12 min",
      image: "/api/placeholder/400/250",
      tags: ["Tendances", "2024", "Innovation", "Tech"],
      featured: false,
      downloads: 334
    }
  ]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const featuredArticles = articles.filter(article => article.featured)

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : BookOpen
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Autre'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Centre de Ressources
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Expertise et
              <span className="text-primary"> savoir-faire partagés</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Accédez à notre collection de guides, tutoriels et études de cas 
              pour accélérer votre transformation digitale.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Rechercher des articles, guides, tutoriels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      {selectedCategory === 'all' && searchTerm === '' && (
        <section className="py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Contenu mis en avant
              </h2>
              <p className="text-lg text-muted-foreground">
                Nos ressources les plus populaires et pertinentes
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.slice(0, 2).map((article) => (
                <Card key={article.id} className="overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
                  <div className="relative h-48 bg-gradient-to-br from-muted to-muted/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                        {(() => {
                          const Icon = getCategoryIcon(article.category)
                          return <Icon className="w-8 h-8 text-primary" />
                        })()}
                      </div>
                    </div>
                    <Badge className="absolute top-4 left-4">
                      {getCategoryName(article.category)}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{article.excerpt}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(article.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        Lire l'article
                        <ArrowRight className="ml-2 w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        {article.downloads}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? `Résultats (${filteredArticles.length})` 
                : 'Toutes les ressources'}
            </h2>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-muted-foreground mb-4">
                Essayez de modifier votre recherche ou votre filtre
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        {(() => {
                          const Icon = getCategoryIcon(article.category)
                          return <Icon className="w-6 h-6 text-primary" />
                        })()}
                      </div>
                    </div>
                    <Badge variant="secondary" className="absolute top-2 left-2 text-xs">
                      {getCategoryName(article.category)}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Lire
                      </Button>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Download className="w-3 h-3" />
                        <span>{article.downloads}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Restez informé de nos dernières publications
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Recevez chaque semaine notre sélection des meilleurs articles et ressources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1"
              />
              <Button>
                S'abonner
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Ressources