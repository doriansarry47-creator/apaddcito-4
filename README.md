# Apaddicto - Application de Thérapie Sportive

Une application web complète pour la gestion de la thérapie sportive avec authentification, exercices personnalisés et contenu psychoéducatif.

## Fonctionnalités

- 🔐 **Authentification sécurisée** : Système de connexion/inscription pour patients et administrateurs
- 💪 **Exercices personnalisés** : Catalogue d'exercices de thérapie sportive avec instructions détaillées
- 📚 **Contenu psychoéducatif** : Articles et ressources pour accompagner le processus de rétablissement
- 📊 **Suivi des progrès** : Tableaux de bord pour suivre l'évolution des patients
- 🏆 **Système de badges** : Récompenses pour motiver les utilisateurs
- 📱 **Interface responsive** : Compatible mobile et desktop

## Technologies utilisées

- **Frontend** : React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend** : Node.js, Express, TypeScript
- **Base de données** : PostgreSQL avec Drizzle ORM
- **Authentification** : Sessions avec bcrypt
- **Déploiement** : Vercel

## Installation

### Prérequis

- Node.js 20.x ou supérieur
- npm ou yarn
- Base de données PostgreSQL

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd apaddcito-4
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement**
   
   Copiez `.env.example` vers `.env` et configurez les variables :
   ```bash
   cp .env.example .env
   ```
   
   Modifiez `.env` avec vos valeurs :
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
   SESSION_SECRET=your-secure-secret-key-here
   CORS_ORIGIN=*
   NODE_ENV=development
   ```

4. **Migrations de base de données**
   ```bash
   npm run db:push
   ```

5. **Initialisation des données**
   ```bash
   npm run db:seed
   ```

6. **Démarrage du serveur de développement**
   ```bash
   npm run dev
   # ou seulement le serveur backend :
   npm run dev:server
   ```

## Commandes disponibles

### Base de données
- `npm run db:generate` - Génère les fichiers de migration
- `npm run db:push` - Applique le schéma à la base de données
- `npm run db:seed` - Initialise les données de base

### Développement
- `npm run dev` - Démarre le serveur de développement complet
- `npm run dev:server` - Démarre seulement le serveur backend
- `npm run check` - Vérifie les types TypeScript

### Build et déploiement
- `npm run build` - Build l'application pour la production
- `npm run start` - Démarre l'application en mode production

## Vérification de l'installation

1. **Test de santé du serveur**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Réponse attendue :
   ```json
   {
     "status": "ok",
     "service": "apaddicto-server",
     "timestamp": "2024-01-01T12:00:00.000Z",
     "environment": "development"
   }
   ```

2. **Connexion administrateur**
   - Email : `admin@example.com`
   - Mot de passe : `Admin123!`

3. **Utilisateur de démonstration**
   - Email : `demo@example.com`
   - Mot de passe : `Demo123!`
   - ID : `demo-user-123`

## Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de connexion PostgreSQL | Requis |
| `SESSION_SECRET` | Clé secrète pour les sessions | Requis |
| `CORS_ORIGIN` | Origine autorisée pour CORS | `*` |
| `NODE_ENV` | Environnement d'exécution | `development` |
| `PORT` | Port du serveur | `3000` |

## Comportement des utilisateurs

### Administrateur (`admin@example.com`)
- Accès complet à toutes les fonctionnalités
- Peut créer et modifier des exercices
- Peut gérer le contenu psychoéducatif
- Accès aux statistiques globales

### Utilisateur de démonstration (`demo@example.com`)
- Compte patient pré-configuré
- ID fixe : `demo-user-123`
- Utilisé par le frontend pour les démonstrations
- Données de test pré-remplies

## Structure du projet

```
apaddcito-4/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants UI
│   │   ├── pages/          # Pages de l'application
│   │   ├── hooks/          # Hooks React personnalisés
│   │   └── lib/            # Utilitaires
├── server/                 # Backend Express
│   ├── auth.ts            # Système d'authentification
│   ├── routes.ts          # Routes API
│   ├── storage.ts         # Couche de données
│   ├── db.ts              # Configuration base de données
│   └── index.ts           # Point d'entrée serveur
├── scripts/                # Scripts utilitaires
│   └── seed.ts            # Script d'initialisation
├── shared/                 # Types partagés
│   └── schema.ts          # Schéma de base de données
├── migrations/             # Migrations Drizzle
└── drizzle.config.ts      # Configuration Drizzle
```

## API Endpoints

### Système
- `GET /api/health` - Vérification de santé du serveur

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur

### Exercices
- `GET /api/exercises` - Liste des exercices
- `POST /api/exercises` - Créer un exercice (admin)

### Contenu psychoéducatif
- `GET /api/psycho-education` - Liste du contenu
- `POST /api/psycho-education` - Créer du contenu (admin)

### Suivi
- `POST /api/cravings` - Enregistrer une envie
- `GET /api/cravings` - Historique des envies
- `POST /api/exercise-sessions` - Enregistrer une session
- `GET /api/exercise-sessions` - Historique des sessions

### Administration
- `POST /api/seed-data` - Réinitialiser les données (admin)

## Déploiement sur Vercel

### Configuration des variables d'environnement

Dans les paramètres du projet Vercel, ajoutez :

```
DATABASE_URL=postgresql://neondb_owner:npg_vRJU7LlnYG1y@ep-soft-bush-ab0hbww0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SESSION_SECRET=Apaddicto2024SecretKey
NODE_ENV=production
CORS_ORIGIN=https://your-domain.vercel.app
```

### Configuration du build

- **Build Command** : `npm run vercel-build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

### Post-déploiement

1. Exécutez les migrations : `npm run db:push`
2. Initialisez les données : `npm run db:seed`
3. Vérifiez la santé : `https://your-domain.vercel.app/api/health`

## Support

Pour toute question ou problème, contactez l'équipe de développement.

## Licence

Propriétaire - Tous droits réservés

