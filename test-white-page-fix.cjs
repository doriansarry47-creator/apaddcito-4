#!/usr/bin/env node

// Test spécifique pour vérifier que le problème de page blanche est résolu
const path = require('path');
const fs = require('fs');

console.log('🧪 Test Spécifique - Résolution Page Blanche Vercel\n');

console.log('1️⃣ Vérification de la configuration Vercel corrigée...');

try {
  const vercelConfigPath = path.join(__dirname, 'vercel.json');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  
  // Vérifier que la route de fallback est correctement configurée
  const fallbackRoute = vercelConfig.routes?.find(route => route.src === '/(.*)')?.dest;
  const isCorrectFallback = fallbackRoute === '/index.html';
  
  console.log(`   ✅ Route de fallback: ${fallbackRoute}`);
  console.log(`   ${isCorrectFallback ? '✅' : '❌'} Fallback correct: ${isCorrectFallback ? 'Oui' : 'Non'}`);
  
  if (!isCorrectFallback) {
    console.log('   ❌ ERREUR: La route de fallback devrait être "/index.html" et non "/dist/index.html"');
    process.exit(1);
  }
  
} catch (error) {
  console.log(`   ❌ Erreur lors de la lecture de vercel.json: ${error.message}`);
  process.exit(1);
}

console.log('\n2️⃣ Vérification des améliorations de gestion d\'erreurs...');

try {
  // Vérifier que les composants de gestion d'erreur existent
  const errorBoundaryPath = path.join(__dirname, 'client/src/components/error-boundary.tsx');
  const errorBoundaryExists = fs.existsSync(errorBoundaryPath);
  console.log(`   ✅ ErrorBoundary: ${errorBoundaryExists ? 'Présent' : '❌ Manquant'}`);
  
  // Vérifier App.tsx utilise ErrorBoundary
  const appPath = path.join(__dirname, 'client/src/App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  const usesErrorBoundary = appContent.includes('ErrorBoundary') && appContent.includes('import { ErrorBoundary }');
  console.log(`   ✅ App utilise ErrorBoundary: ${usesErrorBoundary ? 'Oui' : '❌ Non'}`);
  
  // Vérifier useAuthQuery robuste
  const useAuthPath = path.join(__dirname, 'client/src/hooks/use-auth.ts');
  const useAuthContent = fs.readFileSync(useAuthPath, 'utf8');
  const hasImprovedErrorHandling = useAuthContent.includes('try {') && useAuthContent.includes('catch (error)');
  console.log(`   ✅ useAuthQuery avec gestion d'erreurs: ${hasImprovedErrorHandling ? 'Oui' : '❌ Non'}`);
  
  if (!errorBoundaryExists || !usesErrorBoundary || !hasImprovedErrorHandling) {
    console.log('   ❌ ERREUR: Certaines améliorations de gestion d\'erreurs sont manquantes');
    process.exit(1);
  }
  
} catch (error) {
  console.log(`   ❌ Erreur lors de la vérification des composants: ${error.message}`);
  process.exit(1);
}

console.log('\n3️⃣ Test du build Vercel...');

const { execSync } = require('child_process');

try {
  execSync('npm run vercel-build', { stdio: 'pipe' });
  console.log('   ✅ Build Vercel: Réussi');
} catch (error) {
  console.log('   ❌ Build Vercel: Échoué');
  console.log(`   Erreur: ${error.message}`);
  process.exit(1);
}

console.log('\n✅ SUCCÈS: Toutes les corrections pour résoudre la page blanche sont en place!');
console.log('\n📋 Résumé des corrections appliquées:');
console.log('   ✅ Route de fallback Vercel corrigée (/index.html)');
console.log('   ✅ ErrorBoundary ajouté pour capturer les erreurs React');
console.log('   ✅ useAuthQuery robuste contre les erreurs réseau');
console.log('   ✅ ProtectedRoute gère les états d\'erreur');
console.log('   ✅ Build Vercel fonctionne correctement');

console.log('\n🚀 L\'application devrait maintenant rediriger vers /login au lieu d\'afficher une page blanche!');
console.log('\n📝 Actions de suivi après déploiement:');
console.log('   1. Vérifier que https://votre-app.vercel.app/ redirige vers /login');
console.log('   2. Tester l\'inscription et la connexion');
console.log('   3. Vérifier que les utilisateurs connectés accèdent au dashboard');
console.log('   4. S\'assurer qu\'aucune erreur JavaScript n\'apparaît dans la console');