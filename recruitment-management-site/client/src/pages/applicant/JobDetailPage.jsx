import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { jobs as mockJobs } from '../../data/mockJobs';
import { cvAPI, jobsAPI } from '../../api/api';
import './JobDetailPage.css';

const JobDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [hasCV, setHasCV] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Try to get job from navigation state (best)
  let job = location.state?.job;

  // If page was refreshed, fallback to mock data
  if (!job) {
    job = mockJobs.find(j => j.id === Number(id));
  }

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);

      // Check if user has CV
      const checkCV = async () => {
        try {
          const response = await cvAPI.checkStatus(userData.id);
          if (response.success) {
            setHasCV(response.hasCV);
          }
        } catch (error) {
          console.log('Could not check CV status');
        }
      };
      checkCV();

      // Check if already applied
      const checkApplications = async () => {
        try {
          const response = await jobsAPI.getUserApplications(userData.id);
          if (response.success) {
            const alreadyApplied = response.applications.some(
              app => app.jobId === id || app.jobId?._id === id
            );
            setApplied(alreadyApplied);
          }
        } catch (error) {
          console.log('Could not check applications');
        }
      };
      checkApplications();
    }
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to apply for this job.' });
      setTimeout(() => navigate('/auth'), 2000);
      return;
    }

    if (!hasCV) {
      setMessage({ type: 'error', text: 'Please submit your CV before applying.' });
      setTimeout(() => navigate('/cv'), 2000);
      return;
    }

    setIsApplying(true);

    try {
      // Use job._id (MongoDB ObjectId) or id from params
      const jobId = job?._id || id;
      const response = await jobsAPI.apply(jobId, user.id);

      if (response.success) {
        setApplied(true);
        setMessage({ type: 'success', text: 'Application submitted successfully!' });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to submit application.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to submit application. Please try again.' });
    } finally {
      setIsApplying(false);
    }
  };

  if (!job) return <h2>Job not found.</h2>;

  return (
    <div className="job-detail-container">
      <button className="btn-secondary" onClick={() => navigate(-1)}>
        ← Back
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
        <p>{job.detailedDescription || job.details || 'No detailed description provided.'}</p>
      </div>

      {message.text && (
        <div className={`apply-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="apply-section">
        {applied ? (
          <button className="btn-applied" disabled>
            ✓ Applied
          </button>
        ) : (
          <button
            className="btn-apply"
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? 'Submitting...' : 'Apply Now'}
          </button>
        )}

        {!user && (
          <p className="apply-hint">You need to login to apply</p>
        )}
        {user && !hasCV && (
          <p className="apply-hint">Submit your CV first to apply</p>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
