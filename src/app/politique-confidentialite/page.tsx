"use client"

import React from 'react'

const PolitiqueConfidentialite = () => {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Politique de confidentialité</h1>
        <p className="mb-4 text-muted-foreground">
          AUTOMATIC prend la protection de vos données personnelles au sérieux. Cette politique décrit quelles informations
          nous collectons, pourquoi nous les utilisons et les choix dont vous disposez.
        </p>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Données collectées</h2>
          <p className="text-muted-foreground">Nous collectons les informations que vous nous fournissez volontairement (par exemple via le formulaire de contact) et les données techniques nécessaires au fonctionnement du service (logs, cookies, etc.).</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Utilisation des données</h2>
          <p className="text-muted-foreground">Vos données servent à répondre à vos demandes, fournir les services contractuels, gérer la facturation et assurer la sécurité du service.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Vos droits</h2>
          <p className="text-muted-foreground">Vous pouvez accéder à vos données, demander leur rectification ou suppression, et exercer d'autres droits tels que définis par la réglementation applicable.</p>
        </section>

        <p className="text-sm text-muted-foreground">Pour toute demande relative à vos données personnelles, contactez-nous via la page Contact.</p>
      </div>
    </div>
  )
}

export default PolitiqueConfidentialite