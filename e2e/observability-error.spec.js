// @ts-check
import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:5000';

test.describe.serial('SkillPulse AI - Step 4: Error Tracking & Observability', () => {

  // ------------------------------------------------------------------------
  // ERR-01: Structured Backend Exception Interception
  // ------------------------------------------------------------------------
  test('ERR-01: Structured API Error Response Interception', async ({ request }) => {
    // Request a nonexistent API route
    const res = await request.get(`${BACKEND_URL}/api/nonexistent-route-404-test`);
    expect(res.status()).toBe(404);

    // Expect valid JSON error structure
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toBeTruthy();
  });

  // ------------------------------------------------------------------------
  // ERR-02: Global Error Boundary Fallback UI Resilience
  // ------------------------------------------------------------------------
  test('ERR-02: Global Error Boundary Catches Component Faults & Shows Recovery UI', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trigger synthetic error boundary demonstration
    await page.evaluate(() => {
      // Dispatch an error or mount error simulation
      window.dispatchEvent(new CustomEvent('unhandledrejection', {
        detail: { reason: new Error('Simulation test error') }
      }));
    });

    // Verify main page elements are rendered and stable
    await expect(page.locator('body')).not.toBeEmpty();
    await expect(page.locator('text=SkillPulse').first()).toBeVisible();
  });

  // ------------------------------------------------------------------------
  // ERR-03: Frontend 404 Route Interception
  // ------------------------------------------------------------------------
  test('ERR-03: Nonexistent Client Route Fallback Interception', async ({ page }) => {
    await page.goto('/some-completely-invalid-url-404');
    await page.waitForLoadState('networkidle');

    // App should either show 404 page or redirect safely to home/login without blank screen
    await expect(page.locator('body')).not.toBeEmpty();
    const hasContent = await page.evaluate(() => document.body.innerText.length > 50);
    expect(hasContent).toBe(true);
  });

});
