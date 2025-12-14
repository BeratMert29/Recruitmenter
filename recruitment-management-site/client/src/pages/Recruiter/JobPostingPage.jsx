import React, { useState, useEffect } from 'react';
import './JobPostingPage.css';
import { jobsAPI } from '../../api/api';
import JobCard from '../../components/layout/JobCard';

const JobPostingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({
    title: '',
    location: '',
    type: '',
    deadline: '',
    description: '',
    detailedDescription: '',
  });

  // Get current user
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch recruiter's own jobs
  useEffect(() => {
    const fetchMyJobs = async () => {
      if (!user.id) return;

      try {
        const response = await jobsAPI.getMyJobs(user.id);
        if (response.success) {
          setJobs(response.jobs);
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyJobs();
  }, [user.id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!form.title || !form.location || !form.type || !form.deadline) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }

    try {
      const jobData = {
        title: form.title,
        location: form.location,
        type: form.type,
        deadline: form.deadline,
        details: form.description || 'No description provided.',
        postedBy: user.id,
      };

      const response = await jobsAPI.create(jobData);

      if (response.success) {
        setJobs([...jobs, response.job]);
        setForm({
          title: '',
          location: '',
          type: '',
          deadline: '',
          description: '',
          detailedDescription: '',
        });
        setMessage({ type: 'success', text: 'Job posted successfully!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to create job' });
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job posting?');
    if (confirmDelete) {
      setJobs(jobs.filter((job) => job.id !== id));
      // TODO: Add API call to delete job
    }
  };

  return (
    <div className="job-posting-page">
      <h1>Job Posting Management</h1>
      <p className="page-subtitle">Create and manage your job postings</p>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="job-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="">Select Type</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Short Job Description"
          value={form.description}
          onChange={handleChange}
        />
        <textarea
          name="detailedDescription"
          placeholder="Detailed Job Description (long text)"
          value={form.detailedDescription}
          onChange={handleChange}
          rows="6"
        />
        <button type="submit" className="btn-primary">Add Job</button>
      </form>

      <div className="job-list">
        <h2>Your Job Postings</h2>
        {isLoading ? (
          <p>Loading your jobs...</p>
        ) : jobs.length === 0 ? (
          <p>You haven't posted any jobs yet. Create your first job posting above!</p>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default JobPostingPage;
