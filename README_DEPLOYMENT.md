# Guide de Déploiement - Application Apaddcito

## Problème Résolu

L'erreur "relation user does not exist" était causée par des migrations de base de données non exécutées. Cette application utilise Drizzle ORM avec PostgreSQL et nécessite que les migrations soient appliquées avant le premier démarrage.

## Solution Implémentée

1. **Script de correction de base de données** (`scripts/fix-database.ts`)
   - Vérifie la connexion à la base de données
   - Exécute les migrations si nécessaire
   - Valide la structure des tables

2. **Endpoint API pour migrations** (`api/migrate.js`)
   - Permet d'exécuter les migrations sur Vercel
   - Sécurisé par un token d'autorisation

3. **Script de déploiement** (`scripts/vercel-deploy.sh`)
   - Automatise la préparation pour Vercel

## Déploiement sur Vercel

### Étape 1: Préparer l'environnement local

```bash
# Installer les dépendances
npm install

# Construire l'application
npm run build
```

### Étape 2: Configurer la base de données

Vous devez avoir une base de données PostgreSQL accessible depuis Internet. Options recommandées:
- [Neon](https://neon.tech/) (gratuit)
- [Supabase](https://supabase.com/) (gratuit)
- [Railway](https://railway.app/) (gratuit avec limites)

### Étape 3: Déployer sur Vercel

1. **Installer Vercel CLI** (si pas déjà fait):
```bash
npm i -g vercel
```

2. **Se connecter à Vercel**:
```bash
vercel login
```

3. **Déployer l'application**:
```bash
vercel --prod
```

### Étape 4: Configurer les variables d'environnement

Dans le dashboard Vercel, ajoutez ces variables d'environnement:

- `DATABASE_URL`: URL de votre base PostgreSQL
- `SESSION_SECRET`: Une clé secrète aléatoire (ex: `openssl rand -base64 32`)
- `NODE_ENV`: `production`
- `MIGRATION_TOKEN`: Un token pour sécuriser les migrations (ex: `migrate-secret-123`)

### Étape 5: Exécuter les migrations

Après le déploiement, exécutez cette commande pour créer les tables:

```bash
curl -X POST https://votre-app.vercel.app/api/migrate \
     -H "Authorization: Bearer votre-migration-token"
```

Remplacez:
- `votre-app.vercel.app` par votre URL Vercel
- `votre-migration-token` par la valeur de `MIGRATION_TOKEN`

## Vérification

1. Visitez votre application sur l'URL Vercel
2. Essayez de vous inscrire/connecter
3. L'erreur "relation user does not exist" ne devrait plus apparaître

## Structure de la Base de Données

L'application crée automatiquement ces tables:
- `users` - Utilisateurs de l'application
- `exercises` - Exercices disponibles
- `craving_entries` - Entrées de craving des utilisateurs
- `exercise_sessions` - Sessions d'exercices
- `beck_analyses` - Analyses Beck des utilisateurs
- `user_badges` - Badges gagnés par les utilisateurs
- `user_stats` - Statistiques des utilisateurs
- `psycho_education_content` - Contenu psychoéducatif

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correctement configurée
- Assurez-vous que la base de données accepte les connexions SSL

### Migrations qui échouent
- Vérifiez que le token d'autorisation est correct
- Consultez les logs Vercel pour plus de détails

### Problèmes de build
- Assurez-vous que toutes les dépendances sont installées
- Vérifiez que le build local fonctionne avant de déployer

## Support

Si vous rencontrez des problèmes, vérifiez:
1. Les logs Vercel dans le dashboard
2. La configuration des variables d'environnement
3. La connectivité à votre base de données

