"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
  description: string
  href?: string
  icon?: React.ComponentType<any>
}

const ServiceCard: React.FC<Props> = ({ title, description, href = '#', icon: Icon }) => {
  return (
    <div className="rounded-lg border border-border/40 bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
          {Icon ? <Icon className="w-6 h-6 text-primary" /> : <div className="w-6 h-6 bg-primary rounded" />}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div>
            <Button variant="ghost" asChild>
              <Link href={href}>En savoir plus</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
