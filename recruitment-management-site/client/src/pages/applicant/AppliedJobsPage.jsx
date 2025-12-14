import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI } from '../../api/api';
import './AppliedJobsPage.css';
import { FaBriefcase, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

const AppliedJobsPage = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    setError('Please login to view your applications');
                    setIsLoading(false);
                    return;
                }

                const user = JSON.parse(userStr);
                const response = await jobsAPI.getUserApplications(user.id);

                if (response.success) {
                    setApplications(response.applications);
                } else {
                    setError('Failed to load applications');
                }
            } catch (err) {
                setError('Unable to fetch applications. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <FaCheckCircle className="status-icon accepted" />;
            case 'rejected':
                return <FaTimesCircle className="status-icon rejected" />;
            default:
                return <FaHourglassHalf className="status-icon pending" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'accepted':
                return 'Accepted';
            case 'rejected':
                return 'Rejected';
            default:
                return 'Pending Review';
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="applied-jobs-container">
                <div className="loading-state">Loading your applications...</div>
            </div>
        );
    }

    return (
        <div className="applied-jobs-container">
            <h1>My Applications</h1>
            <p className="page-subtitle">Track the status of your job applications</p>

            {error && <div className="error-message">{error}</div>}

            {!error && applications.length === 0 ? (
                <div className="empty-state">
                    <FaBriefcase className="empty-icon" />
                    <h3>No Applications Yet</h3>
                    <p>You haven't applied to any jobs yet.</p>
                    <button className="btn-primary" onClick={() => navigate('/jobs')}>
                        Browse Jobs
                    </button>
                </div>
            ) : (
                <div className="applications-list">
                    {applications.map((app) => (
                        <div key={app._id || app.id} className="application-card">
                            <div className="application-header">
                                <div className="job-info">
                                    <FaBriefcase className="job-icon" />
                                    <h3>{app.jobTitle}</h3>
                                </div>
                                <div className={`status-badge ${app.status}`}>
                                    {getStatusIcon(app.status)}
                                    <span>{getStatusText(app.status)}</span>
                                </div>
                            </div>
                            <div className="application-details">
                                <div className="detail-item">
                                    <FaClock className="detail-icon" />
                                    <span>Applied on {formatDate(app.appliedAt)}</span>
                                </div>
                                {app.reviewedAt && (
                                    <div className="detail-item">
                                        <FaClock className="detail-icon" />
                                        <span>Reviewed on {formatDate(app.reviewedAt)}</span>
                                    </div>
                                )}
                            </div>
                            {app.notes && (
                                <div className="recruiter-notes">
                                    <h4>Recruiter's Feedback</h4>
                                    <p>{app.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="applications-summary">
                <p>Total Applications: <strong>{applications.length}</strong></p>
            </div>
        </div>
    );
};

export default AppliedJobsPage;

