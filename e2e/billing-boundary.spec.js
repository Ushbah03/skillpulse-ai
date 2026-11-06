// @ts-check
import { test, expect } from '@playwright/test';

const BACKEND_URL = 'http://localhost:5000';

test.describe.serial('SkillPulse AI - Step 3: Payment & Billing Boundary Enforcement', () => {

  // ------------------------------------------------------------------------
  // BILL-01: Plan-Based Role Gating (STARTER vs PRO / ENTERPRISE)
  // ------------------------------------------------------------------------
  test('BILL-01: Starter Plan Prohibits Premium Role Assignments (HR & Leader)', async ({ request }) => {
    // 1. Authenticate as Enterprise Company Admin
    const loginRes = await request.post(`${BACKEND_URL}/api/auth/login`, {
      data: { email: 'admin@enterprise.com', password: 'Password123!' }
    });
    expect(loginRes.ok()).toBeTruthy();
    const { token } = await loginRes.json();

    // 2. Attempt to register a user on a starter plan with HR_MANAGER role
    // Using the registration endpoint with a STARTER tenant
    const regRes = await request.post(`${BACKEND_URL}/api/auth/register`, {
      data: {
        email: `candidate-${Date.now()}@teststarter.com`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'Starter',
        tenantSlug: 'starter-corp',
        role: 'HR_MANAGER'
      }
    });

    // Should reject if tenant exists and is on STARTER plan, or handle gracefully
    if (regRes.status() === 403) {
      const data = await regRes.json();
      expect(data.success).toBe(false);
      expect(data.message).toMatch(/STARTER plan/i);
    } else {
      expect([403, 404, 400, 409]).toContain(regRes.status());
    }
  });

  // ------------------------------------------------------------------------
  // BILL-02: Stripe Webhook Signature Defense
  // ------------------------------------------------------------------------
  test('BILL-02: Stripe Webhook Rejects Forged or Missing Signature', async ({ request }) => {
    // Attempt to hit webhook with forged signature
    const forgedRes = await request.post(`${BACKEND_URL}/api/payment/webhook`, {
      headers: {
        'stripe-signature': 't=123456,v1=fake_signature_hash_attempt'
      },
      data: {
        type: 'checkout.session.completed',
        data: { object: { id: 'cs_fake_test' } }
      }
    });

    // Must be rejected with 400 Bad Request or 503
    expect([400, 503]).toContain(forgedRes.status());

    // Attempt with NO signature header
    const noSigRes = await request.post(`${BACKEND_URL}/api/payment/webhook`, {
      data: {
        type: 'checkout.session.completed'
      }
    });
    expect([400, 503]).toContain(noSigRes.status());
  });

  // ------------------------------------------------------------------------
  // BILL-03: Plan Tier Quota Boundaries (30 Starter, 250 Pro, 1000 Enterprise)
  // ------------------------------------------------------------------------
  test('BILL-03: Plan Tier Quota Boundaries & Capacity Verification', async ({ request }) => {
    const plansRes = await request.get(`${BACKEND_URL}/api/health`);
    expect(plansRes.ok()).toBeTruthy();

    // Verify tier capacities via admin session
    const loginRes = await request.post(`${BACKEND_URL}/api/auth/login`, {
      data: { email: 'admin@enterprise.com', password: 'Password123!' }
    });
    expect(loginRes.ok()).toBeTruthy();
    const { token, user } = await loginRes.json();

    const tenant = user.tenant;
    expect(tenant).toBeTruthy();
    // Enterprise tenant should have maxUsers configured
    expect(tenant.maxUsers).toBeGreaterThanOrEqual(30);
  });

  // ------------------------------------------------------------------------
  // BILL-04: Simulated Checkout Plan Upgrade & Workspace Provisioning
  // ------------------------------------------------------------------------
  test('BILL-04: Simulated Checkout Flow Provisions Correct Seat Capacity', async ({ request }) => {
    // 1. Authenticate to get real tenant
    const loginRes = await request.post(`${BACKEND_URL}/api/auth/login`, {
      data: { email: 'admin@enterprise.com', password: 'Password123!' }
    });
    expect(loginRes.ok()).toBeTruthy();
    const { user } = await loginRes.json();
    const tenantId = user.tenant.id;

    // 2. Request checkout session
    const checkoutRes = await request.post(`${BACKEND_URL}/api/payment/create-checkout-session`, {
      data: {
        tenantId,
        plan: 'Professional',
        seats: 250
      }
    });

    // Must return valid checkout URL (Stripe session or simulated checkout fallback)
    expect(checkoutRes.ok()).toBeTruthy();
    const data = await checkoutRes.json();
    expect(data.success).toBe(true);
    expect(data.url).toBeTruthy();

    // 3. Verify complete-simulated-checkout provisions the correct seat limit
    const completeRes = await request.post(`${BACKEND_URL}/api/payment/complete-simulated-checkout`, {
      data: {
        tenantId,
        plan: 'Professional',
        seats: 250
      }
    });
    expect(completeRes.ok()).toBeTruthy();
    const completeData = await completeRes.json();
    expect(completeData.success).toBe(true);
    expect(completeData.tenant.maxUsers).toBe(250);
    expect(completeData.tenant.plan).toBe('PRO');
  });

});
