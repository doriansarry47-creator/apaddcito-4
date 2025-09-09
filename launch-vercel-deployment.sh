#!/bin/bash

# Script de lancement du déploiement Vercel pour Apaddicto
# Usage: ./launch-vercel-deployment.sh

set -e

echo "🚀 Lancement du déploiement Vercel - Apaddicto"
echo "=============================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -f "vercel.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté dans le répertoire racine du projet"
    exit 1
fi

# Vérifier la préparation
echo "🔍 Vérification de la préparation..."
if ! node verify-deployment-ready.js; then
    echo "❌ La vérification a échoué. Consultez les erreurs ci-dessus."
    exit 1
fi

echo ""
echo "✅ Tous les contrôles sont passés!"
echo ""

# Tentative de déploiement automatique
echo "🚀 Tentative de déploiement automatique..."

# Token Vercel fourni dans la documentation
VERCEL_TOKEN="wQIOawWSweqWark0ZL4eI9jU"

if command -v vercel >/dev/null 2>&1; then
    echo "📦 Vercel CLI détecté"
    
    # Essayer le déploiement automatique
    echo "🔄 Tentative de déploiement avec le token fourni..."
    
    # Créer un fichier de configuration temporaire pour éviter les prompts interactifs
    cat > .vercel-project.json << EOF
{
  "name": "apaddicto-4",
  "framework": "vite",
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "nodeVersion": "20.x"
}
EOF

    echo "⚙️ Configuration du projet Vercel..."
    
    # Essayer de déployer
    if timeout 60s vercel --token "$VERCEL_TOKEN" --yes --prod --build-env NODE_ENV=production; then
        echo ""
        echo "🎉 DÉPLOIEMENT RÉUSSI!"
        echo ""
        echo "📋 Étapes post-déploiement:"
        echo "1. Configurez les variables d'environnement sur vercel.com"
        echo "2. Testez votre application"
        echo "3. Exécutez les migrations si nécessaire"
        
        # Nettoyer le fichier temporaire
        rm -f .vercel-project.json
        
    else
        echo ""
        echo "⚠️ Le déploiement automatique a échoué ou a expiré"
        echo "📋 Procédure manuelle recommandée:"
        echo ""
        manual_instructions
    fi
else
    echo "⚠️ Vercel CLI non trouvé"
    echo "📋 Déploiement manuel requis:"
    echo ""
    manual_instructions
fi

function manual_instructions() {
    echo "🔧 INSTRUCTIONS DE DÉPLOIEMENT MANUEL:"
    echo ""
    echo "1. 🌐 Allez sur https://vercel.com"
    echo "2. 🔑 Connectez-vous avec votre compte"
    echo "3. ➕ Cliquez sur 'New Project'"
    echo "4. 📁 Importez ce repository: doriansarry47-creator/apaddcito-4"
    echo "5. ⚙️ Configurez les variables d'environnement:"
    echo "   DATABASE_URL=postgresql://neondb_owner:npg_vRJU7LlnYG1y@ep-soft-bush-ab0hbww0-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    echo "   SESSION_SECRET=Apaddicto2024SecretKey"
    echo "   NODE_ENV=production"
    echo "6. 🚀 Cliquez sur 'Deploy'"
    echo ""
    echo "📖 Consultez DEPLOYMENT_READY.md pour plus de détails"
    echo ""
    echo "🧪 Après le déploiement, testez avec:"
    echo "   node test-production-deployment.js https://votre-app.vercel.app"
}

echo ""
echo "✅ Script terminé. Consultez les instructions ci-dessus."