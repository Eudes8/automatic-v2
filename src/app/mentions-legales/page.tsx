"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Users,
  FileText,
  Award,
  Globe
} from 'lucide-react'
import Link from 'next/link'

const MentionsLegales = () => {
  const companyInfo = {
    name: 'AUTOMATIC',
    legalForm: 'SAS',
    capital: '50 000€',
    siret: '12345678901234',
    rcs: 'Paris 123456789',
    address: '456 Avenue de l\'Innovation, 75002 Paris, France',
    phone: '+33 1 23 45 67 89',
    email: 'contact@automatic.dev',
    website: 'https://automatic.dev',
    registrationDate: '15/01/2024'
  }

  const management = {
    ceo: 'Alexandre Martin',
    ceoTitle: 'Président-Directeur Général',
    director: 'Marie Dubois',
    directorTitle: 'Directrice Technique',
    cto: 'Thomas Bernard',
    ctoTitle: 'Directeur de la Technologie'
  }

  const legalInfo = {
    publisher: 'AUTOMATIC',
    director: 'Alexandre Martin',
    hostingProvider: 'OVHcloud',
    hostingAddress: '2 rue Kellermann - BP 80157 - 57053 Metz cedex 3',
    hostingContact: 'legal@ovhcloud.com'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              Mentions Légales
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Informations
              <span className="text-primary"> légales</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Conformément à la loi n°2004-575 du 21 juin 2004 relative à la confiance dans l\'économie numérique.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Éditeur du site</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Société</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Nom:</span> {companyInfo.name}</div>
                      <div><span className="text-muted-foreground">Forme:</span> {companyInfo.legalForm}</div>
                      <div><span className="text-muted-foreground">Capital:</span> {companyInfo.capital}</div>
                      <div><span className="text-muted-foreground">SIRET:</span> {companyInfo.siret}</div>
                      <div><span className="text-muted-foreground">RCS:</span> {companyInfo.rcs}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{companyInfo.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{companyInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{companyInfo.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <span>{companyInfo.website}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <span className="text-muted-foreground">Date d\'immatriculation:</span> {companyInfo.registrationDate}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Direction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">PDG</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{management.ceo}</h4>
                      <p className="text-sm text-muted-foreground">{management.ceoTitle}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">TECH</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{management.director}</h4>
                      <p className="text-sm text-muted-foreground">{management.directorTitle}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">CTO</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{management.cto}</h4>
                      <p className="text-sm text-muted-foreground">{management.ctoTitle}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Informations légales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Hébergeur</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <div><span className="text-muted-foreground">Prestataire:</span> {legalInfo.hostingProvider}</div>
                    <div><span className="text-muted-foreground">Adresse:</span> {legalInfo.hostingAddress}</div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{legalInfo.hostingContact}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Directeur de publication</h4>
                  <div className="text-sm text-muted-foreground">
                    {legalInfo.director}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Conformité RGPD</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      AUTOMATIC s\'engage à protéger la vie privée de ses utilisateurs et à respecter les dispositions du Règlement Général sur la Protection des Données (RGPD) du 27 avril 2016.
                    </p>
                    <p>
                      Les données personnelles collectées via ce site sont traitées de manière confidentielle et utilisées uniquement dans le cadre de la prestation de services. Vous disposez d\'un droit d\'accès, de modification et de suppression de vos données conformément à la législation en vigueur.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intellectual Property */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Propriété intellectuelle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    L\'ensemble des éléments du site web de AUTOMATIC, y compris le design, les textes, les graphiques, les logos, les images et les animations, est la propriété exclusive de AUTOMATIC et est protégé par les lois françaises et internationales sur la propriété intellectuelle.
                  </p>
                  <p>
                    Toute reproduction, distribution, modification, adaptation, traduction, reverse engineering, décompilation, transmission ou autre forme d\'utilisation de tout ou partie du site, sans autorisation écrite préalable d\'AUTOMATIC, est strictement interdite.
                  </p>
                  <p>
                    AUTOMATIC, le logo AUTOMATIC et tous les autres noms de produits, services et fonctionnalités mentionnés sur ce site sont des marques commerciales ou des marques déposées de AUTOMATIC en France et dans d\'autres pays.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Liability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Limitation de responsabilité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    AUTOMATIC s\'efforce de fournir des informations précises et à jour sur ce site web. Cependant, AUTOMATIC ne garantit pas l\'exactitude, l\'exhaustivité ou l\'actualité des informations fournies.
                  </p>
                  <p>
                    AUTOMATIC décline toute responsabilité pour les dommages directs ou indirects découlant de l\'utilisation des informations fournies sur ce site web.
                  </p>
                  <p>
                    Les liens hypertextes vers d\'autres sites web sont fournis à titre informatif seulement. AUTOMATIC n\'exerce aucun contrôle sur ces sites et n\'assume aucune responsabilité pour leur contenu ou leurs politiques de confidentialité.
                  </p>
                  <p>
                    L\'utilisation de ce site web se fait entièrement à vos propres risques. AUTOMATIC ne saurait être tenu responsable des dommages directs ou indirects, y compris la perte de données, résultant de l\'utilisation ou de l\'impossibilité d\'utiliser ce site web.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact for Legal Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Contact pour les questions légales</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-3">
                  <p>
                    Pour toute question concernant ces mentions légales ou pour signaler un contenu illicite, veuillez nous contacter :
                  </p>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>legal@automatic.dev</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Last Update */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Mise à jour</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Dernière mise à jour des mentions légales : 15 janvier 2024
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Ces mentions légales s\'appliquent à l\'ensemble du site web de AUTOMATIC accessible à l\'URL suivante : https://automatic.dev
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link href="/politique-confidentialite" className="hover:text-primary transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Politique de cookies
              </Link>
              <Link href="/cgu" className="hover:text-primary transition-colors">
                CGU
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MentionsLegales