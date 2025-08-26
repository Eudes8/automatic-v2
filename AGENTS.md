# Directives pour le développement du projet AUTOMATIC

Ce document guide les agents IA (comme Jules) dans le développement du site web pour l'entreprise AUTOMATIC.

## 1. Contexte du projet

Le projet est de construire une plateforme web complète pour l'entreprise de développement de logiciels "AUTOMATIC". Le site n'est pas seulement une vitrine, mais l'outil de travail principal pour la gestion des projets et la communication avec les clients.

## 2. Piliers de l'application

L'application se divise en trois grandes parties :

1.  **Site Vitrine (Public) :**
    *   Présentation de l'entreprise, des services, des projets réalisés.
    *   Formulaire de contact.
    *   Accessible à tous.

2.  **Espace Client (Protégé par authentification) :**
    *   Connexion sécurisée.
    *   Tableau de bord listant les projets du client.
    *   Page de détail par projet avec :
        *   Un système de messagerie pour les échanges.
        *   Un espace pour le dépôt et le téléchargement de fichiers (livrables, documents).
        *   Suivi de l'avancement du projet.

3.  **Espace Admin (Protégé par authentification) :**
    *   Gestion des clients (création, modification).
    *   Gestion des projets (création, assignation à un client, mise à jour du statut).
    *   Vue d'ensemble de tous les échanges.

## 3. Stack Technique

Le projet doit être développé en utilisant les technologies Open Source suivantes :

*   **Framework Principal :** Next.js avec le App Router.
*   **Langage :** TypeScript.
*   **Base de données :** PostgreSQL.
*   **ORM :** Prisma pour interagir avec la base de données.
*   **Authentification :** NextAuth.js (Auth.js).
*   **Styling :** Tailwind CSS.
*   **Dépendances :** Gérer les dépendances avec `npm`.

## 4. Instructions de développement

*   **Initialisation :** Le projet sera initialisé avec `npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`.
*   **Installation des dépendances :** `npm install`.
*   **Lancement du serveur de développement :** `npm run dev`.
*   **Structure des fichiers :**
    *   Les pages publiques seront à la racine de `src/app/`.
    *   Les pages de l'espace client seront dans `src/app/client/`.
    *   Les pages de l'espace admin seront dans `src/app/admin/`.
    *   Les composants réutilisables seront dans `src/components/`.
*   **Tests :** Des tests devront être ajoutés pour les fonctionnalités critiques.
*   **Qualité du code :** Le code doit être clair, commenté si nécessaire, et suivre les conventions de nommage.
