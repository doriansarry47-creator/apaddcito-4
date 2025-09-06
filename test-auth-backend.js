#!/usr/bin/env node
/**
 * Script de test pour valider l'authentification backend
 */

import fetch from 'node-fetch';

const BASE_URL = process.argv[2] || 'http://localhost:3000';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(url, method = 'GET', body = null, headers = {}) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json', ...headers }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.text();
    
    return {
      success: response.ok,
      status: response.status,
      data: data || response.statusText,
      headers: response.headers
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function testPasswordValidation() {
  log('\n🔒 Test de validation des mots de passe...', 'blue');
  
  // Test avec mot de passe trop court
  const shortPasswordResult = await testEndpoint(
    `${BASE_URL}/api/auth/register`,
    'POST',
    {
      email: `test-short-${Date.now()}@apaddicto.com`,
      password: '123', // Trop court
      firstName: 'Test',
      lastName: 'User'
    }
  );

  if (!shortPasswordResult.success && shortPasswordResult.data.includes('6 caractères')) {
    log('✅ Validation mot de passe court : OK', 'green');
    return true;
  } else {
    log(`❌ Validation mot de passe court : ÉCHEC - ${shortPasswordResult.data}`, 'red');
    return false;
  }
}

async function testUserRegistration() {
  log('\n👤 Test de création d\'utilisateur...', 'blue');
  
  const testUser = {
    email: `test.${Date.now()}@apaddicto.com`,
    password: 'TestPassword123!',
    firstName: 'Test',
    lastName: 'User'
  };

  const result = await testEndpoint(
    `${BASE_URL}/api/auth/register`,
    'POST',
    testUser
  );

  if (result.success) {
    log('✅ Création d\'utilisateur réussie', 'green');
    
    // Test de connexion avec le même utilisateur
    const loginResult = await testEndpoint(
      `${BASE_URL}/api/auth/login`,
      'POST',
      {
        email: testUser.email,
        password: testUser.password
      }
    );
    
    if (loginResult.success) {
      log('✅ Connexion utilisateur réussie', 'green');
      return true;
    } else {
      log(`❌ Connexion utilisateur échouée: ${loginResult.data}`, 'red');
      return false;
    }
  } else {
    log(`❌ Création d'utilisateur échouée: ${loginResult.data}`, 'red');
    return false;
  }
}

async function runAuthTests() {
  log('🧪 Test d\'authentification backend - Apaddicto', 'blue');
  log(`📍 URL de base: ${BASE_URL}`, 'yellow');
  log('');

  const tests = [
    {
      name: 'Test de connexion base de données',
      test: () => testEndpoint(`${BASE_URL}/api/test-db`)
    },
    {
      name: 'Test de validation mot de passe',
      test: testPasswordValidation
    },
    {
      name: 'Test inscription et connexion utilisateur',
      test: testUserRegistration
    }
  ];

  const results = [];
  
  for (const test of tests) {
    log(`🔍 ${test.name}...`, 'yellow');
    try {
      const result = await test.test();
      if (result === true || (result && result.success)) {
        log(`✅ ${test.name} : SUCCÈS`, 'green');
        results.push(true);
      } else {
        log(`❌ ${test.name} : ÉCHEC`, 'red');
        if (result && result.data) {
          log(`   Détails: ${result.data}`, 'red');
        }
        results.push(false);
      }
    } catch (error) {
      log(`❌ ${test.name} : ERREUR - ${error.message}`, 'red');
      results.push(false);
    }
    log('');
  }

  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  log(`📊 Résultats: ${passedTests}/${totalTests} tests réussis`, passedTests === totalTests ? 'green' : 'red');
  
  return passedTests === totalTests;
}

// Exécution des tests
(async () => {
  try {
    const allTestsPass = await runAuthTests();
    process.exit(allTestsPass ? 0 : 1);
  } catch (error) {
    log(`💥 Erreur générale: ${error.message}`, 'red');
    process.exit(1);
  }
})();