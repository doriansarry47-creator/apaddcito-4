# Guide de Migration de la Base de Données

Ce guide explique comment résoudre l'erreur "relation 'users' does not exist" en synchronisant votre schéma Drizzle avec votre base de données PostgreSQL.

## Problème

L'erreur `relation 'users' does not exist` se produit lorsque votre application tente d'accéder à des tables qui n'existent pas encore dans votre base de données. Bien que votre schéma soit défini dans le code (`shared/schema.ts`), les tables doivent être créées physiquement dans la base de données.

## Solution : Migrations en 2 étapes

### Étape 1 : Générer les fichiers de migration

Exécutez cette commande pour créer les fichiers SQL de migration à partir de votre schéma :

```bash
npx drizzle-kit generate
```

Cette commande :
- Analyse votre schéma dans `shared/schema.ts`
- Compare avec l'état actuel de votre base de données
- Génère les fichiers SQL nécessaires dans le dossier `migrations/`

### Étape 2 : Appliquer les migrations à la base de données

Exécutez cette commande pour créer les tables dans votre base de données :

```bash
npm run db:migrate
```

Cette commande :
- Se connecte à votre base de données PostgreSQL (Neon)
- Exécute tous les fichiers de migration dans l'ordre
- Crée les tables `users`, `exercises`, `craving_entries`, etc.
- Établit les relations entre les tables

## Prérequis

Assurez-vous que :

1. **Variables d'environnement** : Votre fichier `.env` contient :
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

2. **Dépendances** : Les packages sont installés :
   ```bash
   npm install
   ```

## Vérification

Après avoir exécuté les migrations, votre application devrait fonctionner sans l'erreur "relation 'users' does not exist".

Pour vérifier que les tables sont créées, vous pouvez :
- Utiliser un client PostgreSQL pour inspecter votre base de données
- Tester votre application en créant un compte utilisateur

## Commandes utiles

- `npm run db:generate` : Générer de nouvelles migrations
- `npm run db:migrate` : Appliquer les migrations
- `npm run db:push` : Pousser le schéma directement (développement uniquement)

## Dépannage

### Erreur "DATABASE_URL manquant"
- Vérifiez que votre fichier `.env` existe et contient `DATABASE_URL`
- Assurez-vous que l'URL de connexion est correcte

### Erreur "Dossier migrations/ absent"
- Exécutez d'abord `npx drizzle-kit generate` pour créer les migrations

### Erreur de connexion à la base de données
- Vérifiez que votre base de données Neon est active
- Testez la connexion avec l'URL fournie