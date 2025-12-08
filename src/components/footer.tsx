"use client"

import React from 'react'
import { useTranslations } from '@/lib/i18n'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  Zap,
  Shield,
  Award,
  ArrowRight
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { t } = useTranslations()

  const navigation = {
    produit: [
      { name: "Applications Web", href: "/services/web" },
      { name: "Applications Mobiles", href: "/services/mobile" },
      { name: "Plateformes SaaS", href: "/services/saas" },
      { name: "Intelligence IA", href: "/services/ai" }
    ],
    entreprise: [
      { name: "Notre Processus", href: "/processus" },
      { name: "Tarifs", href: "/tarifs" },
      { name: "Cas Clients", href: "/cas-clients" },
      { name: "Carrières", href: "/carrieres" }
    ],
    ressources: [
      { name: "Blog", href: "/blog" },
      { name: "Documentation", href: "/documentation" },
      { name: "Guides", href: "/guides" },
      { name: "API", href: "/api" }
    ],
    support: [
      { name: "Centre d'aide", href: "/aide" },
      { name: "Contact", href: "/contact" },
      { name: "Statut", href: "/statut" },
      { name: "Sécurité", href: "/securite" }
    ]
  }

  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/automatic" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/automatic" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/automatic" }
  ]

  const certifications = [
    { icon: Shield, text: "ISO 27001" },
    { icon: Award, text: "GDPR Compliant" },
    { icon: Zap, text: "Performance Certified" }
  ]

  return (
    <footer className="bg-gradient-to-b from-background to-secondary/10 border-t border-border/50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">AUTOMATIC</span>
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t('footer_more.description')}
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href="mailto:contact@automatic.dev" className="hover:text-foreground transition-colors">
                    contact@automatic.dev
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href="tel:+33123456789" className="hover:text-foreground transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Paris, France</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {Object.entries(navigation).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-foreground mb-4 capitalize">
                      {t(`footer.columns.${category}`, '') || (category === 'produit' ? 'Produit' : category === 'entreprise' ? 'Entreprise' : category === 'ressources' ? 'Ressources' : 'Support')}
                    </h3>
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
            <div className="border-t border-border/50 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('footer_more.newsletter_title')}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t('footer_more.newsletter_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t('footer_more.newsletter_placeholder')}
                className="flex-1"
              />
              <Button>
                {t('footer_more.newsletter_subscribe')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="border-t border-border/50 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                  <cert.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{cert.text}</span>
                </div>
              ))}
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {currentYear} AUTOMATIC. Tous droits réservés.
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="border-t border-border/50 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/mentions-legales" className="text-muted-foreground hover:text-foreground transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="text-muted-foreground hover:text-foreground transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/cgu" className="text-muted-foreground hover:text-foreground transition-colors">
                CGU
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </Link>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Fabriqué avec ❤️ en France
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer