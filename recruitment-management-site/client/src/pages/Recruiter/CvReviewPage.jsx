import React, { useState, useEffect } from 'react';
import './CvReviewPage.css';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, cvAPI } from '../../api/api';
import { FaUser, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const CvReviewPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);
  const navigate = useNavigate();

  // Fetch all jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsAPI.getAll();
        if (response.success) {
          setJobs(response.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applicants when a job is selected
  useEffect(() => {
    if (!selectedJob) {
      setApplicants([]);
      return;
    }

    const fetchApplicants = async () => {
      setIsLoadingApplicants(true);
      try {
        // Get applications for this job
        const appResponse = await jobsAPI.getJobApplications(selectedJob);

        if (appResponse.success && appResponse.applications.length > 0) {
          // For each application, try to get the CV data
          const applicantsWithCV = await Promise.all(
            appResponse.applications.map(async (app) => {
              try {
                const cvResponse = await cvAPI.getByUserId(app.userId);
                return {
                  ...app,
                  cv: cvResponse.success ? cvResponse.data : null
                };
              } catch {
                return { ...app, cv: null };
              }
            })
          );
          setApplicants(applicantsWithCV);
        } else {
          setApplicants([]);
        }
      } catch (error) {
        console.error('Failed to fetch applicants:', error);
        setApplicants([]);
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    fetchApplicants();
  }, [selectedJob]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="status-badge accepted"><FaCheckCircle /> Accepted</span>;
      case 'rejected':
        return <span className="status-badge rejected"><FaTimesCircle /> Rejected</span>;
      default:
        return <span className="status-badge pending"><FaHourglassHalf /> Pending</span>;
    }
  };

  const selectedJobTitle = jobs.find(j => j._id === selectedJob)?.title;

  return (
    <div className="cv-review-page">
      <h1>CV Review Page</h1>
      <p className="page-description">Review and manage applicants for your job postings</p>

      <div className="job-selector">
        <label>Select Job:</label>
        <select
          onChange={(e) => setSelectedJob(e.target.value)}
          value={selectedJob}
          disabled={isLoadingJobs}
        >
          <option value="">-- Choose a job --</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {selectedJob && (
        <div className="applicant-list">
          <h2>Applicants for {selectedJobTitle}</h2>

          {isLoadingApplicants ? (
            <p className="loading-text">Loading applicants...</p>
          ) : applicants.length > 0 ? (
            <>
              <p className="applicant-count">{applicants.length} applicant(s) found</p>
              {applicants.map((applicant) => (
                <div key={applicant._id} className="applicant-card">
                  <div className="applicant-header">
                    <div className="applicant-info">
                      <FaUser className="applicant-icon" />
                      <h3>{applicant.cv?.fullName || `User #${applicant.userId}`}</h3>
                    </div>
                    {getStatusBadge(applicant.status)}
                  </div>

                  {applicant.cv ? (
                    <div className="applicant-details">
                      <p><strong>Education:</strong> {applicant.cv.educationStatus} - {applicant.cv.schoolName}</p>
                      {applicant.cv.certificates && (
                        <p><strong>Certificates:</strong> {applicant.cv.certificates}</p>
                      )}
                    </div>
                  ) : (
                    <p className="no-cv-warning">CV data not available</p>
                  )}

                  <div className="applicant-meta">
                    <span>Applied: {new Date(applicant.appliedAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/recruiter/view-cv/${applicant._id}`, {
                      state: { application: applicant }
                    })}
                  >
                    View CV & Review
                  </button>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-state">
              <p>No applicants yet for this position.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CvReviewPage;
