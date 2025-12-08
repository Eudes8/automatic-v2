"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [company, setCompany] = useState("")
  const [contactName, setContactName] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      return
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, company, contactName, phone, country }),
    })

    if (res.ok) {
      router.push("/client/login")
    } else {
      const data = await res.json()
      setError(data.message || "Une erreur est survenue.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <Card className="w-full max-w-lg bg-gray-900 text-white border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>Rejoignez AUTOMATIC pour gérer vos projets.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-700 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Nom du contact</Label>
                <Input id="contactName" required value={contactName} onChange={(e) => setContactName(e.target.value)} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input id="company" required value={company} onChange={(e) => setCompany(e.target.value)} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" required value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input id="country" required value={country} onChange={(e) => setCountry(e.target.value)} className="bg-gray-800 border-gray-700 focus:ring-gray-600" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-gray-700 hover:bg-gray-600">
              Créer un compte
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}