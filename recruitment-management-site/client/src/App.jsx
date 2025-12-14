import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/applicant/Dashboard';
import AuthPage from './pages/applicant/AuthPage';
import CvPage from './pages/applicant/CvPage';
import JobsListPage from './pages/applicant/JobListPage';
import JobPostingPage from './pages/Recruiter/JobPostingPage';
import CvReviewPage from './pages/Recruiter/CvReviewPage';
import RecruiterLayout from './components/layout/RLayout';
import ViewCvPage from './pages/Recruiter/ViewCvPage';
import EventsPage from './pages/Recruiter/EventsPage';
import RecruiterDashboard from './pages/Recruiter/RecruiterDashboard';
import LandingPage from './pages/LandingPage';
import JobDetailPage from './pages/applicant/JobDetailPage';
import AppliedJobsPage from './pages/applicant/AppliedJobsPage';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';



function App() {
  return (
    <Router>
      <Routes>
        {/* Route outside the main layout (like login) */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={<MainLayout><DashboardPage /></MainLayout>}
        />

        <Route
          path="/cv"
          element={<MainLayout><CvPage /></MainLayout>}
        />

        <Route
          path="/jobs"
          element={<MainLayout><JobsListPage /></MainLayout>}
        />
        <Route
          path="/jobs/:id"
          element={<MainLayout><JobDetailPage /></MainLayout>}
        />

        <Route
          path="/applied-jobs"
          element={<MainLayout><AppliedJobsPage /></MainLayout>}
        />

        <Route
          path="/recruiter/job-posting"
          element={<RecruiterLayout><JobPostingPage /></RecruiterLayout>}
        />


        <Route
          path="/recruiter/cv-review"
          element={<RecruiterLayout><CvReviewPage /></RecruiterLayout>}
        />

        <Route
          path="/recruiter"
          element={<RecruiterLayout><RecruiterDashboard /></RecruiterLayout>}
        />

        <Route
          path="/recruiter/view-cv/:id"
          element={<RecruiterLayout><ViewCvPage /></RecruiterLayout>}
        />
        <Route
          path="/recruiter/events"
          element={<RecruiterLayout><EventsPage /></RecruiterLayout>}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<AdminLayout><AdminDashboard /></AdminLayout>}
        />
        <Route
          path="/admin/users"
          element={<AdminLayout><AdminDashboard /></AdminLayout>}
        />
        <Route
          path="/admin/jobs"
          element={<AdminLayout><AdminDashboard /></AdminLayout>}
        />
        <Route
          path="/admin/applications"
          element={<AdminLayout><AdminDashboard /></AdminLayout>}
        />

        {/* Catch-all route for 404 */}
        <Route
          path="*"
          element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
