import React from 'react';
import { useNavigate } from 'react-router-dom';
import './JobCard.css';

const JobCard = ({ job, onDelete }) => {
  const navigate = useNavigate();

  // If onDelete exists, we're in recruiter context, so route to recruiter job detail
  const handleViewDetails = () => {
    if (onDelete) {
      navigate(`/recruiter/job-posting/${job.id}`, { state: { job } });
    } else {
      navigate(`/jobs/${job.id}`, { state: { job } });
    }
  };

  return (
    <div className="job-card">
      {job.date && <div className="date-badge">{job.date}</div>}
      <h3 className="job-title">{job.title}</h3>
      <div className="job-details">
        <span className="job-location">{job.location}</span>
        <span className="job-type">{job.type}</span>
      </div>
      {job.deadline && (
        <div className="job-deadline">
          Application deadline: <strong>{job.deadline}</strong>
        </div>
      )}
      <p className="job-description">{job.description}</p>

      <button
        className="details-btn"
        onClick={handleViewDetails}
      >
        View Details
      </button>

      {onDelete && (
        <button
          className="delete-btn"
          onClick={() => onDelete(job.id)}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default JobCard;
