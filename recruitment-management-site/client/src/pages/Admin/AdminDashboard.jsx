import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, jobsAPI } from '../../api/api';
import { FaUsers, FaBriefcase, FaClipboardList, FaTrash, FaUserShield, FaUserTie, FaUser, FaBan, FaCheck } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showModal, setShowModal] = useState({ type: '', data: null });
    const [modalInput, setModalInput] = useState('');
    const navigate = useNavigate();

    // Get current admin user
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        // Check if user is admin
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/auth');
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, jobsRes, appsRes] = await Promise.all([
                authAPI.getAllUsers(),
                jobsAPI.getAll(),
                jobsAPI.getAllApplications()
            ]);

            if (usersRes.success) setUsers(usersRes.users);
            if (jobsRes.success) setJobs(jobsRes.jobs);
            if (appsRes.success) setApplications(appsRes.applications);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load data' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await authAPI.deleteUser(userId);
            if (response.success) {
                setUsers(users.filter(u => u.id !== userId));
                setMessage({ type: 'success', text: 'User deleted successfully' });
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.message || 'Failed to delete user' });
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await authAPI.updateUserRole(userId, newRole);
            if (response.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                setMessage({ type: 'success', text: 'Role updated successfully' });
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update role' });
        }
    };

    const handleBanUser = async () => {
        if (!showModal.data) return;

        try {
            const response = await authAPI.banUser(showModal.data.id, true, modalInput);
            if (response.success) {
                setUsers(users.map(u => u.id === showModal.data.id ? { ...u, banned: true, banReason: modalInput } : u));
                setMessage({ type: 'success', text: 'User banned successfully' });
                setShowModal({ type: '', data: null });
                setModalInput('');
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to ban user' });
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            const response = await authAPI.banUser(userId, false, '');
            if (response.success) {
                setUsers(users.map(u => u.id === userId ? { ...u, banned: false, banReason: null } : u));
                setMessage({ type: 'success', text: 'User unbanned successfully' });
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to unban user' });
        }
    };

    const handleDeleteJob = async () => {
        if (!showModal.data) return;

        try {
            const response = await jobsAPI.adminDeleteJob(showModal.data.id, modalInput, currentUser.id);
            if (response.success) {
                setJobs(jobs.filter(j => j.id !== showModal.data.id));
                setMessage({ type: 'success', text: 'Job deleted and recruiter notified' });
                setShowModal({ type: '', data: null });
                setModalInput('');
            } else {
                setMessage({ type: 'error', text: response.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete job' });
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <FaUserShield className="role-icon admin" />;
            case 'recruiter': return <FaUserTie className="role-icon recruiter" />;
            default: return <FaUser className="role-icon applicant" />;
        }
    };

    const stats = {
        totalUsers: users.length,
        applicants: users.filter(u => u.role === 'applicant').length,
        recruiters: users.filter(u => u.role === 'recruiter').length,
        admins: users.filter(u => u.role === 'admin').length,
        totalJobs: jobs.length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
    };

    if (isLoading) {
        return (
            <div className="admin-dashboard">
                <div className="loading">Loading admin dashboard...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <p className="subtitle">Manage users, jobs, and applications</p>

            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                    <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <FaUsers className="stat-icon" />
                    <div className="stat-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaBriefcase className="stat-icon" />
                    <div className="stat-info">
                        <h3>{stats.totalJobs}</h3>
                        <p>Total Jobs</p>
                    </div>
                </div>
                <div className="stat-card">
                    <FaClipboardList className="stat-icon" />
                    <div className="stat-info">
                        <h3>{stats.totalApplications}</h3>
                        <p>Applications</p>
                    </div>
                </div>
                <div className="stat-card pending">
                    <FaClipboardList className="stat-icon" />
                    <div className="stat-info">
                        <h3>{stats.pendingApplications}</h3>
                        <p>Pending Review</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users ({stats.totalUsers})
                </button>
                <button
                    className={`tab ${activeTab === 'jobs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    Jobs ({stats.totalJobs})
                </button>
                <button
                    className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    Applications ({stats.totalApplications})
                </button>
            </div>

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="tab-content">
                    <div className="user-breakdown">
                        <span className="badge applicant">{stats.applicants} Applicants</span>
                        <span className="badge recruiter">{stats.recruiters} Recruiters</span>
                        <span className="badge admin">{stats.admins} Admins</span>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className={user.banned ? 'banned-row' : ''}>
                                    <td>{user.id}</td>
                                    <td>
                                        {getRoleIcon(user.role)}
                                        {user.email}
                                        {user.banned && <span className="banned-label">BANNED</span>}
                                    </td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={user.role === 'admin' || user.banned}
                                            className={`role-select ${user.role}`}
                                        >
                                            <option value="applicant">Applicant</option>
                                            <option value="recruiter">Recruiter</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        {user.banned ? (
                                            <span className="status-badge rejected" title={user.banReason}>Banned</span>
                                        ) : (
                                            <span className="status-badge accepted">Active</span>
                                        )}
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="actions-cell">
                                        {user.role !== 'admin' && (
                                            <>
                                                {user.banned ? (
                                                    <button
                                                        className="btn-unban"
                                                        onClick={() => handleUnbanUser(user.id)}
                                                        title="Unban user"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-ban"
                                                        onClick={() => setShowModal({ type: 'ban', data: user })}
                                                        title="Ban user"
                                                    >
                                                        <FaBan />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    title="Delete user"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
                <div className="tab-content">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Location</th>
                                <th>Type</th>
                                <th>Posted By</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td>{job.id}</td>
                                    <td>{job.title}</td>
                                    <td>{job.location}</td>
                                    <td>{job.type}</td>
                                    <td>
                                        {users.find(u => u.id === job.postedBy)?.email || `User #${job.postedBy}`}
                                    </td>
                                    <td>{job.deadline}</td>
                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => setShowModal({ type: 'deleteJob', data: job })}
                                            title="Delete job"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Applications Tab */}
            {activeTab === 'applications' && (
                <div className="tab-content">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Job</th>
                                <th>Applicant</th>
                                <th>Status</th>
                                <th>Applied On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td>{app.id}</td>
                                    <td>{app.jobTitle || `Job #${app.jobId}`}</td>
                                    <td>{users.find(u => u.id === app.userId)?.email || `User #${app.userId}`}</td>
                                    <td>
                                        <span className={`status-badge ${app.status}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Ban User / Delete Job */}
            {showModal.type && (
                <div className="modal-overlay" onClick={() => setShowModal({ type: '', data: null })}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {showModal.type === 'ban' && (
                            <>
                                <h3>Ban User</h3>
                                <p>You are about to ban: <strong>{showModal.data?.email}</strong></p>
                                <p>This user will not be able to login until unbanned.</p>
                                <label>Reason for ban:</label>
                                <textarea
                                    value={modalInput}
                                    onChange={(e) => setModalInput(e.target.value)}
                                    placeholder="Enter the reason for banning this user..."
                                    rows={4}
                                />
                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={() => setShowModal({ type: '', data: null })}>
                                        Cancel
                                    </button>
                                    <button className="btn-confirm ban" onClick={handleBanUser}>
                                        Ban User
                                    </button>
                                </div>
                            </>
                        )}
                        {showModal.type === 'deleteJob' && (
                            <>
                                <h3>Delete Job Posting</h3>
                                <p>You are about to delete: <strong>{showModal.data?.title}</strong></p>
                                <p>The recruiter will be notified with your reason.</p>
                                <label>Reason for deletion:</label>
                                <textarea
                                    value={modalInput}
                                    onChange={(e) => setModalInput(e.target.value)}
                                    placeholder="Enter the reason for deleting this job posting..."
                                    rows={4}
                                />
                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={() => setShowModal({ type: '', data: null })}>
                                        Cancel
                                    </button>
                                    <button className="btn-confirm delete" onClick={handleDeleteJob}>
                                        Delete Job
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

