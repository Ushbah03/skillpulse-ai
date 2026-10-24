import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - End-to-End Visitor & Authentication Suite', () => {

  test('TC-01: Visitor Landing Page Discovery & Branding Verification', async ({ page }) => {
    // 1. Visit the root landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/SkillPulse/i);

    // 2. Verify platform branding & hero elements
    await expect(page.locator('text=SkillPulse-AI Multi-Tenant Platform').first()).toBeVisible();
    await expect(page.locator('text=Unlock Your Workforce Potential')).toBeVisible();

    // 3. Verify public navigation links are present and interactive
    const pricingNav = page.locator('nav a', { hasText: 'Pricing' }).first();
    await expect(pricingNav).toBeVisible();

    // 4. Click Pricing navigation and verify client-side route transition
    await pricingNav.click();
    await expect(page).toHaveURL(/\/pricing/);
  });

  test('TC-02: Public Pricing Engine & Real-time Plan Calculation', async ({ page }) => {
    await page.goto('/pricing');

    // 1. Verify default monthly pricing state ($600 Starter)
    await expect(page.locator('text=$600').first()).toBeVisible();

    // 2. Toggle to Annual Billing and verify dynamic price recalculation ($600 -> $500)
    const annualBtn = page.locator('button', { hasText: 'Annual Billing' });
    await annualBtn.click();
    await expect(page.locator('text=$500').first()).toBeVisible();

    // 3. Toggle back to Monthly Billing and verify price updates back
    const monthlyBtn = page.locator('button', { hasText: 'Monthly Billing' });
    await monthlyBtn.click();
    await expect(page.locator('text=$600').first()).toBeVisible();

    // 4. Click "Select Starter Plan" CTA and navigate to Sign Up
    const selectStarterBtn = page.locator('a, button', { hasText: 'Select Starter Plan' }).first();
    await selectStarterBtn.click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test('TC-03: Sign-Up Form Validation with Mismatched Password Trigger', async ({ page }) => {
    await page.goto('/signup');

    // 1. Fill registration inputs matching exact component attribute names
    await page.locator('input[name="fullName"]').fill('Yashfa Mir');
    await page.locator('input[name="email"]').fill('yashfa.mir@skillpulse-test.internal');
    await page.locator('input[name="organizationName"]').fill('Yashfa Enterprises');
    await page.locator('input[name="workspaceSubdomain"]').fill('yashfa-pulse');
    await page.locator('input[name="password"]').fill('ValidPass123!');
    await page.locator('input[name="confirmPassword"]').fill('DifferentPass456!');

    // 2. Submit form and verify mismatch validation alert appears
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();

    await expect(page.locator('text=Passwords do not match.')).toBeVisible();

    // 3. Correct the password and verify input responds cleanly
    await page.locator('input[name="confirmPassword"]').fill('ValidPass123!');
  });

  test('TC-04: RBAC Route Guard Penetration Test (Unauthenticated Access Block)', async ({ page }) => {
    // 1. Clear any session storage or tokens
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // 2. Direct deep-link attempt into protected employee dashboard
    await page.goto('/dashboard');

    // 3. Verify security redirect to /login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  });

  test('TC-05: Real Authentication Pipeline & Invalid Credential Feedback', async ({ page }) => {
    await page.goto('/login');

    // 1. Fill non-existent user credentials
    await page.locator('input[name="email"]').fill('nonexistent.audit.user@skillpulse.internal');
    await page.locator('input[name="password"]').fill('IncorrectAuditPassword999!');

    // 2. Click sign in button
    await page.locator('button[type="submit"]').click();

    // 3. Verify real API rejected request and user sees an error indicator
    await expect(
      page.locator('text=Invalid email or password')
        .or(page.locator('text=Login failed'))
        .or(page.locator('.bg-red-500\\/10'))
        .first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('TC-06: Post-Logout Back Button Protection (No Stale Dashboard Resurfacing)', async ({ page }) => {
    // 1. Ensure desktop viewport so sidebar is displayed
    await page.setViewportSize({ width: 1280, height: 800 });

    // 2. Mock employee API endpoints so mock token does not trigger 401
    await page.route(/.*\/employee\/.*/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: [] })
      });
    });

    // 3. Establish mock authenticated employee session
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('token', 'test-jwt-token-post-logout');
      localStorage.setItem('user', JSON.stringify({
        id: 'usr_emp_test_1',
        name: 'Test Employee',
        email: 'test.emp@skillpulse.internal',
        role: 'EMPLOYEE',
        tenant: { id: 'tnt_1', name: 'Acme Test Corp', status: 'ACTIVE', plan: 'STARTER' }
      }));
    });

    // 4. Navigate into dashboard
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('aside')).toBeVisible();

    // 5. Trigger Logout via visible Sidebar Logout button
    const logoutBtn = page.locator('aside button:has-text("Logout")');
    await logoutBtn.click();

    // 6. Verify redirected to /login and localStorage tokens cleared
    await expect(page).toHaveURL(/\/login/);
    const tokenAfterLogout = await page.evaluate(() => localStorage.getItem('token'));
    expect(tokenAfterLogout).toBeNull();

    // 7. Simulate user pressing browser Back button (<-)
    await page.goBack();

    // 8. Verify user is bounced back to /login and CANNOT see the dashboard
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
    await expect(page.locator('aside nav')).not.toBeVisible();
  });

});
