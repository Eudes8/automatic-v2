"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface Project {
  id: string
  clientId?: string
  name: string
  description?: string
  status?: string
  progress?: number
  startDate?: string | null
  endDate?: string | null
  budget?: number | null
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/client/projects/${id}?clientId=test-client`)
        if (!res.ok) throw new Error("Échec du chargement du projet")
        const data = await res.json()
        setProject(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const handleSave = async () => {
    if (!project) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/client/projects/${id}?clientId=test-client`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: project.name, description: project.description, progress: project.progress, budget: project.budget })
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || "Erreur lors de la mise à jour")
      }
      const updated = await res.json()
      setProject(updated)
      // navigate back to list or stay
      router.push('/client/projects')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer ce projet ?")) return
    try {
      const res = await fetch(`/api/client/projects/${id}?clientId=test-client`, { method: "DELETE" })
      if (!(res.status === 204 || res.ok)) {
        throw new Error("Échec de la suppression")
      }
      router.push('/client/projects')
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) return <div className="p-6">Chargement...</div>

  if (error) return (
    <div className="p-6">
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  )

  if (!project) return <div className="p-6">Projet non trouvé</div>

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Projet</CardTitle>
          <CardDescription>{project.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={project.name} onChange={(e) => setProject({ ...project, name: (e.target as HTMLInputElement).value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={project.description || ""} onChange={(e) => setProject({ ...project, description: (e.target as HTMLInputElement).value })} />
            </div>
            <div>
              <Label>Progression (%)</Label>
              <Input type="number" value={project.progress ?? 0} onChange={(e) => setProject({ ...project, progress: Number((e.target as HTMLInputElement).value) })} />
            </div>
            <div className="flex justify-between">
              <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
