// @ts-check
import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - Super Admin Module Comprehensive Test Suite', () => {

  // Helper login function for Super Admin
  const loginAsSuperAdmin = async (page) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'superadmin@skillpulse.ai');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /superadmin or /superadmin/dashboard
    await expect(page).toHaveURL(/\/superadmin/, { timeout: 15000 });
  };

  // -------------------------------------------------------------
  // SA-01: Super Admin System Control Tower Overview & Platform Telemetry
  // -------------------------------------------------------------
  test('SA-01: Super Admin System Control Tower Overview & Platform Telemetry', async ({ page }) => {
    await loginAsSuperAdmin(page);

    // Verify main header
    const mainHeading = page.locator('h1', { hasText: 'System' });
    await expect(mainHeading).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Control Tower').first()).toBeVisible();

    // Verify core system control tower sections
    await expect(page.locator('h2', { hasText: 'Top Enterprise Tenants by Seat Quota' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2', { hasText: 'Database & Engine Health' })).toBeVisible();
    await expect(page.locator('h2', { hasText: 'Live Platform Security & Operational Stream' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // SA-02: Super Admin Sidebar Client-Side Routing Across All 10 Sub-routes
  // -------------------------------------------------------------
  test('SA-02: Sidebar Client-Side Routing Across All 10 Super Admin Sub-routes', async ({ page }) => {
    await loginAsSuperAdmin(page);

    const routes = [
      { name: 'Tenant Management', path: '/superadmin/tenants', heading: 'Tenant & Organization Management' },
      { name: 'User Management', path: '/superadmin/users', heading: 'Live User & RBAC Directory' },
      { name: 'Role Management', path: '/superadmin/roles', heading: 'Role-Based Access Control' },
      { name: 'Skill Taxonomy', path: '/superadmin/taxonomy', heading: 'Skill Taxonomy Engine' },
      { name: 'AI Configuration', path: '/superadmin/ai-config', heading: 'AI Engine & Provider Governance Hub' },
      { name: 'Global Integrations', path: '/superadmin/integrations', heading: 'Global Enterprise Connectors' },
      { name: 'Billing & Subscriptions', path: '/superadmin/billing', heading: 'Billing & Subscription Management' },
      { name: 'System & Security', path: '/superadmin/settings', heading: 'System Health & Operational Telemetry' },
      { name: 'Audit Trail Logs', path: '/superadmin/audit-logs', heading: 'Platform Audit Trail Logs' },
      { name: 'Admin Dashboard', path: '/superadmin/dashboard', heading: 'System' },
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
  // SA-03: Tenant Management & Multi-Tenant Isolated Workspace Onboarding
  // -------------------------------------------------------------
  test('SA-03: Tenant Management & Multi-Tenant Isolated Workspace Onboarding', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/tenants');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Tenant & Organization Management' })).toBeVisible({ timeout: 10000 });

    // Verify search input
    await expect(page.getByPlaceholder('Search by workspace, domain, or ID...')).toBeVisible();

    // Verify trigger to onboard new client tenant
    const onboardBtn = page.getByRole('button', { name: 'Onboard New Tenant' });
    await expect(onboardBtn).toBeVisible({ timeout: 10000 });
    await onboardBtn.click();

    // Verify modal appears
    const modalHeading = page.locator('h2', { hasText: 'Onboard New Client Tenant' });
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Close modal via Cancel button
    const cancelBtn = page.getByRole('button', { name: 'Cancel' }).first();
    await cancelBtn.click();
    await expect(modalHeading).toBeHidden({ timeout: 5000 });
  });

  // -------------------------------------------------------------
  // SA-04: User Management & Cross-Tenant RBAC Governance
  // -------------------------------------------------------------
  test('SA-04: User Management & Cross-Tenant RBAC Governance', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/users');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Live User & RBAC Directory' })).toBeVisible({ timeout: 10000 });

    // Verify search input
    await expect(page.getByPlaceholder('Search user name, email, department, or tenant...')).toBeVisible();

    // Verify trigger to provision new user
    const provisionBtn = page.getByRole('button', { name: 'Provision New User' });
    await expect(provisionBtn).toBeVisible({ timeout: 10000 });
    await provisionBtn.click();

    // Verify modal appears
    const modalHeading = page.locator('h2', { hasText: 'Provision New User Account' });
    await expect(modalHeading).toBeVisible({ timeout: 5000 });

    // Close modal via Cancel button
    const cancelBtn = page.getByRole('button', { name: 'Cancel' }).first();
    await cancelBtn.click();
    await expect(modalHeading).toBeHidden({ timeout: 5000 });
  });

  // -------------------------------------------------------------
  // SA-05: System Role Hierarchy & Granular Permission Governance
  // -------------------------------------------------------------
  test('SA-05: System Role Hierarchy & Granular Permission Governance', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/roles');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Role-Based Access Control' })).toBeVisible({ timeout: 10000 });

    // Verify Role Hierarchy heading
    await expect(page.locator('h2', { hasText: /System Role Hierarchy/i })).toBeVisible();

    // Verify core system roles in the list
    await expect(page.locator('h2', { hasText: 'SuperAdmin' })).toBeVisible();
    await expect(page.locator('text=Tenant Admin').first()).toBeVisible();
    await expect(page.locator('text=HR Manager').first()).toBeVisible();
  });

  // -------------------------------------------------------------
  // SA-06: Skill Taxonomy Engine & Global Competency Catalog
  // -------------------------------------------------------------
  test('SA-06: Skill Taxonomy Engine & Global Competency Catalog', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/taxonomy');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Skill Taxonomy Engine' })).toBeVisible({ timeout: 10000 });

    // Verify search input and Add Skill Node button
    await expect(page.getByPlaceholder('Search skill nodes, levels, tiers, or tags...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Skill Node' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // SA-07: AI Engine & Provider Governance Hub
  // -------------------------------------------------------------
  test('SA-07: AI Engine & Provider Governance Hub', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/ai-config');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'AI Engine & Provider Governance Hub' })).toBeVisible({ timeout: 10000 });

    // Verify test connection and save buttons
    await expect(page.getByRole('button', { name: 'Test AI Engine Connection' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save AI Engine Settings' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // SA-08: Global Enterprise Connectors & Ecosystem Integrations
  // -------------------------------------------------------------
  test('SA-08: Global Enterprise Connectors & Ecosystem Integrations', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/integrations');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Global Enterprise Connectors' })).toBeVisible({ timeout: 10000 });

    // Verify search input and action buttons
    await expect(page.getByPlaceholder('Search connectors by name or description...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Trigger Global Sync' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Custom Integration' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // SA-09: Billing & Subscription Management & Financial Metrics
  // -------------------------------------------------------------
  test('SA-09: Billing & Subscription Management & Financial Metrics', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/billing');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Billing & Subscription Management' })).toBeVisible({ timeout: 10000 });

    // Verify ARR and MRR metrics
    await expect(page.locator('text=Annual Recurring Revenue (ARR)')).toBeVisible();
    await expect(page.locator('text=Monthly Recurring Revenue (MRR)')).toBeVisible();

    // Switch to SaaS Tier Models tab
    const modelsTab = page.getByRole('button', { name: 'SaaS Tier Models & Gateway' });
    await expect(modelsTab).toBeVisible();
    await modelsTab.click();

    // Verify Payment Gateway section appears
    await expect(page.locator('h3', { hasText: 'Payment Gateway Integration Engine' })).toBeVisible({ timeout: 5000 });
  });

  // -------------------------------------------------------------
  // SA-10: System Health & Real-time Operational Telemetry
  // -------------------------------------------------------------
  test('SA-10: System Health & Real-time Operational Telemetry', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/settings');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'System Health & Operational Telemetry' })).toBeVisible({ timeout: 10000 });

    // Verify live event search and refresh button
    await expect(page.getByPlaceholder('Search trace ID, action, user, or service...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Refresh Telemetry' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // SA-11: Platform Audit Trail Logs & SOC 2 Security Stream
  // -------------------------------------------------------------
  test('SA-11: Platform Audit Trail Logs & SOC 2 Security Stream', async ({ page }) => {
    await loginAsSuperAdmin(page);
    await page.goto('/superadmin/audit-logs');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Platform Audit Trail Logs' })).toBeVisible({ timeout: 10000 });

    // Verify audit log search and CSV export button
    await expect(page.getByPlaceholder('Search actor, target, or action...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Export Compliance Audit (CSV)' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // SA-12: Mobile Responsive Drawer Navigation & Session Logout
  // -------------------------------------------------------------
  test('SA-12: Mobile Responsive Drawer Navigation & Secure Session Logout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsSuperAdmin(page);

    // Verify mobile header is visible
    const mobileHeader = page.locator('header.lg\\:hidden');
    await expect(mobileHeader).toBeVisible();

    // Verify mobile menu burger button
    const burgerBtn = mobileHeader.locator('button[aria-label="Toggle menu"]');
    await expect(burgerBtn).toBeVisible();

    // Open mobile drawer
    await burgerBtn.click();

    // Click a navigation item inside mobile drawer
    const drawerItem = page.locator('aside nav a', { hasText: 'System & Security' });
    await expect(drawerItem).toBeVisible();
    await drawerItem.click();

    // Verify navigation occurred
    await expect(page).toHaveURL(/\/superadmin\/settings/, { timeout: 10000 });
    await expect(page.locator('h1', { hasText: 'System Health & Operational Telemetry' })).toBeVisible();

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
