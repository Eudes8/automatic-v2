"use client"

import React from 'react'

interface Step {
  id: string
  title: string
  description?: string
  date?: string
}

const ProcessRoadmap: React.FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <div className="space-y-6">
      {steps.map((s, idx) => (
        <div key={s.id} className="flex items-start space-x-4">
          <div className="w-8 flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-primary mt-1" />
            {idx !== steps.length - 1 && <div className="w-px h-full bg-border mt-2" />}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
              {s.date && <span className="text-xs text-muted-foreground">{s.date}</span>}
            </div>
            {s.description && <p className="text-sm text-muted-foreground mt-1">{s.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProcessRoadmap
