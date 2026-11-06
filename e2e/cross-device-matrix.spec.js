// @ts-check
import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile iPhone (390x844)', width: 390, height: 844 },
  { name: 'Tablet iPad (768x1024)', width: 768, height: 1024 },
  { name: 'Desktop Full HD (1920x1080)', width: 1920, height: 1080 }
];

test.describe.serial('SkillPulse AI - Step 7: Cross-Browser & Multi-Device Matrix Verification', () => {

  for (const vp of VIEWPORTS) {
    test(`MATRIX: Responsive layout & zero horizontal overflow on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      const testRoutes = ['/', '/features', '/pricing', '/about', '/login'];

      for (const route of testRoutes) {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Verify zero horizontal page blowout/overflow on any device width
        const hasHorizontalOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > window.innerWidth + 2;
        });

        expect(hasHorizontalOverflow, `Horizontal overflow detected on ${route} at ${vp.name}`).toBe(false);

        // Verify page content loaded cleanly
        await expect(page.locator('body')).not.toBeEmpty();
        const bodyText = await page.locator('body').innerText();
        expect(bodyText).toMatch(/SkillPulse/i);
      }
    });
  }

  // ------------------------------------------------------------------------
  // MATRIX-MOBILE-NAV: Mobile Navigation drawer toggles cleanly
  // ------------------------------------------------------------------------
  test('MATRIX-MOBILE-NAV: Mobile Navigation drawer toggles cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Look for mobile menu toggle button (hamburger icon)
    const mobileMenuBtn = page.locator('button[aria-label="Toggle Menu"]');
    await expect(mobileMenuBtn).toBeVisible();

    // Click hamburger button to open drawer
    await mobileMenuBtn.click();

    // Verify flyout menu links appear
    await expect(page.locator('a:visible:has-text("Features")').first()).toBeVisible();
    await expect(page.locator('a:visible:has-text("Pricing")').first()).toBeVisible();

    // Click again to close drawer
    await mobileMenuBtn.click();
  });

});
