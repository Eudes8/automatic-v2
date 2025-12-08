"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Send, ArrowRight, Users, Headset, Building, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    type: 'commercial'
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Erreur lors de l\'envoi')

      setSubmitted(true)
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '', type: 'commercial' })
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Message envoyé !</CardTitle>
            <CardDescription>Nous vous répondrons dans les plus brefs délais.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">Merci pour votre intérêt. Notre équipe va étudier votre demande et vous recontactera rapidement.</p>
            <div className="flex space-x-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/">Retour à l'accueil</Link>
              </Button>
              <Button asChild>
                <Link href="/configurateur">Configurer un projet <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Contactez-nous</h1>
        <p className="text-muted-foreground mb-6">Remplissez le formulaire et notre équipe reviendra vers vous rapidement.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Nom</Label>
              <Input value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Société</Label>
            <Input value={formData.company} onChange={e => handleInputChange('company', e.target.value)} />
          </div>
          <div>
            <Label>Sujet</Label>
            <Input value={formData.subject} onChange={e => handleInputChange('subject', e.target.value)} />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea value={formData.message} onChange={e => handleInputChange('message', e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <Button type="submit" disabled={loading}>{loading ? 'Envoi...' : 'Envoyer'}</Button>
            <Button variant="ghost" asChild>
              <Link href="/">Annuler</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Contact