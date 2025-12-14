import React, { useEffect, useState } from 'react';
import JobCard from '../../components/layout/JobCard';
import './JobListPage.css';
import { jobsAPI } from '../../api/api';
import { jobs as mockJobs } from '../../data/mockJobs';

const JobsListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: 'all',
    type: 'all',
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsAPI.getAll();
        if (response.success && Array.isArray(response.jobs)) {
          setJobs(response.jobs);
          setFilteredJobs(response.jobs);
        } else {
          setJobs(mockJobs);
          setFilteredJobs(mockJobs);
          setError('No jobs available from the server. Showing sample data.');
        }
      } catch (err) {
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
        setError('Unable to reach the server. Showing sample data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const next = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.description?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation =
        filters.location === 'all' ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesType = filters.type === 'all' || job.jobType === filters.type;
      return matchesSearch && matchesLocation && matchesType;
    });
    setFilteredJobs(next);
  }, [filters, jobs]);

  const uniqueLocations = Array.from(new Set(jobs.map((job) => job.location).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(jobs.map((job) => job.jobType).filter(Boolean)));

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="jobs-list-container">
      <h1>Open Positions</h1>
      <p>Find your next career opportunity with us.</p>
      <div className="jobs-filters">
        <div className="filter-group search-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search by title or keyword"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="location">Location</label>
          <select id="location" name="location" value={filters.location} onChange={handleFilterChange}>
            <option value="all">All locations</option>
            {uniqueLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="type">Job type</label>
          <select id="type" name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="all">All types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <div className="jobs-alert">{error}</div>}
      {isLoading ? (
        <div className="jobs-loading">Loading job listings...</div>
      ) : filteredJobs.length === 0 ? (
        <div className="jobs-empty">We don’t have any open positions right now. Please check back later.</div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsListPage;