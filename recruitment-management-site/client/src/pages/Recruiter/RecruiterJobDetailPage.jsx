import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { jobs as mockJobs } from '../../data/mockJobs';
import './RecruiterJobDetailPage.css';

const RecruiterJobDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Try to get job from navigation state (best)
  let job = location.state?.job;

  // If page was refreshed, fallback to mock data
  if (!job) {
    job = mockJobs.find(j => j.id === Number(id));
  }

  if (!job) return <h2>Job not found.</h2>;

  return (
    <div className="recruiter-job-detail-container">
      <button className="btn-back" onClick={() => navigate('/recruiter/job-posting')}>
        ← Back to Job Postings
      </button>

      <h1>{job.title}</h1>

      <div className="job-meta">
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Type:</strong> {job.type}</p>
        <p><strong>Deadline:</strong> {job.deadline}</p>
      </div>

      <div className="job-description-full">
        <h3>Short Description</h3>
        <p>{job.description}</p>
      </div>

      <div className="job-detailed-description">
        <h3>Detailed Description</h3>
        <p>{job.detailedDescription || 'No detailed description provided.'}</p>
      </div>
    </div>
  );
};

export default RecruiterJobDetailPage;

