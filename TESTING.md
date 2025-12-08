# Guide de Test End-to-End - Onboarding AUTOMATIC

## Setup Initial

### 1. Appliquer les changements Prisma

```bash
cd /workspaces/automatic-v2

# Générer Prisma Client avec le nouveau champ onboardingStep
npx prisma generate

# Appliquer la migration du schéma DB
npx prisma db push
```

### 2. Seedr les données de test

```bash
# Créer une proposition test + contrat + paiements + conversation
npm run db:seed
```

Output attendu :
```
✓ Created test proposal: <PROPOSAL_ID>
✓ Created test contract: <CONTRACT_ID>
✓ Created test payments (2 paiements)
✓ Created test conversation
✓ Created test contact
```

**Notez le `<PROPOSAL_ID>` et `<CONTRACT_ID>` pour les tests ci-dessous.**

### 3. Lancer le serveur dev

```bash
npm run dev
```

Attendez le message:
```
✓ Ready in 1234ms
```

Serveur disponible : **http://localhost:3000**

---

## Tests End-to-End

### Test 1 : Récupérer la Proposition

**URL :** `GET http://localhost:3000/api/proposals/<PROPOSAL_ID>`

**Résultat attendu :**
```json
{
  "id": "<PROPOSAL_ID>",
  "projectName": "E-commerce Platform Migration",
  "email": "contact@techcorp.example.com",
  "onboardingStep": 0,
  "status": "pending",
  "createdAt": "2025-12-05T...",
  "updatedAt": "2025-12-05T..."
}
```

### Test 2 : Mettre à jour l'étape d'onboarding

**URL :** `PATCH http://localhost:3000/api/proposals/<PROPOSAL_ID>/onboarding`

**Body :**
```json
{
  "step": 2
}
```

**Résultat attendu :**
```json
{
  "success": true,
  "data": {
    "id": "<PROPOSAL_ID>",
    "onboardingStep": 2,
    "status": "pending",
    "email": "contact@techcorp.example.com"
  }
}
```

### Test 3 : Récupérer le Contrat

**URL :** `GET http://localhost:3000/api/contracts/<CONTRACT_ID>`

**Résultat attendu :**
```json
{
  "id": "<CONTRACT_ID>",
  "proposalId": "<PROPOSAL_ID>",
  "title": "Contrat de Prestation - Migration E-commerce",
  "status": "generated",
  "clientInfo": {...},
  "projectInfo": {...},
  "terms": {...}
}
```

### Test 4 : Télécharger le PDF du Contrat

**URL :** `GET http://localhost:3000/api/contracts/<CONTRACT_ID>/pdf`

**Résultat attendu :**
- Télécharge un fichier `contrat-<CONTRACT_ID>.pdf`
- Fichier contient les informations du contrat avec clauses juridiques

**Comment tester :**
```bash
# Via curl
curl -o contract.pdf http://localhost:3000/api/contracts/<CONTRACT_ID>/pdf

# Vérifier que le PDF a été créé
file contract.pdf
# Output: contract.pdf: PDF document, version 1.4
```

### Test 5 : Sauvegarder une Nouvelle Proposition

**URL :** `POST http://localhost:3000/api/save-proposal`

**Body :**
```json
{
  "projectName": "Application Mobile iOS",
  "description": "Développement d'une application mobile native iOS pour gestion de tâches collaboratives",
  "email": "dev@startup.example.com",
  "company": "StartupDev",
  "phone": "+33 3 45 67 89 01",
  "projectType": "mobile",
  "timeline": "2 mois",
  "price": 35000,
  "features": [
    "Interface intuitive",
    "Synchronisation cloud",
    "Notifications push"
  ]
}
```

**Résultat attendu :**
```json
{
  "success": true,
  "message": "Proposition sauvegardée avec succès",
  "proposalId": "<NEW_PROPOSAL_ID>",
  "proposal": {
    "id": "<NEW_PROPOSAL_ID>",
    "projectName": "Application Mobile iOS",
    "onboardingStep": 0,
    "status": "pending",
    ...
  }
}
```

### Test 6 : Erreur de Validation

**URL :** `POST http://localhost:3000/api/save-proposal`

**Body invalide :**
```json
{
  "projectName": "App",
  "description": "Trop court",
  "email": "invalid-email"
}
```

**Résultat attendu (400) :**
```json
{
  "success": false,
  "errors": [
    {
      "field": "projectName",
      "message": "Project name required (min 3 characters)"
    },
    {
      "field": "description",
      "message": "Description too short (min 10 characters)"
    },
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

---

## Tests Manuels dans l'UI

### Flux Onboarding Complet

1. Accédez à : **http://localhost:3000/onboarding?proposalId=<PROPOSAL_ID>**
2. Remplissez le formulaire d'informations (étape 1)
3. Appuyez sur "Suivant" → l'étape doit être sauvegardée automatiquement
4. Remplissez description du projet (étape 2)
5. Appuyez sur "Suivant" → auto-save
6. Acceptez les conditions (étape 3)
7. Appuyez sur "Suivant" → auto-save
8. Allez à l'étape signature du contrat (étape 4)
9. Appuyez sur "Télécharger le PDF" → PDF du contrat téléchargé
10. Signez le contrat
11. Appuyez sur "Procéder au paiement" → navigation vers étape 5

### Vérifier Persistance

1. Ouvrez la console du navigateur (F12)
2. Vérifiez les requêtes réseau (onglet Network)
3. Après chaque changement d'étape, une requête `PATCH /api/proposals/[id]/onboarding` doit être envoyée
4. Response status : **200**

---

## Logs Serveur

Pendant les tests, observez les logs du serveur (`npm run dev`).

Exemple de logs attendus :
```
[INFO] /api/proposals/[id] Proposal fetched successfully duration: 45ms
[INFO] /api/proposals/[id]/onboarding Onboarding step updated successfully duration: 120ms
[DEBUG] /api/contracts/[id]/pdf Fetching contract contract found
[INFO] /api/contracts/[id]/pdf Contract PDF generated successfully duration: 3450ms
```

---

## Dépannage

### Erreur : "Port 3000 already in use"

```bash
# Trouvez le processus
lsof -iTCP:3000 -sTCP:LISTEN -P -n

# Terminez-le
kill -9 <PID>

# Relancez le serveur
npm run dev
```

### Erreur : "DATABASE_URL not set"

Vérifiez que `.env` ou `.env.local` contient :
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/automatic"
```

Assurez-vous que PostgreSQL est en cours d'exécution :
```bash
docker ps | grep postgres
```

### Erreur Prisma : "The database is not in sync"

Réappliquez les changements de schéma :
```bash
npx prisma db push
```

---

## Outils de Test Recommandés

- **REST Client** : VS Code REST Client extension
- **Postman** : https://www.postman.com/
- **cURL** : CLI (inclus dans Linux/Mac)
- **Browser DevTools** : F12

---

## Métriques de Succès

✅ Tous les tests API retournent les statuts HTTP corrects  
✅ Les étapes d'onboarding sont persistées automatiquement (vérifier DB)  
✅ Le PDF du contrat est généré et téléchargeable  
✅ Les erreurs de validation retournent des messages clairs  
✅ Les logs serveur montrent les durées d'exécution  
✅ Le flux UI complet fonctionne sans erreurs  

---

## Prochaines Étapes

- [ ] Ajouter tests E2E avec Playwright
- [ ] Ajouter tests unitaires pour helpers de validation
- [ ] Implémenter notifications d'email
- [ ] Créer dashboard client complet
- [ ] Déployer en staging/prod
