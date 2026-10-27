import { test, expect } from '@playwright/test';

test.describe('SkillPulse AI - Visitor Module Comprehensive & Rigorous Test Suite', () => {

  // --------------------------------------------------------------------------
  // TEST 1: LANDING PAGE DISCOVERY, HERO & PLATFORM CAPABILITIES
  // --------------------------------------------------------------------------
  test('VIS-01: Landing Page Hero, Value Proposition & Workflow Architecture', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/SkillPulse/i);

    // 1. Verify contextual header & hero messaging
    await expect(page.locator('text=SkillPulse-AI Multi-Tenant Platform').first()).toBeVisible();
    await expect(page.locator('h1', { hasText: 'AI-Powered Skill' })).toBeVisible();
    await expect(page.locator('text=Unlock Your Workforce Potential')).toBeVisible();

    // 2. Verify CTA buttons exist and have correct destinations
    const getStartedBtn = page.locator('a', { hasText: 'Get Started' }).first();
    await expect(getStartedBtn).toBeVisible();
    await expect(getStartedBtn).toHaveAttribute('href', '/signup');

    const requestDemoBtn = page.locator('a', { hasText: 'Request Demo' }).first();
    await expect(requestDemoBtn).toBeVisible();
    await expect(requestDemoBtn).toHaveAttribute('href', '/contact');

    // 3. Verify Dashboard Preview image loaded properly
    const previewImg = page.locator('img[alt="SkillPulse Dashboard Preview"]');
    await expect(previewImg).toBeVisible();

    // 4. Verify 3 Core Capability Cards
    await expect(page.locator('h3', { hasText: 'AI Skill Gap Analysis' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Workforce Readiness' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Multi-Tenant Security' })).toBeVisible();

    // 5. Verify 4-Step Workflow Stepper
    await expect(page.getByText('01', { exact: true })).toBeVisible();
    await expect(page.locator('h4', { hasText: 'Assess Skills' })).toBeVisible();
    await expect(page.getByText('02', { exact: true })).toBeVisible();
    await expect(page.locator('h4', { hasText: 'Analyze Gaps' })).toBeVisible();
    await expect(page.getByText('03', { exact: true })).toBeVisible();
    await expect(page.locator('h4', { hasText: 'Recommend Learning' })).toBeVisible();
    await expect(page.getByText('04', { exact: true })).toBeVisible();
    await expect(page.locator('h4', { hasText: 'Improve Readiness' })).toBeVisible();

    // 6. Verify 3 Role Cards
    await expect(page.locator('h3', { hasText: 'Employees' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Team Leaders' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'HR & Admin Control' })).toBeVisible();

    // 7. Verify Telemetry & Neural Engine Metrics
    await expect(page.locator('text=Neural Telemetry Engine')).toBeVisible();
    await expect(page.locator('text=98.4%').first()).toBeVisible();
    await expect(page.locator('text=84% Optimal')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 2: GLOBAL NAVBAR NAVIGATION & CLIENT-SIDE ROUTING
  // --------------------------------------------------------------------------
  test('VIS-02: Global Navigation Header Transitions & Active State Verification', async ({ page }) => {
    await page.goto('/');

    const routes = [
      { text: 'Features', path: '/features' },
      { text: 'Pricing', path: '/pricing' },
      { text: 'About', path: '/about' },
      { text: 'FAQ', path: '/faq' },
      { text: 'Contact', path: '/contact' }
    ];

    for (const route of routes) {
      const navLink = page.locator(`nav.sticky a:has-text("${route.text}")`).first();
      await expect(navLink).toBeVisible();
      await navLink.click();
      await expect(page).toHaveURL(new RegExp(route.path));
    }

    // Verify brand logo click returns to root
    const brandLogo = page.locator('nav.sticky a[href="/"]').first();
    await brandLogo.click();
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  // --------------------------------------------------------------------------
  // TEST 3: MOBILE RESPONSIVE HAMBURGER FLYOUT & NAVIGATION
  // --------------------------------------------------------------------------
  test('VIS-03: Mobile Viewport Rendering & Hamburger Drawer Navigation', async ({ page }) => {
    // 1. Set mobile smartphone viewport (iPhone 14 / Android standard)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // 2. Desktop navbar links should be hidden on mobile
    const desktopLinksContainer = page.locator('div.hidden.md\\:flex');
    await expect(desktopLinksContainer).toBeHidden();

    // 3. Hamburger button must be visible
    const hamburgerBtn = page.locator('button[aria-label="Toggle Menu"]');
    await expect(hamburgerBtn).toBeVisible();

    // 4. Click hamburger to toggle mobile flyout
    await hamburgerBtn.click();

    // 5. Verify mobile navigation drawer opens with all links
    const mobilePricing = page.locator('div.absolute a:has-text("Pricing")');
    await expect(mobilePricing).toBeVisible();

    // 6. Navigate to Pricing via mobile drawer
    await mobilePricing.click();
    await expect(page).toHaveURL(/\/pricing/);

    // 7. Verify mobile drawer closes after navigation
    await expect(mobilePricing).toBeHidden();
  });

  // --------------------------------------------------------------------------
  // TEST 4: FEATURES PAGE INTERACTIVE CAPABILITIES & RADAR ENGINE
  // --------------------------------------------------------------------------
  test('VIS-04: Features Page Interactive Capability Matrix, Radar Sweep & Dashboard Previews', async ({ page }) => {
    await page.goto('/features');
    await expect(page).toHaveURL(/\/features/);

    // 1. Verify Header & Badge
    await expect(page.locator('text=Enterprise Capabilities').first()).toBeVisible();
    await expect(page.locator('h1', { hasText: 'Powerful Features Built for' })).toBeVisible();

    // 2. Interactive Category Tabs Testing (Engineering -> Leadership -> Data & Cloud)
    const leadershipTab = page.locator('button', { hasText: 'Leadership' });
    await expect(leadershipTab).toBeVisible();
    await leadershipTab.click();
    await expect(page.locator('text=Sprint Resourcing & Velocity')).toBeVisible();

    const dataTab = page.locator('button', { hasText: 'Data & Cloud' });
    await expect(dataTab).toBeVisible();
    await dataTab.click();
    await expect(page.locator('text=PostgreSQL Multi-Tenant Sharding')).toBeVisible();

    const engineeringTab = page.locator('button', { hasText: 'Engineering' });
    await engineeringTab.click();
    await expect(page.locator('text=Cloud & Distributed Systems')).toBeVisible();

    // 3. Interactive Radar Display & Blip Nodes Hover Verification
    await expect(page.locator('text=Neural Skill Vector Radar')).toBeVisible();
    const radarNode = page.locator('div[style*="left: 140px"]').first();
    await radarNode.hover();
    await expect(page.locator('text=GenAI & LLM: 96%')).toBeVisible();

    // 4. Workforce Readiness Score Meter
    await expect(page.locator('text=82').first()).toBeVisible();
    await expect(page.locator('text=Live Enterprise Readiness')).toBeVisible();

    // 5. Verify the 4 Role-Based Dashboard Previews (Employee, Leader, HR, Admin)
    const dashboardCards = [
      { title: 'Employee Dashboard', alt: 'Employee Dashboard' },
      { title: 'Team Leader Dashboard', alt: 'Team Leader Dashboard' },
      { title: 'HR Analytics Dashboard', alt: 'HR Analytics Dashboard' },
      { title: 'Admin Control Center', alt: 'Admin Control Center' }
    ];

    for (const d of dashboardCards) {
      await expect(page.locator('h4', { hasText: d.title })).toBeVisible();
      const img = page.locator(`img[alt="${d.alt}"]`);
      await expect(img).toBeVisible();
      // Verify image is not broken
      const naturalWidth = await img.evaluate((node) => node.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);
    }

    // 6. Interactive AI Calibration Simulation Button
    const simulateBtn = page.locator('button', { hasText: 'Simulate AI Calibration' });
    await expect(simulateBtn).toBeVisible();
    await simulateBtn.click();
    await expect(page.locator('text=Calibrating Neural Skill Taxonomy')).toBeVisible();
    // Modal will automatically unmount after 2.6s
    await expect(page.locator('text=Calibrating Neural Skill Taxonomy')).toBeHidden({ timeout: 6000 });
  });

  // --------------------------------------------------------------------------
  // TEST 5: PRICING ENGINE, SEAT LIMITS & COMPARISON MATRIX
  // --------------------------------------------------------------------------
  test('VIS-05: Pricing Engine Dynamic Billing Toggle, Tiers & Feature Matrix', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveURL(/\/pricing/);

    // 1. Verify Monthly Tier Pricing ($600 Starter, $1200 Pro, $2500 Enterprise)
    await expect(page.locator('h3', { hasText: 'Starter Plan' })).toBeVisible();
    await expect(page.locator('text=$600').first()).toBeVisible();
    await expect(page.locator('text=30 User Seats').first()).toBeVisible();

    await expect(page.locator('h3', { hasText: 'Pro Plan' })).toBeVisible();
    await expect(page.locator('text=$1200').first()).toBeVisible();
    await expect(page.locator('text=250 User Seats').first()).toBeVisible();

    await expect(page.locator('h3', { hasText: 'Enterprise' })).toBeVisible();
    await expect(page.locator('text=$2500').first()).toBeVisible();
    await expect(page.locator('text=1,000 User Seats').first()).toBeVisible();

    // 2. Toggle to Annual Billing (Save 20%: $500, $1000, $2000)
    const annualBtn = page.locator('button', { hasText: 'Annual Billing' });
    await annualBtn.click();
    await expect(page.locator('text=$500').first()).toBeVisible();
    await expect(page.locator('text=$1000').first()).toBeVisible();
    await expect(page.locator('text=$2000').first()).toBeVisible();

    // 3. Toggle back to Monthly Billing
    const monthlyBtn = page.locator('button', { hasText: 'Monthly Billing' });
    await monthlyBtn.click();
    await expect(page.locator('text=$600').first()).toBeVisible();

    // 4. Verify Feature Comparison Matrix Table
    await expect(page.locator('h2', { hasText: 'Workspace Feature Matrix' })).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('td', { hasText: 'User Seat Limit' })).toBeVisible();
    await expect(page.locator('td', { hasText: '1,000 Seats' })).toBeVisible();

    // 5. Verify FAQ Accordions on Pricing Page
    const faqQuestion = page.getByText('Can I upgrade or downgrade my workspace plan later?');
    await expect(faqQuestion).toBeVisible();
    await faqQuestion.click();
    await expect(page.locator('text=adjust their organization\'s plan directly')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 6: ABOUT PAGE ARCHITECTURE & PROOF POINTS
  // --------------------------------------------------------------------------
  test('VIS-06: About Page Mission, Challenge Breakdown & Impact Metrics', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);

    // 1. Verify Header & Mission
    await expect(page.locator('text=ABOUT SKILLPULSE AI')).toBeVisible();
    await expect(page.locator('h1', { hasText: 'Redefining Workforce' })).toBeVisible();

    // 2. Verify 4 Challenges Grid
    await expect(page.locator('h3', { hasText: 'Unidentified Skill Gaps' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Static Performance Logs' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Generic Learning Paths' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Opaque Career Pathways' })).toBeVisible();

    // 3. Verify PostgreSQL Sync Indicator
    await expect(page.locator('text=100%').first()).toBeVisible();
    await expect(page.locator('text=PostgreSQL Telemetry Sync')).toBeVisible();

    // 4. Verify 4-Metric Impact Bar
    await expect(page.locator('text=5 Roles')).toBeVisible();
    await expect(page.locator('text=Multi-Tenant Governance')).toBeVisible();
    await expect(page.getByText('Real-Time', { exact: true })).toBeVisible();
    await expect(page.locator('text=Skill Gap Inference')).toBeVisible();
    await expect(page.locator('text=2.4s')).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 7: FAQ PAGE SEARCH & MULTI-CATEGORY ACCORDION FILTERING
  // --------------------------------------------------------------------------
  test('VIS-07: Interactive FAQ Search Filter & Category Switching', async ({ page }) => {
    await page.goto('/faq');
    await expect(page).toHaveURL(/\/faq/);

    // 1. Verify Page Title
    await expect(page.locator('h1', { hasText: 'Frequently Asked' })).toBeVisible();

    // 2. Keyword Search Filtering (search "RBAC")
    const searchInput = page.locator('input[placeholder*="Search questions"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('RBAC');
    await expect(page.locator('text=What roles are supported in the 5-Tier RBAC system?')).toBeVisible();

    // 3. Clear search and test category pill clicks
    await searchInput.fill('');
    const pricingCatBtn = page.locator('button', { hasText: 'Pricing & Seats' });
    await expect(pricingCatBtn).toBeVisible();
    await pricingCatBtn.click();
    await expect(page.locator('text=What seat limits apply to each subscription plan?')).toBeVisible();

    // 4. Toggle Accordion Question
    const questionBtn = page.locator('button:has-text("What seat limits apply to each subscription plan?")');
    await questionBtn.click();
    await expect(page.locator('text=The Starter Plan supports 30 user seats')).toBeVisible();

    // Click again to collapse
    await questionBtn.click();
    await expect(page.locator('text=The Starter Plan supports 30 user seats')).toBeHidden({ timeout: 4000 });
  });

  // --------------------------------------------------------------------------
  // TEST 8: CONTACT PAGE CHANNELS & INTERACTIVE MAP
  // --------------------------------------------------------------------------
  test('VIS-08: Contact Page Communication Inquiries & Headquarters Layout', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/\/contact/);

    // 1. Verify Channel Cards
    await expect(page.locator('h3', { hasText: 'Sales Inquiries' })).toBeVisible();
    await expect(page.locator('a[href="mailto:sales@skillpulse.ai"]')).toBeVisible();

    await expect(page.locator('h3', { hasText: 'Customer Support' })).toBeVisible();
    await expect(page.locator('a[href="mailto:support@skillpulse.ai"]')).toBeVisible();

    await expect(page.locator('h3', { hasText: 'Direct Hotline' })).toBeVisible();
    await expect(page.locator('text=+1 (555) 000-0000')).toBeVisible();

    // 2. Headquarters Information & Map Frame
    await expect(page.locator('h2', { hasText: 'Visit Our Office' })).toBeVisible();
    await expect(page.locator('text=123 Intelligence Square, Tech District')).toBeVisible();
    const mapImg = page.locator('img[alt="Map Location"]');
    await expect(mapImg).toBeVisible();
  });

  // --------------------------------------------------------------------------
  // TEST 9: COMPACT FOOTER RESPONSIVENESS & LEGAL NAVIGATION
  // --------------------------------------------------------------------------
  test('VIS-09: Global Footer Structure, Social Links & Compliance Badges', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // 1. Social Links
    await expect(footer.locator('a:has-text("Twitter")').first()).toBeVisible();
    await expect(footer.locator('a:has-text("LinkedIn")').first()).toBeVisible();
    await expect(footer.locator('a:has-text("GitHub")').first()).toBeVisible();

    // 2. Legal links
    await expect(footer.locator('a:has-text("Privacy")').first()).toBeVisible();
    await expect(footer.locator('a:has-text("Terms")').first()).toBeVisible();
    await expect(footer.locator('a:has-text("Security")').first()).toBeVisible();

    // 3. Copyright notice
    await expect(footer.locator('text=SkillPulse-AI Enterprise Systems')).toBeVisible();
  });

});
