import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - Authentication & Onboarding Module Comprehensive Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    // Clear storage before each test for clean isolation
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  // --------------------------------------------------------------------------
  // TEST 1: LOGIN FORM UI, GLASSMORPHISM AESTHETICS & VISIBILITY CONTROLS
  // --------------------------------------------------------------------------
  test('AUTH-01: Login Form UI, Frosted Glass Layout & Password Reveal Controls', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/SkillPulse/i);

    // 1. Verify Branding & Typography
    await expect(page.locator('h2', { hasText: 'Sign in to your account' })).toBeVisible();
    await expect(page.locator('text=Enter your credentials to continue')).toBeVisible();

    // 2. Verify Left Hero Panel (Desktop)
    const heroHeading = page.locator('h1', { hasText: 'Welcome to' });
    if (await heroHeading.isVisible()) {
      await expect(page.locator('text=SkillPulse-AI').first()).toBeVisible();
      await expect(page.locator('text=84% Optimal')).toBeVisible();
      await expect(page.locator('text=+12% Live')).toBeVisible();
    }

    // 3. Verify Form Fields
    const workspaceInput = page.locator('input[name="workspace"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await expect(workspaceInput).toBeVisible();
    await expect(workspaceInput).toHaveAttribute('placeholder', /acme-corp/i);

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');

    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 4. Test Password Toggle Reveal
    await passwordInput.fill('SecretPass123!');
    const toggleBtn = page.locator('button[type="button"]:has(svg)').first();
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await toggleBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 5. Verify Remember Me & Forgot Password Navigation Link
    await expect(page.locator('input[name="rememberMe"]')).toBeVisible();
    const forgotLink = page.locator('a[href="/forgot-password"]');
    await expect(forgotLink).toBeVisible();
    await expect(forgotLink).toHaveText('Forgot Password?');
  });

  // --------------------------------------------------------------------------
  // TEST 2: AUTHENTICATION FAILURE HANDLERS & VALIDATION FEEDBACK
  // --------------------------------------------------------------------------
  test('AUTH-02: Authentication Failure Handlers & Validation Feedback', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'Sign In' });

    // Submit with non-existent user credentials
    await emailInput.fill('invalid-user@enterprise.com');
    await passwordInput.fill('WrongPass999!');
    await submitBtn.click();

    // Error banner should be rendered
    const errorBanner = page.locator('.text-red-600');
    await expect(errorBanner).toBeVisible({ timeout: 6000 });
    await expect(errorBanner).toContainText(/failed|invalid|credentials/i);

    // Typing in email or password should clear the error state
    await emailInput.fill('another-try@enterprise.com');
    await expect(errorBanner).toBeHidden();
  });

  // --------------------------------------------------------------------------
  // TEST 3: SUPER ADMIN AUTHENTICATION & DIRECT DASHBOARD REDIRECTION
  // --------------------------------------------------------------------------
  test('AUTH-03: Super Admin Sign-In & Global Governance Portal Redirection', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('superadmin@skillpulse.ai');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();

    // Should redirect to /superadmin (or /superadmin/dashboard)
    await expect(page).toHaveURL(/\/superadmin/, { timeout: 10000 });

    // Verify localStorage has valid JWT and SUPER_ADMIN user
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
    expect(token).toBeTruthy();
    expect(user.role).toBe('SUPER_ADMIN');
  });

  // --------------------------------------------------------------------------
  // TEST 4: COMPANY ADMIN AUTHENTICATION & WORKSPACE TENANT BINDING
  // --------------------------------------------------------------------------
  test('AUTH-04: Company Admin Sign-In & Workspace Tenant Binding', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('admin@enterprise.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();

    // Should navigate to /company-admin
    await expect(page).toHaveURL(/\/company-admin/, { timeout: 10000 });

    // Verify localStorage tenant assignment
    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
    expect(user.role).toBe('COMPANY_ADMIN');
    expect(user.tenantId || user.tenant).toBeTruthy();
  });

  // --------------------------------------------------------------------------
  // TEST 5: TEAM LEADER AUTHENTICATION & TEAM OVERVIEW PORTAL
  // --------------------------------------------------------------------------
  test('AUTH-05: Team Leader Sign-In & Team Overview Routing', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('leader@enterprise.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();

    // Should navigate to /team-leader
    await expect(page).toHaveURL(/\/team-leader/, { timeout: 10000 });

    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
    expect(user.role).toBe('TEAM_LEADER');
  });

  // --------------------------------------------------------------------------
  // TEST 6: EMPLOYEE AUTHENTICATION & SKILL DASHBOARD
  // --------------------------------------------------------------------------
  test('AUTH-06: Employee Sign-In & Personal Skill Intelligence Landing', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('emp@enterprise.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();

    // Should navigate to /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
    expect(user.role).toBe('EMPLOYEE');
  });

  // --------------------------------------------------------------------------
  // TEST 7: HR MANAGER AUTHENTICATION & WORKFORCE ANALYTICS PORTAL
  // --------------------------------------------------------------------------
  test('AUTH-07: HR Manager Sign-In & Enterprise Workforce Analytics Landing', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]').fill('hr@enterprise.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();

    // Should navigate to /hr-dashboard
    await expect(page).toHaveURL(/\/hr-dashboard/, { timeout: 10000 });

    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
    expect(user.role).toBe('HR_MANAGER');
  });

  // --------------------------------------------------------------------------
  // TEST 8: UNAUTHENTICATED ACCESS GUARDS ON CORE DASHBOARDS
  // --------------------------------------------------------------------------
  test('AUTH-08: Unauthenticated Route Guards Redirect to Login', async ({ page }) => {
    const protectedPaths = [
      '/dashboard',
      '/team-leader',
      '/hr-dashboard',
      '/company-admin',
      '/superadmin/dashboard'
    ];

    for (const p of protectedPaths) {
      // Clear token & user
      await page.goto('/login');
      await page.evaluate(() => localStorage.clear());

      // Attempt direct deep-link navigation
      await page.goto(p);

      // Guard must bounce to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    }
  });

  // --------------------------------------------------------------------------
  // TEST 9: CROSS-ROLE RBAC DEFENSE & STRICT ISOLATION
  // --------------------------------------------------------------------------
  test('AUTH-09: Cross-Role Route Defense & Unauthorized Redirection', async ({ page }) => {
    // 1. Log in as an Employee
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('emp@enterprise.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Employee attempts unauthorized access to /superadmin
    await page.goto('/superadmin');
    // Guard must redirect to the user's role-specific home: /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });

    // 3. Employee attempts unauthorized access to /company-admin
    await page.goto('/company-admin');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });
  });

  // --------------------------------------------------------------------------
  // TEST 10: FORGOT PASSWORD RECOVERY DISPATCH & STEP 2 RESET UI
  // --------------------------------------------------------------------------
  test('AUTH-10: Forgot Password Token Dispatch & Reset Security Form', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveURL(/\/forgot-password/);

    // 1. Verify Step 1 UI
    await expect(page.locator('h2', { hasText: 'Forgot Password?' })).toBeVisible();
    const emailField = page.locator('input[type="email"]');
    await expect(emailField).toBeVisible();

    // 2. Submit password recovery request
    await emailField.fill('emp@enterprise.com');
    const submitBtn = page.locator('button[type="submit"]', { hasText: 'Send Reset Instructions' });
    await submitBtn.click();

    // 3. Verify confirmation screen
    await expect(page.locator('h2', { hasText: 'Check Your Email' })).toBeVisible({ timeout: 6000 });
    await expect(page.locator('text=emp@enterprise.com')).toBeVisible();

    // 4. Click manual token entry to transition to Step 2
    const enterTokenBtn = page.locator('button', { hasText: 'Enter Reset Token Manually' });
    await enterTokenBtn.click();

    // 5. Verify Step 2 (Reset Password Form) fields
    await expect(page.locator('h2', { hasText: 'Set New Password' })).toBeVisible();
    await expect(page.locator('input[placeholder*="token" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="At least 6 characters" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Re-enter new password" i]')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 11: MULTI-TENANT ONBOARDING, DYNAMIC SLUG GENERATION & PLAN TIERS
  // --------------------------------------------------------------------------
  test('AUTH-11: Multi-Tenant Onboarding, Dynamic Slug Generator & Subscription Plans', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/\/signup/);

    // 1. Verify Mode Toggle Header
    await expect(page.locator('h2', { hasText: 'Create your account' })).toBeVisible();
    const createBtn = page.locator('button', { hasText: 'Create New Workspace' });
    const joinBtn = page.locator('button', { hasText: 'Join Existing Workspace' });
    await expect(createBtn).toBeVisible();
    await expect(joinBtn).toBeVisible();

    // 2. In "Create" mode: Test Dynamic Subdomain Slug Generation
    const orgInput = page.locator('input[name="organizationName"]');
    const slugInput = page.locator('input[name="workspaceSubdomain"]');
    await orgInput.fill('Nova Tech 2026');
    // Slug should auto-sanitize to lowercase alphanumeric
    await expect(slugInput).toHaveValue('novatech2026');

    // 3. Verify Plan Tier Select Options with Fixed Seat Limits
    const planSelect = page.locator('select[name="selectedPlan"]');
    await expect(planSelect).toBeVisible();
    const options = await planSelect.locator('option').allTextContents();
    expect(options.some(t => t.includes('Starter') && t.includes('30 Seats'))).toBe(true);
    expect(options.some(t => t.includes('Professional') && t.includes('250 Seats'))).toBe(true);
    expect(options.some(t => t.includes('Enterprise AI') && t.includes('1000 Seats'))).toBe(true);

    // 4. Switch to "Join Existing Workspace" Mode
    await joinBtn.click();
    await expect(page.locator('input[name="inviteCode"]')).toBeVisible();
    await expect(page.locator('input[placeholder="ORG-XXXX-2026"]')).toBeVisible();

    // 5. Verify Role Selection Dropdown in Join Mode (Employee, Team Leader, HR Manager)
    const roleSelect = page.locator('select[name="requestedRole"]');
    await expect(roleSelect).toBeVisible();
    const joinRoleOptions = await roleSelect.locator('option').allTextContents();
    expect(joinRoleOptions).toContain('Employee');
    expect(joinRoleOptions).toContain('Team Leader');
    expect(joinRoleOptions).toContain('HR Manager');
  });

});
