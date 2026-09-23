const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://skillpulse-backend-delta.vercel.app/api';

/**
 * Custom Fetch Wrapper with automatic JWT Auth token injection & error handling
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration / unauthorized
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new Error(data.message || 'Something went wrong with the request.');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ----------------------------------------------------
// AUTHENTICATION APIs
// ----------------------------------------------------
export const authAPI = {
  login: (email, password, workspace) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, workspace }),
    }),

  register: (userData) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  googleSSO: (payload) =>
    apiRequest('/auth/google-sso', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => apiRequest('/auth/me'),
};

// ----------------------------------------------------
// EMPLOYEE APIs
// ----------------------------------------------------
export const employeeAPI = {
  getProfile: () => apiRequest('/employee/profile'),
  addSelfSkill: (skillData) =>
    apiRequest('/employee/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    }),
  deleteSkill: (userSkillId) =>
    apiRequest(`/employee/skills/${userSkillId}`, {
      method: 'DELETE',
    }),
  updateSkill: (skillData) =>
    apiRequest('/employee/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    }),
  getGaps: () => apiRequest('/employee/gaps'),
  getLearningRecs: () => apiRequest('/employee/learning'),
  enrollCourse: (courseId) =>
    apiRequest('/employee/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),
  updateProgress: (courseId, progressPct) =>
    apiRequest('/employee/progress', {
      method: 'POST',
      body: JSON.stringify({ courseId, progressPct }),
    }),
  updateCourseProgress: (courseId, progressPct) =>
    apiRequest('/employee/progress', {
      method: 'POST',
      body: JSON.stringify({ courseId, progressPct }),
    }),
  getAssessments: () => apiRequest('/employee/assessments'),
  generateAIQuestions: (skillTitle, category, difficulty) =>
    apiRequest('/employee/assessments/generate-questions', {
      method: 'POST',
      body: JSON.stringify({ skillTitle, category, difficulty }),
    }),
  submitAssessment: (assessmentData) =>
    apiRequest('/employee/assessments', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    }),
  getCareerPaths: () => apiRequest('/employee/career-paths'),
};

// ----------------------------------------------------
// TEAM LEADER APIs
// ----------------------------------------------------
export const teamLeaderAPI = {
  getOverview: () => apiRequest('/team-leader/overview'),
  getGaps: () => apiRequest('/team-leader/gaps'),
  getReadiness: () => apiRequest('/team-leader/readiness'),
  getMembers: () => apiRequest('/team-leader/members'),
  getMemberProfile: (id) => apiRequest(`/team-leader/members/${id}`),
  getAssignLearningData: () => apiRequest('/team-leader/assign-learning-data'),
  getPerformance: () => apiRequest('/team-leader/performance'),
  getSkillMatrix: () => apiRequest('/team-leader/skill-matrix'),
  getReports: () => apiRequest('/team-leader/reports'),
  getTrainingRequests: () => apiRequest('/team-leader/training-requests'),
  updateRequestStatus: (id, status) =>
    apiRequest(`/team-leader/training-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  batchApproveRequests: (enrollmentIds) =>
    apiRequest('/team-leader/training-requests/batch-approve', {
      method: 'POST',
      body: JSON.stringify({ enrollmentIds })
    }),
  assignTraining: (data) =>
    apiRequest('/team-leader/assign-training', {
      method: 'POST',
      body: JSON.stringify(typeof data === 'object' ? data : { userId: arguments[0], courseId: arguments[1], skillId: arguments[2] }),
    }),
  createProjectSquad: (projectData) =>
    apiRequest('/team-leader/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),
};

// ----------------------------------------------------
// HR MANAGER APIs
// ----------------------------------------------------
export const hrAPI = {
  getAnalytics: () => apiRequest('/hr/analytics'),
  getForecast: () => apiRequest('/hr/forecast'),
  getSuccession: () => apiRequest('/hr/succession'),
  getCompliance: () => apiRequest('/hr/compliance'),
  getTraining: () => apiRequest('/hr/training'),
  createCourse: (data) =>
    apiRequest('/hr/courses', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  getTrainingRequests: () => apiRequest('/hr/training-requests'),
  updateRequestStatus: (id, status) =>
    apiRequest(`/hr/training-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  batchApproveRequests: (enrollmentIds) =>
    apiRequest('/hr/training-requests/batch-approve', {
      method: 'POST',
      body: JSON.stringify({ enrollmentIds })
    }),
  assignTraining: (data) =>
    apiRequest('/hr/assign-training', {
      method: 'POST',
      body: JSON.stringify(typeof data === 'object' ? data : { userId: arguments[0], courseId: arguments[1], skillId: arguments[2] })
    }),
};

// ----------------------------------------------------
// ADMIN APIs
// ----------------------------------------------------
export const adminAPI = {
  getDashboard: () => apiRequest('/admin/dashboard'),
  getGlobalTelemetry: () => apiRequest('/admin/global-telemetry'),
  getTenants: () => apiRequest('/admin/tenants'),
  createTenant: (tenantData) =>
    apiRequest('/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(tenantData),
    }),
  updateTenant: (id, updateData) =>
    apiRequest(`/admin/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),
  getUsers: (tenantId) => apiRequest(`/admin/users${tenantId ? `?tenantId=${tenantId}` : ''}`),
  createUser: (userData) =>
    apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  updateUserRole: (userId, updateData) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),
  deleteUser: (userId) =>
    apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    }),
  getTaxonomy: () => apiRequest('/admin/taxonomy'),
  createSkill: (skillData) =>
    apiRequest('/admin/taxonomy/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    }),
  updateSkill: (id, skillData) =>
    apiRequest(`/admin/taxonomy/skills/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(skillData),
    }),
  deleteSkill: (id) =>
    apiRequest(`/admin/taxonomy/skills/${id}`, {
      method: 'DELETE',
    }),
  getAIConfigs: () => apiRequest('/admin/ai-config'),
  createAIConfig: (configData) =>
    apiRequest('/admin/ai-config', {
      method: 'POST',
      body: JSON.stringify(configData),
    }),
  updateAIConfig: (id, configData) =>
    apiRequest(`/admin/ai-config/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(configData),
    }),
  getAuditLogs: () => apiRequest('/admin/audit-logs'),
  getSecurityPolicies: () => apiRequest('/admin/security-policies'),
  updateSecurityPolicies: (policiesData) =>
    apiRequest('/admin/security-policies', {
      method: 'PATCH',
      body: JSON.stringify(policiesData),
    }),
  getIntegrations: () => apiRequest('/admin/integrations'),
  createIntegration: (hubData) =>
    apiRequest('/admin/integrations', {
      method: 'POST',
      body: JSON.stringify(hubData),
    }),
  updateIntegrationStatus: (id, status) =>
    apiRequest(`/admin/integrations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  triggerIntegrationSync: () =>
    apiRequest('/admin/integrations/sync', {
      method: 'POST',
    }),
  syncHrisDirectory: (directory) =>
    apiRequest('/admin/integrations/hris/sync', {
      method: 'POST',
      body: JSON.stringify({ directory }),
    }),
  syncLmsCatalog: () =>
    apiRequest('/admin/integrations/lms/sync', {
      method: 'POST',
    }),
};

// ----------------------------------------------------
// AI SERVICES APIs
// ----------------------------------------------------
export const aiAPI = {
  inferGaps: (userId, targetRole) =>
    apiRequest('/ai/infer-gaps', {
      method: 'POST',
      body: JSON.stringify({ userId, targetRole }),
    }),
  matchSquad: (requiredSkills, teamSize) =>
    apiRequest('/ai/match-squad', {
      method: 'POST',
      body: JSON.stringify({ requiredSkills, teamSize }),
    }),
};

// ----------------------------------------------------
// PAYMENT APIs
// ----------------------------------------------------
export const paymentAPI = {
  createCheckoutSession: (tenantId, plan, seats) =>
    apiRequest('/payment/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ tenantId, plan, seats }),
    }),
  completeSimulatedCheckout: (tenantId, plan, seats) =>
    apiRequest('/payment/complete-simulated-checkout', {
      method: 'POST',
      body: JSON.stringify({ tenantId, plan, seats }),
    }),
  verifySession: (sessionId) =>
    apiRequest(`/payment/verify?session_id=${sessionId}`),
};
