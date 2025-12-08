"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"

interface ClientProfile {
  email: string
  company: string
  contactName: string
  phone: string
  country: string
  website?: string
}

export default function ClientProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchProfile(session.user.id)
    } else if (status === "unauthenticated") {
      setLoading(false)
      setError("Vous devez être connecté pour accéder à cette page.")
    }
  }, [status, session])

  const fetchProfile = async (clientId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/client/profile?clientId=${clientId}`)
      if (!res.ok) {
        throw new Error("Échec du chargement du profil.")
      }
      const data = await res.json()
      setProfile(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.id]: e.target.value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile || !session?.user?.id) return

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch(`/api/client/profile?clientId=${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (!res.ok) {
        throw new Error("Échec de la mise à jour du profil.")
      }
      setSuccessMessage("Profil mis à jour avec succès !")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        <p className="mt-4 text-gray-400">Chargement du profil...</p>
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

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Profil introuvable</AlertTitle>
          <AlertDescription>Impossible de charger les données du profil.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Mon profil</CardTitle>
          <CardDescription className="text-gray-400">Gérez vos informations personnelles et celles de votre entreprise.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <Alert className="bg-green-900 border-green-700 text-white">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-700 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nom du contact</Label>
                <Input id="contactName" value={profile.contactName} onChange={handleChange} required className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Nom de l'entreprise</Label>
                <Input id="company" value={profile.company} onChange={handleChange} required className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} disabled className="bg-gray-700 border-gray-700 text-gray-400 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" value={profile.phone} onChange={handleChange} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input id="country" value={profile.country} onChange={handleChange} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site Web (optionnel)</Label>
                <Input id="website" value={profile.website || ""} onChange={handleChange} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
            </div>
            <Button type="submit" className="bg-gray-700 hover:bg-gray-600 w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Mettre à jour le profil"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}