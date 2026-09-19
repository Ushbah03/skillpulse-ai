import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import SkillPulseLanding from './components/SkillPulseLanding';
import FeaturePage from './components/FeaturePage';
import PricingPage from './components/PricingPage'; 
import AboutPage from './components/AboutPage'; 
import FAQPage from './components/FAQPage'; 
import ContactPage from './components/ContactPage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import RoleSelection from './components/RoleSelection';
import ProtectedRoute from './components/ProtectedRoute';
import CheckoutPage from './components/CheckoutPage';

// Employee Dashboard Components
import DashboardLayout from './components/Layout';
import EmployeeDashboard from './components/EmployeeDashboard';
import MySkillProfile from './components/MySkillProfile';
import SkillAssessment from './components/SkillAssessment';
import AssessmentResults from './components/AssessmentResults';
import LearningRecommendations from './components/LearningRecommendations';
import CourseDetails from './components/CourseDetails';
import MyProgress from './components/MyProgress';
import Certifications from './components/Certifications';
import CareerPaths from './components/CareerPaths';

// TEAM LEADER COMPONENTS
import TeamLeaderDashboard from './components/TeamLeaderDashboard';
import TeamLeaderSkillOverview from './components/TeamSkillOverview';
import TeamMemberProfile from './components/TeamMemberProfile';
import AssignLearning from './components/AssignLearning';
import TeamFormation from './components/TeamFormation';
import PerformanceMonitor from './components/PerformanceMonitor';
import TeamReadinessScore from './components/TeamReadinessScore';
import TeamLeaderSkillGapAnalysis from './components/SkillGapAnalysis';
import TeamTrainingRequests from './components/TeamTrainingRequests';
import TeamReports from './components/TeamReports';

// HR COMPONENTS
import HRDashboard from './components/HRDashboard';
import OrganizationSkillAnalytics from './components/OrganizationSkillAnalytics';
import WorkforcePlanning from './components/WorkforcePlanning';
import ComplianceManagement from './components/ComplianceManagement';
import SuccessionPipeline from './components/SuccessionPipeline';
import SkillGapReports from './components/SkillGapReports';
import TrainingProgramManagement from './components/TrainingProgramManagement';
import EmployeePerformance from './components/EmployeePerformance';
import DepartmentComparison from './components/DepartmentComparison';
import HRInsightsForecasting from './components/HRInsightsForecasting';

// SUPERADMIN COMPONENTS
import SuperAdminDashboard from './components/SuperAdminDashboard';
import TenantManagement from './components/TenantManagement'; // <-- ADD THIS IMPORT
import UserManagement from './components/UserManagement'; // <-- ADD THIS IMPORT
import RoleManagement from './components/RoleManagement';



import SuperAdminUsersDashboard from './components/SuperAdminUsersDashboard';
import SkillTaxonomyManagement from './components/SkillTaxonomyManagement';
import AIModelConfiguration from './components/AIModelConfiguration';
import SystemParameters from './components/SystemParameters';
import SecuritySettings from './components/SecuritySettings';
import AuditLogsPage from './components/AuditTrailLogs';
import TrainingRequests from './components/TrainingRequests';
import AdminTeamReports from './components/AdminTeamReports';
import HRISIntegrationDashboard from './components/HRISIntegrationDashboard';
import LMSIntegrationDashboard from './components/LMSIntegrationDashboard';
import ThirdPartyAPISettings from './components/ThirdPartyAPISettings';
import PaymentGatewayBillingSettings from './components/PaymentGatewayBillingSettings';

// COMPANY ADMIN COMPONENTS
import CompanyAdminDashboard from './components/CompanyAdminDashboard';
import UserRoleGovernance from './components/UserRoleGovernance';
import CompanySkillTaxonomy from './components/CompanySkillTaxonomy';
import IntegrationsHub from './components/IntegrationsHub';
import SecurityAccessPolicies from './components/SecurityAccessPolicies';
import OrgSettingsAuditLogs from './components/OrgSettingsAuditLogs';
import GlobalIntegrations from './components/GlobalIntegrations';
import BillingAndSubscriptions from './components/BillingAndSubscriptions';
import SystemHealthLogs from './components/SystemHealthLogs';
import AuditTrailLogs from './components/AuditTrailLogs';


function LayoutWrapper({ children }) {
  const location = useLocation();
  
  // Exclude list: Includes Company Admin
  const excludePaths = [
    '/signup', 
    '/login', 
    '/checkout',
    '/select-role', 
    '/dashboard', 
    '/team-leader', 
    '/hr-dashboard', 
    '/company-admin',
    '/superadmin',
    '/forgot-password'
  ];
  const shouldExclude = excludePaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldExclude && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!shouldExclude && <Footer />}
    </div>
  );
}

import WorkspaceSuspended from './components/WorkspaceSuspended';
import AccountSuspended from './components/AccountSuspended';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          {/* Workspace & Account Suspended Routes */}
          <Route path="/workspace-suspended" element={<WorkspaceSuspended />} />
          <Route path="/account-suspended" element={<AccountSuspended />} />

          {/* Forgot Password Route */}
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

          {/* Landing & Auth Routes */}
          <Route path="/" element={<SkillPulseLanding />} />
          <Route path="features" element={<FeaturePage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="contact" element={<ContactPage />}/>
          <Route path="signup" element={<SignUp />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="login" element={<Login />} />
          {/* Role Selection (Admin only - regular users redirected to their dashboard) */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="select-role" element={<RoleSelection />} />
          </Route>

          {/* Employee Dashboard Nested Routes (Employee & Super Admin) */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'SUPER_ADMIN']} />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<EmployeeDashboard />} /> 
              <Route path="profile" element={<MySkillProfile />} />
              <Route path="assessment" element={<SkillAssessment />} />
              <Route path="results" element={<AssessmentResults />} />
              <Route path="learning" element={<LearningRecommendations />} />
              <Route path="courses" element={<CourseDetails />} />
              <Route path="progress" element={<MyProgress />} />
              <Route path="certifications" element={<Certifications />} />
              <Route path="career" element={<CareerPaths />} /> 
            </Route>
          </Route>

          {/* Team Leader Dashboard Routes (Team Leader & Super Admin) - Requires PRO or ENTERPRISE plan */}
          <Route element={<ProtectedRoute allowedRoles={['TEAM_LEADER', 'SUPER_ADMIN']} allowedPlans={['PRO', 'ENTERPRISE']} />}>
            <Route path="/team-leader">
              <Route index element={<TeamLeaderDashboard />} /> 
              <Route path="skill-overview" element={<TeamLeaderSkillOverview />} />
              <Route path="member-profile" element={<TeamMemberProfile />} />
              <Route path="assign-learning" element={<AssignLearning />} />
              <Route path="team-formation" element={<TeamFormation />} />
              <Route path="performance" element={<PerformanceMonitor />} />
              <Route path="readiness" element={<TeamReadinessScore />} />
              <Route path="gap-analysis" element={<TeamLeaderSkillGapAnalysis />} />
              <Route path="requests" element={<TeamTrainingRequests />} />
              <Route path="reports" element={<TeamReports />} />
            </Route>
          </Route>

          {/* HR Routes (HR Manager & Super Admin) - Requires PRO or ENTERPRISE plan */}
          <Route element={<ProtectedRoute allowedRoles={['HR_MANAGER', 'SUPER_ADMIN']} allowedPlans={['PRO', 'ENTERPRISE']} />}>
            <Route path="/hr-dashboard">
              <Route index element={<HRDashboard />} />
              <Route path="skill-analytics" element={<OrganizationSkillAnalytics />} />
              <Route path="workforce-planning" element={<WorkforcePlanning/>} />
              <Route path="compliance-management" element={<ComplianceManagement />} />
              <Route path="career-planning" element={<SuccessionPipeline />} />
              <Route path="skill-gap-reports" element={<SkillGapReports />} />
              <Route path="training-management" element={<TrainingProgramManagement />} />
              <Route path="performance-reports" element={<EmployeePerformance />} />
              <Route path="department-comparison" element={<DepartmentComparison />} />
              <Route path="hr-insights" element={<HRInsightsForecasting />} />
            </Route>
          </Route>

          {/* Company Admin Routes (Company Admin & Super Admin) */}
          <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN', 'SUPER_ADMIN']} />}>
            <Route path="/company-admin">
              <Route index element={<CompanyAdminDashboard />} />
              <Route path="users" element={<UserRoleGovernance />} />
              <Route path="taxonomy" element={<CompanySkillTaxonomy />} />
              
              {/* Requires PRO or ENTERPRISE */}
              <Route element={<ProtectedRoute allowedRoles={['COMPANY_ADMIN', 'SUPER_ADMIN']} allowedPlans={['PRO', 'ENTERPRISE']} />}>
                <Route path="integrations" element={<IntegrationsHub />} />
              </Route>
              
              <Route path="security" element={<SecurityAccessPolicies />} />
              <Route path="settings" element={<OrgSettingsAuditLogs />} />
            </Route>
          </Route>

          {/* Superadmin Main Dashboard Routes Layer (Super Admin Only) */}
          <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
            <Route path="/superadmin">
              <Route index element={<SuperAdminDashboard />} />
              <Route path="dashboard" element={<SuperAdminDashboard />} />
              <Route path="tenants" element={<TenantManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="taxonomy" element={<SkillTaxonomyManagement/>} />
              <Route path="ai-config" element={<AIModelConfiguration />} />
              <Route path="integrations" element={<GlobalIntegrations />} />
              <Route path="billing" element={<BillingAndSubscriptions />} />
              <Route path="settings" element={<SystemHealthLogs />} />
              <Route path="audit-logs" element={<AuditTrailLogs />} />
            </Route>
          </Route>

        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;