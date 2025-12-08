"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FolderKanban,
  Loader2,
  AlertCircle,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProjectData {
  id: string
  name: string
  description: string
  status: string // e.g., 'planning', 'development', 'testing', 'deployment', 'completed'
  progress: number // 0-100
  startDate: string
  endDate: string
  budget: number // in cents
  spent: number // in cents
  team: { name: string; role: string; avatar: string }[]
  milestones: { title: string; dueDate: string; status: string }[]
  lastUpdate: string
}

export default function ClientProjectsPage() {
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchProjects(session.user.id)
    } else if (status === "unauthenticated") {
      setLoading(false)
      setError("Vous devez être connecté pour accéder à cette page.")
    }
  }, [status, session])

  const fetchProjects = async (clientId?: string) => {
    try {
      setLoading(true)
      setError(null)
      const id = clientId || session?.user?.id
      if (!id) throw new Error("No client ID available")
      
      const res = await fetch(`/api/client/projects?clientId=${id}`)
      if (!res.ok) {
        throw new Error("Échec du chargement des projets.")
      }
      const data = await res.json()
      setProjects(data)
    } catch (err: any) {
      console.error("fetchProjects error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchProjects()
  }

  const getStatusBadgeVariant = (projectStatus: string) => {
    switch (projectStatus) {
      case "completed":
        return "default"
      case "development":
        return "secondary"
      case "testing":
        return "destructive"
      case "deployment":
        return "outline"
      case "planning":
        return "default"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-400">Chargement des projets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader className="flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold flex items-center gap-2"><FolderKanban className="w-7 h-7" /> Mes Projets</CardTitle>
            <CardDescription className="text-gray-400">Aperçu et suivi de tous vos projets en cours et terminés.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" className="bg-gray-700 hover:bg-gray-600 border-gray-600">
              Rafraîchir
            </Button>
            <Button asChild className="bg-gray-700 hover:bg-gray-600">
              <Link href="/client/projects/new">Nouveau Projet</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>Vous n'avez pas encore de projets actifs.</p>
              <p className="mt-2">Lancez votre premier projet dès aujourd'hui !</p>
              <Button asChild className="mt-6 bg-gray-700 hover:bg-gray-600">
                <Link href="/onboarding">Créer une proposition</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge variant={getStatusBadgeVariant(project.status)}>{project.status}</Badge>
                    </div>
                    <CardDescription className="text-gray-400 line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.startDate).toLocaleDateString("fr-FR")}</span>
                      </div>
                      {project.budget > 0 && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>{(project.budget / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</span>
                        </div>
                      )}
                    </div>
                    {project.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm text-gray-300">
                          <span>Progression</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 bg-gray-700" />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <Link href={`/client/projects/${project.id}`}>
                        <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto">
                          Voir détails <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}