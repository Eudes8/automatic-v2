"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  MessageSquare, 
  FileText, 
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Code,
  Zap,
  Target,
  Activity,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface ProjectData {
  id: string
  name: string
  description: string
  status: 'planning' | 'development' | 'testing' | 'deployment' | 'completed'
  progress: number
  startDate: string
  endDate: string
  budget: number
  spent: number
  team: TeamMember[]
  milestones: Milestone[]
  lastUpdate: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: 'online' | 'offline' | 'busy'
}

interface Milestone {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  dueDate: string
  completedDate?: string
}

const ClientDashboard = () => {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const res = await fetch('/api/projects')
        if (!res.ok) throw new Error('Failed to fetch projects')
        const data = await res.json()
        if (mounted) {
          setProjects(data)
          if (data && data.length) setSelectedProject(data[0])
        }
      } catch (err) {
        console.error('Error loading projects:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'development': return 'bg-purple-100 text-purple-800'
      case 'testing': return 'bg-orange-100 text-orange-800'
      case 'deployment': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-emerald-100 text-emerald-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planning': return 'Planification'
      case 'development': return 'Développement'
      case 'testing': return 'Tests'
      case 'deployment': return 'Déploiement'
      case 'completed': return 'Terminé'
      default: return 'Inconnu'
    }
  }

  const getMilestoneStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />
      case 'delayed': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Target className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/client/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">AUTOMATIC</span>
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/client/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Tableau de bord
                </Link>
                <Link href="/client/projects" className="text-foreground hover:text-primary transition-colors">
                  Projets
                </Link>
                <Link href="/client/messages" className="text-foreground hover:text-primary transition-colors">
                  Messages
                </Link>
                <Link href="/client/files" className="text-foreground hover:text-primary transition-colors">
                  Fichiers
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue dans votre espace client
          </h1>
          <p className="text-muted-foreground">
            Suivez l'avancement de vos projets et communiquez avec notre équipe.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projets actifs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground">
                +0 ce mois
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progression globale</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedProject ? `${selectedProject.progress}%` : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% cette semaine
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget utilisé</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedProject ? `${(selectedProject.spent / selectedProject.budget * 100).toFixed(0)}%` : '0%'}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedProject ? `${selectedProject.spent.toLocaleString('fr-FR')}€ / ${selectedProject.budget.toLocaleString('fr-FR')}€` : '0€'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipe assignée</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedProject ? selectedProject.team.length : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedProject ? `${selectedProject.team.filter(m => m.status === 'online').length} en ligne` : '0 en ligne'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Overview */}
            {selectedProject && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="w-5 h-5" />
                      <span>{selectedProject.name}</span>
                    </CardTitle>
                    <Badge className={getStatusColor(selectedProject.status)}>
                      {getStatusText(selectedProject.status)}
                    </Badge>
                  </div>
                  <CardDescription>
                    {selectedProject.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progression globale</span>
                      <span className="text-sm text-muted-foreground">{selectedProject.progress}%</span>
                    </div>
                    <Progress value={selectedProject.progress} className="h-2" />
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Date de début</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedProject.startDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Date de fin prévue</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedProject.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Budget</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Budget total:</span>
                        <span>{selectedProject.budget.toLocaleString('fr-FR')}€</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Dépensé:</span>
                        <span className="text-primary">{selectedProject.spent.toLocaleString('fr-FR')}€</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Restant:</span>
                        <span>{(selectedProject.budget - selectedProject.spent).toLocaleString('fr-FR')}€</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Milestones */}
            {selectedProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>Jalons du projet</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedProject.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        {getMilestoneStatusIcon(milestone.status)}
                        <div className="flex-1">
                          <div className="font-medium">{milestone.title}</div>
                          <div className="text-sm text-muted-foreground">{milestone.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Échéance: {new Date(milestone.dueDate).toLocaleDateString('fr-FR')}
                            {milestone.completedDate && ` • Terminé: ${new Date(milestone.completedDate).toLocaleDateString('fr-FR')}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            {selectedProject && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Équipe projet</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedProject.team.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {member.avatar}
                          </div>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                            member.status === 'online' ? 'bg-green-500' :
                            member.status === 'busy' ? 'bg-orange-500' :
                            'bg-gray-400'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/client/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter l'équipe
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/client/files">
                    <FileText className="w-4 h-4 mr-2" />
                    Voir les fichiers
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/client/calendar">
                    <Calendar className="w-4 h-4 mr-2" />
                    Planifier une réunion
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm">Nouvelle livraison disponible</div>
                      <div className="text-xs text-muted-foreground">Il y a 2 heures</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm">Jalon "Design UX/UI" terminé</div>
                      <div className="text-xs text-muted-foreground">Hier</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm">Message de Thomas Martin</div>
                      <div className="text-xs text-muted-foreground">Il y a 3 jours</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ClientDashboard