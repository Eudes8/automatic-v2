"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Menu, 
  Code2, 
  Smartphone, 
  Cloud, 
  Brain, 
  ArrowRight,
  Zap,
  Shield,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { t } = useTranslations()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // navigation items will use translations
  const navigationItems = [
    {
      titleKey: "nav.services",
      items: [
        {
          key: "services_list.web",
          icon: Code2,
          href: "/services/web"
        },
        {
          key: "services_list.mobile",
          icon: Smartphone,
          href: "/services/mobile"
        },
        {
          key: "services_list.saas",
          icon: Cloud,
          href: "/services/saas"
        },
        {
          key: "services_list.ai",
          icon: Brain,
          href: "/services/ai"
        }
      ]
    },
    {
      titleKey: "nav.processus",
      href: "/processus"
    },
    {
      titleKey: "nav.tarifs",
      href: "/tarifs"
    },
    {
      titleKey: "nav.ressources",
      href: "/ressources"
    }
  ]

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "glass-effect border-b border-border/50" : "bg-transparent"
    )}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AUTOMATIC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-8">
                {navigationItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.items ? (
                      <>
                        <NavigationMenuTrigger className="text-foreground hover:text-primary bg-transparent">
                          {t(item.titleKey)}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid w-[400px] gap-3 p-6 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.items.map((subItem, subIndex) => (
                              <NavigationMenuLink key={subIndex} asChild>
                                <Link
                                  href={subItem.href}
                                  className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="flex items-center space-x-2">
                                    <subItem.icon className="w-4 h-4 text-primary" />
                                    <div className="text-sm font-medium leading-none">
                                      {t(`${subItem.key}.title`)}
                                    </div>
                                  </div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {t(`${subItem.key}.description`)}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {t(item.titleKey)}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link href="/connexion">{t('nav.connexion')}</Link>
              </Button>
              <Button asChild>
                <Link href="/configurateur">
                  {t('nav.demarrer')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item, index) => (
                    <div key={index}>
                      {item.items ? (
                        <div className="space-y-3">
                          <h3 className="font-semibold text-foreground">{t(item.titleKey)}</h3>
                          <div className="pl-4 space-y-2">
                            {item.items.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                <subItem.icon className="w-4 h-4" />
                                <div>
                                      <div className="text-sm font-medium">{t(`${subItem.key}.title`)}</div>
                                  <div className="text-xs">{t(`${subItem.key}.description`)}</div> 
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          {t(item.titleKey)}
                        </Link>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/connexion" onClick={() => setIsOpen(false)}>
                        Connexion
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link href="/configurateur" onClick={() => setIsOpen(false)}>
                        Démarrer un projet
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar