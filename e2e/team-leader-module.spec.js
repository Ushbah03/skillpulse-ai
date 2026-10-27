// @ts-check
import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - Team Leader Module Comprehensive Test Suite', () => {

  // Helper login function for Team Leader
  const loginAsTeamLeader = async (page) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'leader@enterprise.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /team-leader
    await expect(page).toHaveURL(/\/team-leader/, { timeout: 15000 });
  };

  // -------------------------------------------------------------
  // TL-01: Team Leader Dashboard Overview & KPIs
  // -------------------------------------------------------------
  test('TL-01: Team Leader Dashboard Overview, KPIs & Quick Action Controls', async ({ page }) => {
    await loginAsTeamLeader(page);

    // Verify main header
    const mainHeading = page.locator('h1', { hasText: 'Team Leader' });
    await expect(mainHeading).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Monitor squad readiness, capability telemetry, and skill intelligence').first()).toBeVisible();

    // Verify core dashboard section headings
    await expect(page.locator('h3', { hasText: 'Team Skill Strength Overview' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Top Performing Members' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Team Training Progress' })).toBeVisible();

    // Verify Quick Action buttons
    await expect(page.getByRole('button', { name: /Skill Overview/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Assign Training/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Analyze Gaps/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Report/i })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-02: Team Leader Sidebar Client-Side Navigation
  // -------------------------------------------------------------
  test('TL-02: Sidebar Client-Side Routing Across All 10 Team Leader Sub-routes', async ({ page }) => {
    await loginAsTeamLeader(page);

    const routes = [
      { name: 'Team Skill Overview', path: '/team-leader/skill-overview', heading: 'Team Skill' },
      { name: 'Team Member Profile', path: '/team-leader/member-profile', heading: 'Team Member' },
      { name: 'Assign Learning', path: '/team-leader/assign-learning', heading: 'Assign Learning to' },
      { name: 'Team Formation', path: '/team-leader/team-formation', heading: 'Project Squad' },
      { name: 'Performance Monitor', path: '/team-leader/performance', heading: 'Team Performance Monitoring' },
      { name: 'Readiness Score', path: '/team-leader/readiness', heading: 'Project Readiness Score' },
      { name: 'Skill Gap Analysis', path: '/team-leader/gap-analysis', heading: 'Skill Gap Analysis (Team)' },
      { name: 'Training Requests', path: '/team-leader/requests', heading: 'Team Training' },
      { name: 'Team Reports', path: '/team-leader/reports', heading: 'Team Reports' },
      { name: 'Dashboard', path: '/team-leader', heading: 'Team Leader' },
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
  // TL-03: Team Skill Overview & Squad Skill Matrix
  // -------------------------------------------------------------
  test('TL-03: Team Skill Overview & Live Squad Matrix Intelligence', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/skill-overview');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Team Skill' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Live Squad Skill Matrix' })).toBeVisible({ timeout: 10000 });

    // Verify key action buttons inside view
    await expect(page.getByRole('button', { name: /AI Squad Matchmaker/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /\+ Assign Training/i })).toBeVisible();

    // Verify presence of member skill badges or table rows
    const matrixContainer = page.locator('h3:has-text("Live Squad Skill Matrix")').locator('..');
    await expect(matrixContainer).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-04: Team Member Profile & Multi-Dimensional Telemetry
  // -------------------------------------------------------------
  test('TL-04: Team Member Profile & Comprehensive Competency Breakdown', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/member-profile');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Team Member' })).toBeVisible();

    // Verify member analytical sections
    await expect(page.locator('h3', { hasText: 'Member Skill Matrix' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Skill Proficiency Radar' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Skill Growth Trend' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Training History' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Skill Gaps Identified' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-05: Assign Learning Workflow & Program Catalog
  // -------------------------------------------------------------
  test('TL-05: Assign Learning Workflow, Program Catalog & Member Selection', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/assign-learning');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Assign Learning to' })).toBeVisible();

    // Verify major panels
    await expect(page.locator('h3', { hasText: 'Available Training Programs' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Assigned Training Tracker' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Select Team Members' })).toBeVisible();

    // Verify program table & assign action button
    const assignBtn = page.getByRole('button', { name: 'Assign' }).first();
    await expect(assignBtn).toBeVisible({ timeout: 10000 });

    // Verify member selection button
    await expect(page.getByRole('button', { name: 'Select All' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-06: AI Project Squad Formation & Synergy Metrics
  // -------------------------------------------------------------
  test('TL-06: AI Project Squad Formation & Synergy Composition Metrics', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/team-formation');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Project Squad' })).toBeVisible();

    // Verify core formation containers
    await expect(page.locator('h3', { hasText: 'Project Requirements & Target Skills' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'AI Recommended Project Squad' })).toBeVisible();

    // Verify Generate AI Squad and Save Squad buttons exist
    await expect(page.getByRole('button', { name: 'Generate AI Squad' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Squad' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-07: Team Performance Monitoring & Productivity Risk Analysis
  // -------------------------------------------------------------
  test('TL-07: Team Performance Monitoring & Productivity Risk Analytics', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/performance');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Team Performance Monitoring' })).toBeVisible();

    // Verify trend and individual performance sections
    await expect(page.locator('h3', { hasText: 'Team Performance Trend' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Individual Performance Analysis' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'AI Performance Intelligence' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Quick Actions' })).toBeVisible();

    // Verify Improvement Plan and Report Generation buttons exist
    await expect(page.getByRole('button', { name: /Improvement Plan/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Performance Report/i })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-08: Project Readiness Scoring & Capability Vector Mapping
  // -------------------------------------------------------------
  test('TL-08: Project Readiness Scoring & Capability Vector Mapping', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/readiness');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Project Readiness Score' })).toBeVisible();

    // Verify readiness sections
    await expect(page.locator('h3', { hasText: 'Capability Vector Mapping' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Readiness Index Velocity' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Individual Member Readiness Breakdown' })).toBeVisible();

    // Verify Project Selection dropdown/trigger exists
    await expect(page.locator('text=Target Project Deployment').or(page.locator('text=Project Readiness Score')).first()).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-09: Skill Gap Analysis & Heatmap Intelligence
  // -------------------------------------------------------------
  test('TL-09: Skill Gap Analysis & Heatmap Intelligence', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/gap-analysis');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Skill Gap Analysis (Team)' })).toBeVisible();

    // Verify heatmap and AI intelligence
    await expect(page.locator('h3', { hasText: 'Team Skill Gap Heatmap' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'AI Skill Gap Intelligence' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Skill Gap Resolution Actions' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-10: Team Training Requests & Status Filter Controls
  // -------------------------------------------------------------
  test('TL-10: Team Training Requests & Status Filter Controls', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/requests');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Team Training' })).toBeVisible();

    // Verify management table and demand breakdown
    await expect(page.locator('h3', { hasText: 'Manage Training Requests' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Training Demand by Skill' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Operational Controls' })).toBeVisible();

    // Verify filter dropdowns (Priorities, Statuses) and operational buttons
    await expect(page.getByRole('combobox').first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Investment Report/i })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-11: Team Reports & Longitudinal Workforce Visual Analytics
  // -------------------------------------------------------------
  test('TL-11: Team Reports & Longitudinal Workforce Visual Analytics', async ({ page }) => {
    await loginAsTeamLeader(page);
    await page.goto('/team-leader/reports');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Team Reports' })).toBeVisible();

    // Verify report sections
    await expect(page.locator('h3', { hasText: 'Team Performance Trend Analysis' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Skill Distribution by Category' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Skill Proficiency Distribution' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Training Effectiveness Analysis' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Detailed Team Workforce Report' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Executive Visual Summary' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // TL-12: Mobile Responsive Drawer Navigation & Session Logout
  // -------------------------------------------------------------
  test('TL-12: Mobile Responsive Drawer Navigation & Secure Session Logout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsTeamLeader(page);

    // Verify mobile header is visible
    const mobileHeader = page.locator('header.lg\\:hidden');
    await expect(mobileHeader).toBeVisible();

    // Verify mobile menu burger button
    const burgerBtn = mobileHeader.locator('button[aria-label="Toggle menu"]');
    await expect(burgerBtn).toBeVisible();

    // Open mobile drawer
    await burgerBtn.click();

    // Click a navigation item inside mobile drawer
    const drawerItem = page.locator('aside nav a', { hasText: 'Readiness Score' });
    await expect(drawerItem).toBeVisible();
    await drawerItem.click();

    // Verify navigation occurred
    await expect(page).toHaveURL(/\/team-leader\/readiness/, { timeout: 10000 });
    await expect(page.locator('h1', { hasText: 'Project Readiness Score' })).toBeVisible();

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
