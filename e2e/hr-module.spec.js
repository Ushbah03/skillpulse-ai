// @ts-check
import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - HR Analytics Module Comprehensive Test Suite', () => {

  // Helper login function for HR Manager
  const loginAsHR = async (page) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.fill('input[type="email"]', 'hr@enterprise.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to /hr-dashboard
    await expect(page).toHaveURL(/\/hr-dashboard/, { timeout: 15000 });
  };

  // -------------------------------------------------------------
  // HR-01: HR Dashboard Overview & Enterprise KPI Telemetry
  // -------------------------------------------------------------
  test('HR-01: HR Dashboard Overview & Enterprise KPI Telemetry', async ({ page }) => {
    await loginAsHR(page);

    // Verify main header
    const mainHeading = page.locator('h1', { hasText: 'HR' });
    await expect(mainHeading).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Workforce intelligence overview & real-time analytics').first()).toBeVisible();

    // Verify presence of department skill distribution and intelligence card
    await expect(page.locator('text=Exact skill tier breakdown by department').first()).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-02: HR Sidebar Client-Side Routing Across All 10 Sub-routes
  // -------------------------------------------------------------
  test('HR-02: Sidebar Client-Side Routing Across All 10 HR Sub-routes', async ({ page }) => {
    await loginAsHR(page);

    const routes = [
      { name: 'Organization Skill Analytics', path: '/hr-dashboard/skill-analytics', heading: 'Organization Skill Analytics' },
      { name: 'Workforce Planning', path: '/hr-dashboard/workforce-planning', heading: 'Workforce Planning' },
      { name: 'Compliance Management', path: '/hr-dashboard/compliance-management', heading: 'Compliance Management' },
      { name: 'Career & Succession Planning', path: '/hr-dashboard/career-planning', heading: 'Executive Leadership & Succession Pipeline' },
      { name: 'Skill Gap Reports', path: '/hr-dashboard/skill-gap-reports', heading: 'Enterprise Skill Gap Analysis' },
      { name: 'Training Program Management', path: '/hr-dashboard/training-management', heading: 'Training & Development' },
      { name: 'Employee Performance Reports', path: '/hr-dashboard/performance-reports', heading: 'Employee Performance Reports' },
      { name: 'Department Comparison', path: '/hr-dashboard/department-comparison', heading: 'Department Comparison' },
      { name: 'HR Insights & Forecasting', path: '/hr-dashboard/hr-insights', heading: 'HR Insights & Forecasting' },
      { name: 'Dashboard', path: '/hr-dashboard', heading: 'HR' },
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
  // HR-03: Organization Skill Analytics & Heatmap Intelligence
  // -------------------------------------------------------------
  test('HR-03: Organization Skill Analytics & Heatmap Intelligence', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/skill-analytics');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Organization Skill Analytics' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Workforce Skill Gap Heatmap' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Skill Gap by Category' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Gap Severity Distribution' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Employee Skill Gap Details' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-04: Strategic Workforce Planning & 12-Month Forecasting
  // -------------------------------------------------------------
  test('HR-04: Strategic Workforce Planning & 12-Month Forecasting', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/workforce-planning');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Workforce Planning' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Workforce Forecast Trend (12 Months)' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Hiring Demand by Department' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Workforce Allocation Distribution' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Role-Based Workforce Demand' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-05: Compliance Management & Certification Tracking
  // -------------------------------------------------------------
  test('HR-05: Compliance Management & Certification Tracking', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/compliance-management');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Compliance Management' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Compliance Status Distribution' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Compliance Trend (12 Months)' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Certification Expiry Timeline' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Employee Certification Compliance' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-06: Executive Leadership & Succession Pipeline
  // -------------------------------------------------------------
  test('HR-06: Executive Leadership & Succession Pipeline', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/career-planning');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Executive Leadership & Succession Pipeline' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Succession Depth Chart' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'AI Competency Radar' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Top Pipeline Skill Deficits' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Target Career Development Trajectory' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-07: Enterprise Skill Gap Reports & Deficiency Tracking
  // -------------------------------------------------------------
  test('HR-07: Enterprise Skill Gap Reports & Deficiency Tracking', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/skill-gap-reports');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Enterprise Skill Gap Analysis' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Competency Heatmap' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Dept Skill Deficiency Index' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'High-Priority Missing Skills' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Critical Skill Gaps by Individual Employee' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-08: Training & Development Program Management & Learning Funnel
  // -------------------------------------------------------------
  test('HR-08: Training & Development Program Management & Learning Funnel', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/training-management');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Training & Development' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h2', { hasText: 'Current Training Programs' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Completion Trends' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Program Popularity' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Learning Funnel' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Top Performers' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-09: Employee Performance Reports & Distribution Analytics
  // -------------------------------------------------------------
  test('HR-09: Employee Performance Reports & Distribution Analytics', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/performance-reports');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Employee Performance Reports' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Performance Distribution' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Performance Details' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-10: Cross-Departmental Comparison & Skill Maturity Matrix
  // -------------------------------------------------------------
  test('HR-10: Cross-Departmental Comparison & Skill Maturity Matrix', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/department-comparison');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'Department Comparison' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'Performance Trend Comparison' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Skill Maturity Heatmap' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Training Completion Rate' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Department Performance Ranking' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-11: Predictive HR Insights & AI Strategic Recommendations
  // -------------------------------------------------------------
  test('HR-11: Predictive HR Insights & AI Strategic Recommendations', async ({ page }) => {
    await loginAsHR(page);
    await page.goto('/hr-dashboard/hr-insights');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1', { hasText: 'HR Insights & Forecasting' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('h3', { hasText: 'AI Strategic Recommendations' })).toBeVisible();
  });

  // -------------------------------------------------------------
  // HR-12: Mobile Responsive Drawer Navigation & Session Logout
  // -------------------------------------------------------------
  test('HR-12: Mobile Responsive Drawer Navigation & Secure Session Logout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await loginAsHR(page);

    // Verify mobile header is visible
    const mobileHeader = page.locator('header.lg\\:hidden');
    await expect(mobileHeader).toBeVisible();

    // Verify mobile menu burger button
    const burgerBtn = mobileHeader.locator('button[aria-label="Toggle menu"]');
    await expect(burgerBtn).toBeVisible();

    // Open mobile drawer
    await burgerBtn.click();

    // Click a navigation item inside mobile drawer
    const drawerItem = page.locator('aside nav a', { hasText: 'Compliance Management' });
    await expect(drawerItem).toBeVisible();
    await drawerItem.click();

    // Verify navigation occurred
    await expect(page).toHaveURL(/\/hr-dashboard\/compliance-management/, { timeout: 10000 });
    await expect(page.locator('h1', { hasText: 'Compliance Management' })).toBeVisible();

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
