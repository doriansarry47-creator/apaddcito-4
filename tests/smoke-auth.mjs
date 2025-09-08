#!/usr/bin/env node

import { got } from 'got';
import { CookieJar } from 'tough-cookie';

// Configuration
const BASE_URL = process.env.BASE_URL || 'https://apaddcito-4.vercel.app';
const TEST_TIMEOUT = 30000; // 30 seconds

// Create a cookie jar for session management
const cookieJar = new CookieJar();

// Create HTTP client with cookie support
const client = got.extend({
  cookieJar,
  timeout: {
    request: TEST_TIMEOUT
  },
  headers: {
    'Content-Type': 'application/json'
  },
  retry: {
    limit: 2
  }
});

// Helper functions
function log(message, isSuccess = null) {
  const prefix = isSuccess === true ? '✅' : isSuccess === false ? '❌' : 'ℹ️';
  console.log(`${prefix} ${message}`);
}

function generateTestUser() {
  const timestamp = Date.now();
  return {
    email: `test.${timestamp}@example.com`,
    password: `testpass${timestamp}`,
    firstName: 'Test',
    lastName: 'User'
  };
}

async function testHealthEndpoint() {
  log('Testing /api/health endpoint...');
  try {
    const response = await client.get(`${BASE_URL}/api/health`);
    const body = JSON.parse(response.body);
    
    if (response.statusCode !== 200) {
      throw new Error(`Expected status 200, got ${response.statusCode}`);
    }
    
    if (!body.ok || body.status !== 'healthy') {
      throw new Error(`Expected { ok: true, status: "healthy" }, got ${JSON.stringify(body)}`);
    }
    
    log('Health endpoint test passed', true);
    return true;
  } catch (error) {
    log(`Health endpoint test failed: ${error.message}`, false);
    return false;
  }
}

async function testDatabaseEndpoint() {
  log('Testing /api/test-db endpoint...');
  try {
    const response = await client.get(`${BASE_URL}/api/test-db`);
    const body = JSON.parse(response.body);
    
    if (response.statusCode !== 200) {
      throw new Error(`Expected status 200, got ${response.statusCode}`);
    }
    
    if (body.ok !== true) {
      throw new Error(`Expected ok: true, got ${JSON.stringify(body)}`);
    }
    
    log('Database endpoint test passed', true);
    return true;
  } catch (error) {
    log(`Database endpoint test failed: ${error.message}`, false);
    return false;
  }
}

async function testAuthFlow() {
  log('Testing full authentication flow...');
  const testUser = generateTestUser();
  log(`Generated test user: ${testUser.email}`);
  
  try {
    // Step 1: Register
    log('Step 1: Attempting registration...');
    let registerResponse;
    try {
      registerResponse = await client.post(`${BASE_URL}/api/auth/register`, {
        json: testUser
      });
    } catch (error) {
      if (error.response && error.response.statusCode === 400) {
        // User already exists, proceed to login
        log('User already exists, proceeding to login...');
      } else {
        throw error;
      }
    }
    
    if (registerResponse && registerResponse.statusCode === 200) {
      const registerBody = JSON.parse(registerResponse.body);
      if (!registerBody.user) {
        throw new Error('Registration succeeded but no user in response');
      }
      log('Registration successful', true);
    }
    
    // Step 2: Login
    log('Step 2: Attempting login...');
    const loginResponse = await client.post(`${BASE_URL}/api/auth/login`, {
      json: {
        email: testUser.email,
        password: testUser.password
      }
    });
    
    if (loginResponse.statusCode !== 200) {
      throw new Error(`Login failed with status ${loginResponse.statusCode}`);
    }
    
    const loginBody = JSON.parse(loginResponse.body);
    if (!loginBody.user) {
      throw new Error('Login succeeded but no user in response');
    }
    log('Login successful', true);
    
    // Step 3: Get current user
    log('Step 3: Testing /api/auth/me endpoint...');
    const meResponse = await client.get(`${BASE_URL}/api/auth/me`);
    
    if (meResponse.statusCode !== 200) {
      throw new Error(`/api/auth/me failed with status ${meResponse.statusCode}`);
    }
    
    const meBody = JSON.parse(meResponse.body);
    if (!meBody.user) {
      throw new Error('/api/auth/me succeeded but no user in response');
    }
    log('User authentication check successful', true);
    
    // Step 4: Logout
    log('Step 4: Attempting logout...');
    const logoutResponse = await client.post(`${BASE_URL}/api/auth/logout`);
    
    if (logoutResponse.statusCode !== 200) {
      throw new Error(`Logout failed with status ${logoutResponse.statusCode}`);
    }
    log('Logout successful', true);
    
    log('Full authentication flow test passed', true);
    return true;
  } catch (error) {
    log(`Authentication flow test failed: ${error.message}`, false);
    return false;
  }
}

async function runSmokeTests() {
  log(`Starting smoke tests against: ${BASE_URL}`);
  log('='.repeat(50));
  
  const results = [];
  
  // Test 1: Health endpoint
  results.push(await testHealthEndpoint());
  
  // Test 2: Database endpoint
  results.push(await testDatabaseEndpoint());
  
  // Test 3: Full auth flow
  results.push(await testAuthFlow());
  
  // Summary
  log('='.repeat(50));
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  if (passed === total) {
    log(`All tests passed! (${passed}/${total})`, true);
    process.exit(0);
  } else {
    log(`Tests failed: ${passed}/${total} passed`, false);
    process.exit(1);
  }
}

// Run the tests
runSmokeTests().catch(error => {
  log(`Unexpected error: ${error.message}`, false);
  process.exit(1);
});