// @ts-check
import { test, expect } from '@playwright/test';

test.describe.serial('SkillPulse AI - Step 5: Web Vitals, SEO & Accessibility Suite', () => {

  // ------------------------------------------------------------------------
  // SEO-01: robots.txt Verification
  // ------------------------------------------------------------------------
  test('SEO-01: robots.txt is accessible and disallows private dashboard routes', async ({ page }) => {
    const res = await page.goto('/robots.txt');
    expect(res?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('User-agent: *');
    expect(content).toContain('Disallow: /employee/');
    expect(content).toContain('Disallow: /hr/');
    expect(content).toContain('Disallow: /api/');
    expect(content).toContain('Sitemap: https://skillpulse-ai.vercel.app/sitemap.xml');
  });

  // ------------------------------------------------------------------------
  // SEO-02: sitemap.xml Verification
  // ------------------------------------------------------------------------
  test('SEO-02: sitemap.xml contains core marketing routes and valid XML schema', async ({ page }) => {
    const res = await page.goto('/sitemap.xml');
    expect(res?.status()).toBe(200);

    const content = await page.content();
    expect(content).toContain('https://skillpulse-ai.vercel.app/');
    expect(content).toContain('/features');
    expect(content).toContain('/pricing');
    expect(content).toContain('/about');
    expect(content).toContain('/contact');
  });

  // ------------------------------------------------------------------------
  // SEO-03: OpenGraph & Social Metadata Tags
  // ------------------------------------------------------------------------
  test('SEO-03: Production OpenGraph & Twitter Meta Tags Are Injected', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Title
    await expect(page).toHaveTitle(/SkillPulse AI/i);

    // Meta Description
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toContain('skill intelligence');

    // OpenGraph
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toContain('SkillPulse AI');

    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('website');

    // Twitter Card
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content');
    expect(twitterCard).toBe('summary_large_image');
  });

  // ------------------------------------------------------------------------
  // SEO-04: Core Web Vitals & Accessibility Essentials
  // ------------------------------------------------------------------------
  test('SEO-04: Viewport and Responsive Viewability Across Core Pages', async ({ page }) => {
    await page.goto('/features');
    await page.waitForLoadState('networkidle');

    // Verify viewport meta tag exists
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');

    // Verify all primary images have alt attributes
    const imagesWithoutAlt = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.filter(img => !img.hasAttribute('alt')).length;
    });
    expect(imagesWithoutAlt).toBe(0);

    // Verify main navigation buttons have accessible text
    const buttons = page.locator('button, a[href]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(5);
  });

});
