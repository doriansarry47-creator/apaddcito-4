#!/usr/bin/env node

/**
 * Script de vérification de préparation au déploiement Vercel
 * Vérifie que tous les composants nécessaires sont en place
 */

import { existsSync, statSync } from 'fs';
import { execSync } from 'child_process';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(path, description) {
  if (existsSync(path)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} (manquant: ${path})`, 'red');
    return false;
  }
}

function checkDirectory(path, description) {
  if (existsSync(path) && statSync(path).isDirectory()) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} (manquant: ${path})`, 'red');
    return false;
  }
}

function checkBuild() {
  try {
    log('🏗️ Test du build...', 'blue');
    execSync('npm run vercel-build', { stdio: 'pipe' });
    log('✅ Build réussi', 'green');
    return true;
  } catch (error) {
    log('❌ Échec du build', 'red');
    console.error(error.message);
    return false;
  }
}

async function main() {
  log('🔍 Vérification de la préparation au déploiement Vercel', 'blue');
  log('=' .repeat(60), 'blue');

  let allChecks = true;

  // Vérifications des fichiers essentiels
  allChecks &= checkFile('package.json', 'package.json présent');
  allChecks &= checkFile('vercel.json', 'Configuration Vercel');
  allChecks &= checkFile('tsconfig.json', 'Configuration TypeScript');
  allChecks &= checkFile('.env.production', 'Variables d\'environnement production');

  // Vérifications des dossiers
  allChecks &= checkDirectory('client', 'Dossier client (frontend)');
  allChecks &= checkDirectory('server', 'Dossier server (backend)');
  allChecks &= checkDirectory('api', 'Dossier API Vercel');

  // Vérifications des scripts
  allChecks &= checkFile('scripts/vercel-deploy.sh', 'Script de déploiement');
  allChecks &= checkFile('test-production-deployment.js', 'Script de test de production');

  // Test du build
  allChecks &= checkBuild();

  // Vérification des sorties de build
  allChecks &= checkDirectory('dist', 'Build frontend (dist)');
  allChecks &= checkDirectory('server-dist', 'Build backend (server-dist)');
  allChecks &= checkFile('dist/index.html', 'Page d\'accueil buildée');

  log('', 'reset');
  if (allChecks) {
    log('🎉 PRÊT POUR LE DÉPLOIEMENT VERCEL!', 'green');
    log('', 'reset');
    log('📋 Étapes suivantes:', 'blue');
    log('1. Allez sur vercel.com', 'yellow');
    log('2. Importez ce repository GitHub', 'yellow');
    log('3. Configurez les variables d\'environnement', 'yellow');
    log('4. Déployez!', 'yellow');
    log('', 'reset');
    log('📖 Consultez DEPLOYMENT_READY.md pour les détails', 'blue');
  } else {
    log('⚠️  Certaines vérifications ont échoué', 'red');
    log('Consultez les erreurs ci-dessus avant de déployer', 'yellow');
  }
}

main().catch(console.error);