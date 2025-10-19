// API Validation Test Script for Create React App
// Usage: Run in browser console or as a dev utility

const BASE_URL = process.env.REACT_APP_API_URL;
const endpoints = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/dashboard',
  '/api/dashboard/location',
  '/api/dashboard/battery',
  '/api/dashboard/nightreflector',
  '/api/dashboard/emergency',
  '/api/dashboard/activitylog',
  '/api/device',
  '/api/alert',
  '/api/battery',
  '/api/location',
  '/api/reflector',
];

async function testEndpoint(endpoint: string) {
  const url = `${BASE_URL}${endpoint}`;
  const start = performance.now();
  try {
    const res = await fetch(url, { method: 'GET' });
    const latency = Math.round(performance.now() - start);
    let statusIcon = '✅';
    let notes = '';
    if (res.status >= 400 && res.status < 500) {
      statusIcon = '❌';
      notes = `Client error: ${res.status}`;
      if (res.status === 404) notes += ' (Not Found)';
      if (res.status === 431) notes += ' (Request Header Fields Too Large)';
      if (res.status === 403) notes += ' (Forbidden)';
    } else if (res.status >= 500) {
      statusIcon = '❌';
      notes = `Server error: ${res.status}`;
    } else if (latency > 1000) {
      statusIcon = '⚠️';
      notes = `Slow response (${latency}ms)`;
    }
    return { endpoint, status: statusIcon, code: res.status, latency, notes };
  } catch (err) {
    let message = 'Unknown error';
    if (err instanceof Error) message = err.message;
    return { endpoint, status: '❌', code: '-', latency: '-', notes: `Network error: ${message}` };
  }
}

export async function runApiValidationTest() {
  const results = [];
  for (const endpoint of endpoints) {
    // eslint-disable-next-line no-await-in-loop
    const result = await testEndpoint(endpoint);
    results.push(result);
  }
  // Print Validation Report Table
  console.table(results.map(r => ({
    Endpoint: r.endpoint,
    Status: r.status,
    'HTTP Code': r.code,
    Latency: r.latency + 'ms',
    Notes: r.notes,
  })));
  return results;
}

// To run: import { runApiValidationTest } from './apiValidationTest'; runApiValidationTest();
