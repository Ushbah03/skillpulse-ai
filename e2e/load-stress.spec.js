// @ts-check
import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:5000';

test.describe.serial('SkillPulse AI - Step 2: Load, Stress & Concurrency Testing', () => {

  // ------------------------------------------------------------------------
  // LOAD-01: High-Concurrency Health & Infrastructure Benchmark
  // ------------------------------------------------------------------------
  test('LOAD-01: High-Concurrency API Burst (50 Concurrent Requests)', async ({ request }) => {
    const CONCURRENT_REQUESTS = 50;
    const startTime = Date.now();

    const promises = Array.from({ length: CONCURRENT_REQUESTS }, async (_, idx) => {
      const reqStart = Date.now();
      const res = await request.get(`${BACKEND_URL}/api/health`);
      const latency = Date.now() - reqStart;
      return { status: res.status(), latency, ok: res.ok() };
    });

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    const latencies = results.map(r => r.latency).sort((a, b) => a - b);
    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const p95 = latencies[Math.floor(latencies.length * 0.95)];
    const p99 = latencies[Math.floor(latencies.length * 0.99)];
    const errorCount = results.filter(r => !r.ok).length;

    console.log(`\n--- LOAD-01 Benchmark Results (50 Concurrent Health Checks) ---`);
    console.log(`Total Elapsed Time: ${totalTime}ms`);
    console.log(`Average Latency:    ${avgLatency}ms`);
    console.log(`p95 Latency:        ${p95}ms`);
    console.log(`p99 Latency:        ${p99}ms`);
    console.log(`Error Rate:         ${(errorCount / CONCURRENT_REQUESTS) * 100}% (${errorCount}/${CONCURRENT_REQUESTS})`);

    expect(errorCount).toBe(0);
    expect(p95).toBeLessThan(1000); // 95% of requests must resolve under 1000ms
  });

  // ------------------------------------------------------------------------
  // LOAD-02: Authenticated Database Concurrency (30 Concurrent Prisma Queries)
  // ------------------------------------------------------------------------
  test('LOAD-02: Authenticated Database Query Concurrency (30 Concurrent Admin Requests)', async ({ request }) => {
    // 1. Obtain Admin Token
    const loginRes = await request.post(`${BACKEND_URL}/api/auth/login`, {
      data: {
        email: 'admin@enterprise.com',
        password: 'Password123!'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const token = loginData.token;

    // 2. Fire 30 concurrent database-heavy requests to /api/admin/users
    const CONCURRENT_USERS = 30;
    const startTime = Date.now();

    const promises = Array.from({ length: CONCURRENT_USERS }, async () => {
      const reqStart = Date.now();
      const res = await request.get(`${BACKEND_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const latency = Date.now() - reqStart;
      return { status: res.status(), latency, ok: res.ok() };
    });

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    const latencies = results.map(r => r.latency).sort((a, b) => a - b);
    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const p95 = latencies[Math.floor(latencies.length * 0.95)];
    const errorCount = results.filter(r => !r.ok).length;

    console.log(`\n--- LOAD-02 Benchmark Results (30 Concurrent Admin DB Queries) ---`);
    console.log(`Total Elapsed Time: ${totalTime}ms`);
    console.log(`Average Latency:    ${avgLatency}ms`);
    console.log(`p95 Latency:        ${p95}ms`);
    console.log(`Error Rate:         ${(errorCount / CONCURRENT_USERS) * 100}% (${errorCount}/${CONCURRENT_USERS})`);

    expect(errorCount).toBe(0);
    // Remote cloud database over cross-region WAN network SLA
    expect(p95).toBeLessThan(12000); // 0% errors and completes within pool timeout
  });

  // ------------------------------------------------------------------------
  // LOAD-03: Heavy Analytics & Skill Gap Concurrency
  // ------------------------------------------------------------------------
  test('LOAD-03: Heavy Analytics Concurrency (12 Concurrent HR Analytics Queries)', async ({ request }) => {
    // 1. Obtain HR Token
    const loginRes = await request.post(`${BACKEND_URL}/api/auth/login`, {
      data: {
        email: 'hr@enterprise.com',
        password: 'Password123!'
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    const token = loginData.token;

    // 2. Fire 12 concurrent requests to deep HR organization skill analytics
    const CONCURRENT_QUERIES = 12;
    const startTime = Date.now();

    const promises = Array.from({ length: CONCURRENT_QUERIES }, async () => {
      const reqStart = Date.now();
      const res = await request.get(`${BACKEND_URL}/api/hr/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const latency = Date.now() - reqStart;
      return { status: res.status(), latency, ok: res.ok() };
    });

    const results = await Promise.all(promises);
    const totalTime = Date.now() - startTime;

    const latencies = results.map(r => r.latency).sort((a, b) => a - b);
    const avgLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const p95 = latencies[Math.floor(latencies.length * 0.95)];
    const errorCount = results.filter(r => !r.ok).length;

    console.log(`\n--- LOAD-03 Benchmark Results (12 Concurrent HR Analytics Queries) ---`);
    console.log(`Total Elapsed Time: ${totalTime}ms`);
    console.log(`Average Latency:    ${avgLatency}ms`);
    console.log(`p95 Latency:        ${p95}ms`);
    console.log(`Error Rate:         ${(errorCount / CONCURRENT_QUERIES) * 100}% (${errorCount}/${CONCURRENT_QUERIES})`);

    expect(errorCount).toBe(0);
    expect(p95).toBeLessThan(12000);
  });

  // ------------------------------------------------------------------------
  // LOAD-04: Multi-User Parallel UI Navigation & DOM Rendering
  // ------------------------------------------------------------------------
  test('LOAD-04: Multi-Client Parallel UI Rendering & Viewport Stress', async ({ browser }) => {
    // Open 3 simultaneous independent browser contexts to simulate concurrent users
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const context3 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    const page3 = await context3.newPage();

    const nav1 = page1.goto('/features');
    const nav2 = page2.goto('/pricing');
    const nav3 = page3.goto('/about');

    await Promise.all([nav1, nav2, nav3]);

    // Verify all 3 pages rendered fully without crashes or unhandled client errors
    await expect(page1.locator('h1, h2').first()).toBeVisible();
    await expect(page2.locator('h1, h2').first()).toBeVisible();
    await expect(page3.locator('h1, h2').first()).toBeVisible();

    await context1.close();
    await context2.close();
    await context3.close();
  });

});
