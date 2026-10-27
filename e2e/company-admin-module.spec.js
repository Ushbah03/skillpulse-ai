// @ts-check
import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - Company Admin Module Comprehensive Test Suite', () => {

  // Helper login function for Company Admin
  const loginAsCompanyAdmin = async (page) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'admin@enterprise.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /company-admin
    await expect(page).toHaveURL(/\/company-admin/, { timeout: 15000 });
  };

  // -------------------------------------------------------------
  // CA-01: Company Admin Overview & Tenant Control Tower
  // -------------------------------------------------------------
  test('CA-01: Company Admin Overview & Tenant Control Tower Telemetry', async ({ page }) => {
    await loginAsCompanyAdmin(page);

    // Verify main header
    const mainHeading = page.locator('h1', { hasText: 'Tenant' });
    await expect(mainHeading).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Control Tower').first()).toBeVisible();

    // Verify KPI sections
    await expect(page.locator('text=Connected Enterprise Hubs').first()).toBeVisible();
    await expect(page.locator('text=Recent Security & Audit Events').first()).toBeVisible();
  });

  // -------------------------------------------------------------
  // CA-02: Company Admin Sidebar Client-Side Routing Across All 6 Sub-routes
  // -------------------------------------------------------------
  test('CA-02: Sidebar Client-Side Routing Across All 6 Company Admin Sub-routes', async ({ page }) => {
    await loginAsCompanyAdmin(page);

    const routes = [
      { name: 'User & Role Governance', path: '/company-admin/users', heading: 'User & Role' },
      { name: 'Skill Taxonomy', path: '/company-admin/taxonomy', heading: 'Company Skill' },
      { name: 'Integrations Hub', path: '/company-admin/integrations', heading: 'Integrations' },
      { name: 'Security & Access', path: '/company-admin/security', heading: 'Security' },
      { name: 'Org Settings & Audit', path: '/company-admin/settings', heading: 'Organization Settings' },
      { name: 'Overview', path: '/company-admin', heading: 'Tenant' },
    ];

    for (const r of routes) {
      const navItem = page.locator('aside nav a', { hasText: r.name });
      await expect(navItem).toBeVisible();
      await navItem.click();

      await expect(page).toHaveURL(new RegExp(r.path.replace('/', '\\/')), { timeout: 10000 });
      await expect(page.locator('h1', { hasText: r.heading })).toBeVisible({ timeout: 10000 });
    }
  });

  // -------------------------------------------------------------
  // CA-03: User & Role Governance, Seat Counter & Provisioning Modal
  // -------------------------------------------------------------
  test('CA-03: User & Role Governance, Seat Counter & Provisioning Modal', async ({ page }) => {
    await loginAsCompanyAdmin(page);
    await page.goto('/company-admin/users');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'User & Role' })).toBeVisible({ timeout: 10000 });

    // Verify user search box
    await expect(page.getByPlaceholder('Search users...').or(page.locator('input[type="text"]')).first()).toBeVisible();

    // Verify trigger to provision a new user
    const addBtn = page.getByRole('button', { name: 'Provision New User' });
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    // Verify modal appears
    const modalHeading = page.locator('h2', { hasText: 'Provision New Tenant User' });
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Close modal via close button
    const closeBtn = page.locator('h2:has-text("Provision New Tenant User")').locator('..').locator('button').first();
    await closeBtn.click();
    await expect(modalHeading).toBeHidden({ timeout: 5000 });
  });

  // -------------------------------------------------------------
  // CA-04: Company Skill Taxonomy Matrix & Custom Skill Modal
  // -------------------------------------------------------------
  test('CA-04: Company Skill Taxonomy Matrix & Custom Skill Management', async ({ page }) => {
    await loginAsCompanyAdmin(page);
    await page.goto('/company-admin/taxonomy');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Company Skill' })).toBeVisible({ timeout: 10000 });

    // Verify Add Skill button exists
    const addSkillBtn = page.getByRole('button', { name: /Add.*Skill/i }).first();
    await expect(addSkillBtn).toBeVisible({ timeout: 10000 });
    await addSkillBtn.click();

    // Verify modal appears
    const modalHeading = page.locator('h2', { hasText: 'Add Custom Skill to Matrix' });
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Close modal
    const closeBtn = page.locator('h2:has-text("Add Custom Skill to Matrix")').locator('..').locator('button').first();
    await closeBtn.click();
    await expect(modalHeading).toBeHidden({ timeout: 5000 });
  });

  // -------------------------------------------------------------
  // CA-05: Integrations Hub & Enterprise Connector Configurations
  // -------------------------------------------------------------
  test('CA-05: Integrations Hub & Enterprise Connector Configurations', async ({ page }) => {
    await loginAsCompanyAdmin(page);
    await page.goto('/company-admin/integrations');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Integrations' })).toBeVisible({ timeout: 10000 });

    // Verify Add Enterprise Hub button exists
    const addHubBtn = page.getByRole('button', { name: 'Add Enterprise Hub' });
    await expect(addHubBtn).toBeVisible({ timeout: 10000 });
    await addHubBtn.click();

    // Verify modal appears
    const modalHeading = page.locator('h2', { hasText: 'Configure New Enterprise Hub' });
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Close modal
    const closeBtn = page.locator('h2:has-text("Configure New Enterprise Hub")').locator('..').locator('button').first();
    await closeBtn.click();
    await expect(modalHeading).toBeHidden({ timeout: 5000 });
  });

  // -------------------------------------------------------------
  // CA-06: Security Policies, SSO Enforcement & Session Governance
  // -------------------------------------------------------------
  test('CA-06: Security Policies, SSO Enforcement & Session Governance', async ({ page }) => {
    await loginAsCompanyAdmin(page);
    await page.goto('/company-admin/security');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Security' })).toBeVisible({ timeout: 10000 });

    // Verify core security sections
    await expect(page.locator('h2', { hasText: 'Authentication & SSO Policy' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Session & Password Policy' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Audit Log & Compliance Retention' })).toBeVisible();

    // Verify save policies button
    await expect(page.getByRole('button', { name: 'Save Security Policies' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // CA-07: Org Settings, Multi-Tier Billing & Audit Logs
  // -------------------------------------------------------------
  test('CA-07: Org Settings, Multi-Tier Billing & Audit Logs Tabs', async ({ page }) => {
    await loginAsCompanyAdmin(page);
    await page.goto('/company-admin/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Organization Settings' })).toBeVisible({ timeout: 10000 });

    // Verify General profile
    await expect(page.locator('h2', { hasText: 'General Organization Profile' })).toBeVisible();

    // Switch to Audit Logs tab
    const auditTab = page.locator('button', { hasText: /Audit Logs/i });
    await expect(auditTab).toBeVisible();
    await auditTab.click();

    // Verify Audit trail view
    await expect(page.getByPlaceholder('Search by action, user, or ID...')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Export Logs/i })).toBeVisible();
  });

  // -------------------------------------------------------------
  // CA-08: Mobile Responsive Drawer Navigation & Session Logout
  // -------------------------------------------------------------
  test('CA-08: Mobile Responsive Drawer Navigation & Secure Session Logout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsCompanyAdmin(page);

    // Verify mobile header is visible
    const mobileHeader = page.locator('header.lg\\:hidden');
    await expect(mobileHeader).toBeVisible();

    // Verify mobile menu burger button
    const burgerBtn = mobileHeader.locator('button[aria-label="Toggle menu"]');
    await expect(burgerBtn).toBeVisible();

    // Open mobile drawer
    await burgerBtn.click();

    // Click a navigation item inside mobile drawer
    const drawerItem = page.locator('aside nav a', { hasText: 'Security & Access' });
    await expect(drawerItem).toBeVisible();
    await drawerItem.click();

    // Verify navigation occurred
    await expect(page).toHaveURL(/\/company-admin\/security/, { timeout: 10000 });
    await expect(page.locator('h1', { hasText: 'Security' })).toBeVisible();

    // Click mobile header logout button
    const mobileLogoutBtn = mobileHeader.locator('button', { hasText: 'Logout' });
    await expect(mobileLogoutBtn).toBeVisible();
    await mobileLogoutBtn.click();

    // Verify redirect to login and token removal
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

});
