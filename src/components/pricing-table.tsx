"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

interface Tier {
  id: string
  title: string
  price: string
  features: string[]
}

const PricingTable: React.FC<{ tiers: Tier[] }> = ({ tiers }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tiers.map((t) => (
        <div key={t.id} className="rounded-lg border border-border/40 p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-2">{t.title}</h3>
          <div className="text-3xl font-bold text-foreground mb-4">{t.price}</div>
          <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
            {t.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full">Choisir</Button>
        </div>
      ))}
    </div>
  )
}

export default PricingTable
