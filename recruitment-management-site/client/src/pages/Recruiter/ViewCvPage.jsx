import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { cvAPI, jobsAPI } from "../../api/api.js";
import "./ViewCvPage.css";

const ViewCvPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const applicationId = Number(id);

  const [application, setApplication] = useState(location.state?.application || null);
  const [cv, setCv] = useState(location.state?.application?.cv || null);
  const [decision, setDecision] = useState(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(!location.state?.application);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // If we have application from navigation state, use it
    if (location.state?.application) {
      setApplication(location.state.application);
      setCv(location.state.application.cv);
      setDecision(location.state.application.status === 'pending' ? null : location.state.application.status);
      setNotes(location.state.application.notes || '');
      setIsLoading(false);
      return;
    }

    // Otherwise, we need to fetch from API (this shouldn't normally happen)
    setIsLoading(false);
  }, [location.state, applicationId]);

  const handleDecision = async (status) => {
    if (!application) return;

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await jobsAPI.updateApplicationStatus(application._id, status, notes);

      if (response.success) {
        setDecision(status);
        setApplication({ ...application, status, notes });
        setMessage({
          type: 'success',
          text: `Application ${status === 'accepted' ? 'approved' : 'rejected'} successfully!`
        });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update status' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update application status' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="cv-view-container">
        <p>Loading applicant data...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="cv-view-container">
        <h2>Application not found</h2>
        <p>Please go back and select an applicant from the list.</p>
        <button className="btn-secondary" onClick={() => navigate('/recruiter/cv-review')}>
          ← Back to CV Review
        </button>
      </div>
    );
  }

  return (
    <div className="cv-view-container">
      <button className="btn-back" onClick={() => navigate('/recruiter/cv-review')}>
        ← Back to CV Review
      </button>

      <h1>Applicant CV</h1>
      <p className="job-applied">Applied for: <strong>{application.jobTitle}</strong></p>

      {cv ? (
        <>
          <div className="cv-section">
            <h2>Personal Information</h2>
            <p><strong>Full Name:</strong> {cv.fullName}</p>
            <p><strong>Date of Birth:</strong> {cv.birthDate}</p>
            <p><strong>Marital Status:</strong> {cv.maritalStatus}</p>
          </div>

          <div className="cv-section">
            <h2>Education & Skills</h2>
            <p><strong>Education Status:</strong> {cv.educationStatus}</p>
            <p><strong>School/University:</strong> {cv.schoolName}</p>
            {cv.certificates && (
              <p><strong>Certificates:</strong> {cv.certificates}</p>
            )}
          </div>

          {cv.experience && cv.experience.length > 0 && (
            <div className="cv-section">
              <h2>Work Experience</h2>
              {cv.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h4>{exp.jobTitle} at {exp.company}</h4>
                  <p className="exp-dates">{exp.startDate} - {exp.endDate || 'Present'}</p>
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* CV Document Download */}
          {cv.cvDocument && (
            <div className="cv-section">
              <h2>CV Document</h2>
              <a
                href={`http://localhost:3000${cv.cvDocument}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-download"
              >
                📄 View/Download CV Document
              </a>
            </div>
          )}

          {/* Certificate Files */}
          {cv.certificateFiles && cv.certificateFiles.length > 0 && (
            <div className="cv-section">
              <h2>Certificate Files</h2>
              <div className="certificate-links">
                {cv.certificateFiles.map((file, index) => (
                  <a
                    key={index}
                    href={`http://localhost:3000${file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-download"
                  >
                    📎 Certificate {index + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="cv-section">
          <p className="no-cv-warning">CV data is not available for this applicant.</p>
        </div>
      )}

      <div className="cv-section">
        <h2>Application Details</h2>
        <p><strong>Applied On:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
        <p><strong>Current Status:</strong> <span className={`status-text ${application.status}`}>{application.status}</span></p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="cv-section decision-card">
        <h2>Decision</h2>
        <textarea
          className="decision-notes"
          placeholder="Add recruiter notes (visible to your team)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          disabled={isSaving}
        />
        <div className="decision-actions">
          <button
            type="button"
            className={`decision-btn approve ${decision === 'accepted' ? 'active' : ''}`}
            onClick={() => handleDecision('accepted')}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Approve'}
          </button>
          <button
            type="button"
            className={`decision-btn decline ${decision === 'rejected' ? 'active' : ''}`}
            onClick={() => handleDecision('rejected')}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Decline'}
          </button>
        </div>
        {decision && decision !== 'pending' && (
          <p className={`decision-status ${decision}`}>
            This candidate has been <strong>{decision}</strong>.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewCvPage;
