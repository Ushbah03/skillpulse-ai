import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - Employee Portal Module Comprehensive Test Suite', () => {

  // Authenticate as verified Employee before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());

    // Login as Employee
    await page.locator('input[name="email"]').fill('emp@enterprise.com');
    await page.locator('input[name="password"]').fill('Password123!');
    await page.locator('button[type="submit"]').click();

    // Ensure we have safely landed on the employee portal
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 12000 });
  });

  // --------------------------------------------------------------------------
  // TEST 1: EMPLOYEE DASHBOARD OVERVIEW, KPI STATS & RADAR TELEMETRY
  // --------------------------------------------------------------------------
  test('EMP-01: Employee Dashboard Overview, KPI Stats & Radar Telemetry', async ({ page }) => {
    await page.goto('/dashboard');

    // 1. Verify Header & User Profile Info
    await expect(page.locator('h1', { hasText: 'Employee Dashboard' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Jane Doe').first()).toBeVisible();

    // 2. Verify Core KPI Metric Cards
    await expect(page.locator('text=Total Skills').first()).toBeVisible();
    await expect(page.locator('text=Validated in DB').or(page.locator('text=Validated Skills')).first()).toBeVisible();
    await expect(page.locator('text=Active Gaps').first()).toBeVisible();

    // 3. Verify Radar Telemetry Chart Container
    const radarChart = page.locator('.recharts-responsive-container').or(page.locator('.recharts-wrapper')).first();
    await expect(radarChart).toBeVisible({ timeout: 8000 });

    // 4. Verify Quick Section Headings
    await expect(page.locator('h3', { hasText: 'Skill Proficiency Matrix' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Skill Gap Summary' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Live Courses & Learning Progress' })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 2: SIDEBAR CLIENT-SIDE ROUTING & ACTIVE TAB TRANSITIONS
  // --------------------------------------------------------------------------
  test('EMP-02: Sidebar Client-Side Routing & Active Tab Transitions', async ({ page }) => {
    await page.goto('/dashboard');

    const employeeNavLinks = [
      { text: 'My Skill Profile', path: '/dashboard/profile' },
      { text: 'Skill Assessment', path: '/dashboard/assessment' },
      { text: 'Assessment Results', path: '/dashboard/results' },
      { text: 'Learning Recs', path: '/dashboard/learning' },
      { text: 'Course Details', path: '/dashboard/courses' },
      { text: 'My Progress', path: '/dashboard/progress' },
      { text: 'Certifications', path: '/dashboard/certifications' },
      { text: 'Career Paths', path: '/dashboard/career' }
    ];

    for (const item of employeeNavLinks) {
      const link = page.locator(`aside a:has-text("${item.text}")`).first();
      await expect(link).toBeVisible();
      await link.click();
      await expect(page).toHaveURL(new RegExp(item.path), { timeout: 8000 });
    }
  });

  // --------------------------------------------------------------------------
  // TEST 3: MY SKILL PROFILE COMPETENCY MATRIX & ADD SKILL MODAL
  // --------------------------------------------------------------------------
  test('EMP-03: My Skill Profile Competency Matrix & Add Skill Modal', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL(/\/dashboard\/profile/);

    // 1. Verify Profile Heading & Subtitle
    await expect(page.locator('h1', { hasText: /Profile/i })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Total Skills').first()).toBeVisible();
    await expect(page.locator('h3', { hasText: 'My Skills Inventory' })).toBeVisible();

    // 2. Verify Skills Table & Data Rows
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th', { hasText: 'Skill Name' })).toBeVisible();

    // 3. Test "+ Add Skill" Modal Trigger & Dismiss
    const addSkillBtn = page.locator('button:has-text("Add Skill")').first();
    await expect(addSkillBtn).toBeVisible();
    await addSkillBtn.click();

    // Modal should appear
    const modalHeading = page.locator('h2:has-text("Add New Skill")');
    await expect(modalHeading).toBeVisible({ timeout: 6000 });

    // Dismiss modal by clicking Cancel button
    const closeBtn = page.locator('button:has-text("Cancel")').first();
    await closeBtn.click();
    await expect(modalHeading).toBeHidden();
  });

  // --------------------------------------------------------------------------
  // TEST 4: SKILL ASSESSMENT CATALOG & LAUNCH TEST QUESTIONS VIEW
  // --------------------------------------------------------------------------
  test('EMP-04: Skill Assessment Catalog & Interactive Test Modal', async ({ page }) => {
    await page.goto('/dashboard/assessment');
    await expect(page).toHaveURL(/\/dashboard\/assessment/);

    // 1. Verify Page Title
    await expect(page.locator('h1', { hasText: 'Skill Assessment' })).toBeVisible({ timeout: 10000 });

    // 2. Verify Available Assessments Table and Start Assessment Button
    const startBtn = page.getByRole('button', { name: 'Start Assessment' }).first();
    await expect(startBtn).toBeVisible({ timeout: 10000 });

    // 3. Click first assessment to start test
    await startBtn.click();

    // 4. Verify Quiz Modal has Question, Options, and Timer/Stepper
    const questionContainer = page.locator('text=Question 1').or(page.locator('text=Q1')).or(page.locator('text=Which React hook').first()).or(page.locator('text=Remaining').first());
    await expect(questionContainer).toBeVisible({ timeout: 8000 });

    // Close or exit the assessment modal
    const exitBtn = page.locator('button svg.lucide-x').or(page.locator('button:has-text("Exit")')).or(page.locator('button:has-text("Close")')).first();
    if (await exitBtn.isVisible()) {
      await exitBtn.click();
    }
  });

  // --------------------------------------------------------------------------
  // TEST 5: ASSESSMENT RESULTS & PERFORMANCE METRICS
  // --------------------------------------------------------------------------
  test('EMP-05: Assessment Results & Historical Performance Analytics', async ({ page }) => {
    await page.goto('/dashboard/results');
    await expect(page).toHaveURL(/\/dashboard\/results/);

    // 1. Verify Page Header
    await expect(page.locator('h1', { hasText: 'Assessment Results' })).toBeVisible({ timeout: 10000 });

    // 2. Verify Dynamic Metric Cards
    await expect(page.locator('text=Average Score').first()).toBeVisible();
    await expect(page.locator('text=Highest Proficiency').first()).toBeVisible();
    await expect(page.locator('text=Assessments Taken').first()).toBeVisible();
    await expect(page.locator('text=Readiness Impact').first()).toBeVisible();

    // 3. Verify Completed Attempts Section
    await expect(page.locator('h3', { hasText: 'Completed Attempts & Score History' })).toBeVisible();

    // 4. Search Filter Bar
    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Security');
    await searchInput.fill('');
  });

  // --------------------------------------------------------------------------
  // TEST 6: LEARNING RECOMMENDATIONS & 30-DAY AI ROADMAP MODAL
  // --------------------------------------------------------------------------
  test('EMP-06: Learning Recommendations & 30-Day AI Roadmap Modal', async ({ page }) => {
    await page.goto('/dashboard/learning');
    await expect(page).toHaveURL(/\/dashboard\/learning/);

    // 1. Verify Heading & Available Courses Counter
    await expect(page.locator('h1', { hasText: 'Learning Recommendations' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Available Courses').first()).toBeVisible({ timeout: 10000 });

    // 2. Verify AI Recommendation Cards
    await expect(page.locator('h3', { hasText: 'Top Recommended Courses for You' })).toBeVisible();
    await expect(page.locator('text=Resolves Skill Gap').first()).toBeVisible();

    // 3. Verify Course Category Filter Pills
    await expect(page.locator('button:has-text("Backend & Cloud")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Security & DevOps")').first()).toBeVisible();

    // 4. Test Search Filter
    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Node.js');
    await searchInput.fill('');
  });

  // --------------------------------------------------------------------------
  // TEST 7: COURSE DETAILS & CURRICULUM MODULES
  // --------------------------------------------------------------------------
  test('EMP-07: Course Details & Curriculum Architecture', async ({ page }) => {
    await page.goto('/dashboard/courses');
    await expect(page).toHaveURL(/\/dashboard\/courses/);

    // 1. Verify Header & Course Syllabus Container
    await expect(page.locator('h3', { hasText: 'Course Syllabus & Chapters' })).toBeVisible({ timeout: 12000 });
    await expect(page.locator('h3', { hasText: "What you'll learn" })).toBeVisible();

    // 2. Verify Target Skills section
    await expect(page.locator('h3', { hasText: 'Target Skills & Proficiency Boost' })).toBeVisible();

    // 3. Verify Progress or Action Bar
    const actionBtn = page.locator('button:has-text("Start")').or(page.locator('button:has-text("Enroll")')).or(page.locator('button:has-text("Continue")')).first();
    await expect(actionBtn).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 8: PROGRESS VELOCITY, MILESTONES & RECENT ACTIVITIES
  // --------------------------------------------------------------------------
  test('EMP-08: Progress Velocity, Milestones & Recent Activities', async ({ page }) => {
    await page.goto('/dashboard/progress');
    await expect(page).toHaveURL(/\/dashboard\/progress/);

    // 1. Verify Header
    await expect(page.locator('h1', { hasText: 'My Learning Progress' })).toBeVisible({ timeout: 10000 });

    // 2. Verify Course Enrolments & Progress Heading
    await expect(page.locator('h2', { hasText: 'My Course Enrolments & Progress' })).toBeVisible();

    // 3. Verify Skill Gap Resolution Engine Container
    await expect(page.locator('h3', { hasText: 'Skill Gap Resolution Engine' })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 9: ENTERPRISE CERTIFICATIONS & ACCREDITED BADGES
  // --------------------------------------------------------------------------
  test('EMP-09: Enterprise Certifications & Digital Credential Badges', async ({ page }) => {
    await page.goto('/dashboard/certifications');
    await expect(page).toHaveURL(/\/dashboard\/certifications/);

    // 1. Verify Title & Workspace Credential Header
    await expect(page.locator('h1', { hasText: 'Certifications' })).toBeVisible({ timeout: 10000 });

    // 2. Verify Certification Badges or Tabs
    await expect(page.locator('text=Verified Competencies').or(page.locator('text=Course Certifications')).or(page.locator('text=Skill Certificates')).first()).toBeVisible();

    // 3. Search Filter
    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Cloud');
      await searchInput.fill('');
    }
  });

  // --------------------------------------------------------------------------
  // TEST 10: CAREER PATHWAYS & READINESS TRAJECTORIES
  // --------------------------------------------------------------------------
  test('EMP-10: Career Pathway Trajectories & Readiness Acceleration', async ({ page }) => {
    await page.goto('/dashboard/career');
    await expect(page).toHaveURL(/\/dashboard\/career/);

    // 1. Verify Title
    await expect(page.locator('h1', { hasText: 'Career Path Suggestions' })).toBeVisible({ timeout: 10000 });

    // 2. Target Role & Hero Readiness Indicator
    await expect(page.locator('h2', { hasText: /ready for a/i })).toBeVisible();

    // 3. Career Milestone Progression Roadmap
    await expect(page.locator('h3', { hasText: 'Career Progression Roadmap' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Top Recommended Paths' })).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 11: MOBILE RESPONSIVE DRAWER & SECURE LOGOUT
  // --------------------------------------------------------------------------
  test('EMP-11: Mobile Responsive Drawer Navigation & Secure Session Logout', async ({ page }) => {
    // 1. Set mobile viewport (iPhone 14)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/dashboard');

    // 2. Desktop sidebar should be hidden; mobile header should be visible
    const mobileHeader = page.locator('header.lg\\:hidden');
    await expect(mobileHeader).toBeVisible();

    // 3. Verify hamburger menu button and click to open
    const hamburgerBtn = page.locator('header.lg\\:hidden button[aria-label="Toggle menu"]');
    await expect(hamburgerBtn).toBeVisible();
    await hamburgerBtn.click();

    // 4. Mobile sidebar flyout drawer appears
    const mobileNavDrawer = page.locator('aside');
    await expect(mobileNavDrawer).toBeVisible();

    // 5. Test Quick Logout from Mobile Header
    const mobileLogoutBtn = page.locator('header.lg\\:hidden button:has-text("Logout")');
    await expect(mobileLogoutBtn).toBeVisible();
    await mobileLogoutBtn.click();

    // 6. Should navigate to /login and clear token
    await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeNull();
  });

});
