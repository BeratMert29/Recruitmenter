import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/applicant/AuthPage';
import DashboardPage from '../pages/applicant/Dashboard';
import CvPage from '../pages/applicant/CvPage';
import JobsListPage from '../pages/applicant/JobListPage';
import CvReviewPage from '../pages/Recruiter/CvReviewPage';
import JobPostingPage from '../pages/Recruiter/JobPostingPage';
import ViewCvPage from '../pages/Recruiter/ViewCvPage';
import EventsPage from '../pages/Recruiter/EventsPage';
import RecruiterDashboard from '../pages/Recruiter/RecruiterDashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cv" element={<CvPage />} />
        <Route path="/jobs" element={<JobsListPage />} />
        <Route path="/recruiter/cv-review" element={<CvReviewPage />} />
        <Route path="/recruiter/job-posting" element={<JobPostingPage />} />
        <Route path="/recruiter/view-cv/:id" element={<ViewCvPage />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/events" element={<EventsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;