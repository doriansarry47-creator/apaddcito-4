#!/bin/bash

echo "🚀 Préparation du déploiement Vercel..."

# Vérifier que les dépendances sont installées
echo "📦 Installation des dépendances..."
npm install

# Build du client
echo "🏗️ Build du client..."
npm run build:client

# Vérifier que le build s'est bien passé
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Le dossier dist n'a pas été créé"
    exit 1
fi

echo "✅ Application prête pour le déploiement Vercel"
echo ""
echo "📋 Étapes suivantes:"
echo "1. Connectez-vous à Vercel avec: vercel login"
echo "2. Déployez avec: vercel --prod"
echo "3. Configurez les variables d'environnement:"
echo "   - DATABASE_URL (votre URL PostgreSQL)"
echo "   - SESSION_SECRET (clé secrète pour les sessions)"
echo "   - NODE_ENV=production"
echo "   - MIGRATION_TOKEN (token pour sécuriser les migrations)"
echo ""
echo "4. Après le déploiement, exécutez les migrations:"
echo "   curl -X POST https://votre-app.vercel.app/api/migrate \\"
echo "        -H \"Authorization: Bearer votre-migration-token\""

