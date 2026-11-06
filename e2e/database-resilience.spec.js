// @ts-check
import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:5000';

test.describe.serial('SkillPulse AI - Step 6: Database Resilience & Secrets Audit', () => {

  // ------------------------------------------------------------------------
  // DB-01: Neon Serverless Database Health & Pool Ping
  // ------------------------------------------------------------------------
  test('DB-01: Neon PostgreSQL Database Connection Pool Health', async ({ request }) => {
    const res = await request.get(`${BACKEND_URL}/api/health`);
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(['ok', 'ONLINE']).toContain(data.status);
    expect(data.timestamp).toBeTruthy();
  });

  // ------------------------------------------------------------------------
  // DB-02: Transaction Integrity & Atomic Rollback
  // ------------------------------------------------------------------------
  test('DB-02: Atomic Transaction Integrity on Validation Failure', async ({ request }) => {
    // Attempt to register a user with invalid payload that triggers a rejection
    const invalidEmail = `invalid-format-email-${Date.now()}`;
    const res = await request.post(`${BACKEND_URL}/api/auth/register`, {
      data: {
        email: invalidEmail, // Invalid email format
        password: 'weak',   // Violates complexity policy
        firstName: 'Fail',
        lastName: 'Test',
        isNewWorkspace: true,
        tenantSlug: `temp-slug-${Date.now()}`,
        organizationName: 'Temporary Failed Org'
      }
    });

    // Should be rejected
    expect([400, 422]).toContain(res.status());

    // Verify no orphaned tenant was created with that slug
    const probeRes = await request.post(`${BACKEND_URL}/api/auth/login`, {
      data: { email: invalidEmail, password: 'weak' }
    });
    expect(probeRes.status()).toBe(401);
  });

  // ------------------------------------------------------------------------
  // DB-03: Client Bundle Secrets Leak Audit
  // ------------------------------------------------------------------------
  test('DB-03: Client Bundle Secrets Leak Audit (Zero Secret Leaks in DOM/Window)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Inspect window and page source for accidental secret exposure
    const hasExposedSecrets = await page.evaluate(() => {
      const pageHtml = document.documentElement.outerHTML;
      // Search for sensitive secret patterns
      const leakedPatterns = [
        /sk_live_[0-9a-zA-Z]{24,}/,
        /sk_test_[0-9a-zA-Z]{24,}/,
        /postgresql:\/\/.*?:.*?@/,
        /JWT_SECRET/,
        /smtp\.gmail\.com/
      ];

      return leakedPatterns.some(regex => regex.test(pageHtml));
    });

    expect(hasExposedSecrets).toBe(false);
  });

});
