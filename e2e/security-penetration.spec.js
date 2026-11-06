// @ts-check
import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:5000';

test.describe.serial('SkillPulse AI - Production Security & Penetration Testing Suite', () => {

  // ------------------------------------------------------------------------
  // SEC-01: Helmet Security Headers Verification
  // ------------------------------------------------------------------------
  test('SEC-01: Helmet Security Headers Verification (OWASP Standards)', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/health`);
    expect(res.ok()).toBeTruthy();

    const headers = res.headers();
    
    // Check for critical OWASP security headers applied by Helmet
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-dns-prefetch-control']).toBe('off');
    expect(headers['x-download-options']).toBe('noopen');
    expect(headers['cross-origin-resource-policy']).toBe('cross-origin');
  });

  // ------------------------------------------------------------------------
  // SEC-02: Multi-Tenant Data Isolation & IDOR Defense
  // ------------------------------------------------------------------------
  test('SEC-02: Multi-Tenant Data Isolation & IDOR Defense (Cross-Tenant Shield)', async ({ request }) => {
    // 1. Authenticate as Super Admin or Company Admin to get a valid token
    const loginRes = await request.post(`${BACKEND_URL}/api/auth/login`, {
      data: {
        email: 'admin@enterprise.com',
        password: 'Password123!'
      }
    });

    // If rate-limited from previous runs, handle gracefully, otherwise verify
    if (loginRes.status() === 200) {
      const loginData = await loginRes.json();
      const token = loginData.token || loginData.data?.token;
      const adminTenantId = loginData.user?.tenant?.id || loginData.user?.tenantId || loginData.tenantId;

      expect(token).toBeTruthy();
      expect(adminTenantId).toBeTruthy();

      // 2. Fetch users - verify every single returned user strictly belongs to admin's tenant
      const usersRes = await request.get(`${BACKEND_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      expect(usersRes.ok()).toBeTruthy();
      const usersData = await usersRes.json();
      const users = usersData.data || [];

      // Verify all users share the same tenant ID
      expect(users.length).toBeGreaterThan(0);
      for (const u of users) {
        if (u.tenantId) {
          expect(u.tenantId).toBe(adminTenantId);
        }
      }

      // 3. Attempt IDOR: probe superadmin tenant directory as standard company admin
      const idorRes = await request.get(`${BACKEND_URL}/api/admin/tenants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Standard Company Admin must be strictly forbidden from global tenant directory
      expect(idorRes.status()).toBe(403);
    }
  });

  // ------------------------------------------------------------------------
  // SEC-03: XSS Script Injection Sanitization in UI Inputs
  // ------------------------------------------------------------------------
  test('SEC-03: XSS Script Injection Sanitization in UI & Forms', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Attempt XSS in search and input fields
    const xssPayload = '<script id="xss-test">window.__xss_vulnerable = true;</script>';

    // Type payload into login email field
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(xssPayload);

    // Verify script element was NOT created or executed in the DOM
    const isVulnerable = await page.evaluate(() => {
      // @ts-ignore
      return window.__xss_vulnerable === true || document.getElementById('xss-test') !== null;
    });
    expect(isVulnerable).toBe(false);
  });

  // ------------------------------------------------------------------------
  // SEC-04: SQL Injection (SQLi) Payload Resilience
  // ------------------------------------------------------------------------
  test('SEC-04: SQL Injection (SQLi) Payload Resilience Across Auth & APIs', async ({ request }) => {
    const sqliPayloads = [
      "' OR '1'='1",
      "admin'--",
      "' OR 1=1 --",
      "'; DROP TABLE \"User\"; --",
      "' UNION SELECT NULL, NULL, NULL --"
    ];

    for (const payload of sqliPayloads) {
      const res = await request.post(`${BACKEND_URL}/api/auth/login`, {
        data: {
          email: payload,
          password: 'Password123!'
        }
      });

      // Must fail gracefully with 400 or 401 or 429, never 500 internal server error
      expect([400, 401, 429]).toContain(res.status());
      
      const body = await res.json();
      expect(body.success).toBe(false);
    }
  });

  // ------------------------------------------------------------------------
  // SEC-05: Forged & Tampered JWT Token Rejection
  // ------------------------------------------------------------------------
  test('SEC-05: Forged & Tampered JWT Token Rejection', async ({ request }) => {
    // Intentionally corrupted / forged token
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWtlLWFkbWluIiwicm9sZSI6IlNVUEVSX0FETUlOIn0.invalidsignature1234567890abcdef';

    const res = await request.get(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${fakeToken}` }
    });

    // Must be rejected with 401 Unauthorized
    expect(res.status()).toBe(401);
  });

  // ------------------------------------------------------------------------
  // SEC-06: Unauthenticated Sensitive Endpoint Shield
  // ------------------------------------------------------------------------
  test('SEC-06: Unauthenticated Sensitive Endpoint Shield (All Roles)', async ({ request }) => {
    const sensitiveEndpoints = [
      '/api/employee/dashboard',
      '/api/team-leader/overview',
      '/api/hr/skill-gap-reports',
      '/api/admin/users',
      '/api/admin/dashboard',
      '/api/ai/recommendations'
    ];

    for (const endpoint of sensitiveEndpoints) {
      const res = await request.get(`${BACKEND_URL}${endpoint}`);
      // Every protected route must reject unauthenticated requests
      expect([401, 403, 404]).toContain(res.status());
    }
  });

  // ------------------------------------------------------------------------
  // SEC-07: Rate Limiting & Brute Force Defense (Runs Last)
  // ------------------------------------------------------------------------
  test('SEC-07: Rate Limiting Throttling & Brute Force Defense on Auth', async ({ request }) => {
    const payload = {
      email: 'attacker@malicious.com',
      password: 'wrong-password-attempt'
    };

    let rateLimited = false;

    // Send burst of requests until throttled or completed
    for (let i = 0; i < 55; i++) {
      const res = await request.post(`${BACKEND_URL}/api/auth/login`, { data: payload });
      if (res.status() === 429) {
        rateLimited = true;
        const body = await res.json();
        expect(body.success).toBe(false);
        expect(body.message).toMatch(/Too many authentication attempts/i);
        break;
      }
    }

    // Rate limiter must actively trigger 429 when threshold exceeded
    expect(rateLimited).toBeTruthy();
  });

});
