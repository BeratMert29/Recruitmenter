import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import { FaUserCircle, FaBuilding, FaBell, FaCalendarAlt } from 'react-icons/fa';
import { cvAPI, jobsAPI, eventsAPI } from '../../api/api';
import { jobs as mockJobs } from '../../data/mockJobs';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [cvStatus, setCvStatus] = useState({ hasCV: false, loading: true });
  const [userCV, setUserCV] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);

      const checkCVStatus = async () => {
        try {
          const statusResponse = await cvAPI.checkStatus(userData.id);
          if (statusResponse.success) {
            setCvStatus({ hasCV: statusResponse.hasCV, loading: false });

            if (statusResponse.hasCV) {
              try {
                const cvResponse = await cvAPI.getByUserId(userData.id);
                if (cvResponse.success && cvResponse.data) {
                  setUserCV(cvResponse.data);
                }
              } catch (cvError) {
                console.log('CV details not found');
              }
            }
          }
        } catch (error) {
          setCvStatus({ hasCV: false, loading: false });
        }
      };

      // Fetch notifications
      const fetchNotifications = async () => {
        try {
          const response = await jobsAPI.getNotifications(userData.id);
          if (response.success) {
            setNotifications(response.notifications || []);
          }
        } catch (error) {
          console.log('Could not fetch notifications');
        } finally {
          setNotificationsLoading(false);
        }
      };

      checkCVStatus();
      fetchNotifications();
    } else {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsAPI.getAll();
        if (response.success && Array.isArray(response.jobs)) {
          setRecentJobs(response.jobs.slice(0, 3));
        } else {
          setRecentJobs(mockJobs.slice(0, 3));
        }
      } catch (error) {
        setRecentJobs(mockJobs.slice(0, 3));
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsAPI.getAll();
        if (response.success) {
          setEvents(response.events);
        }
      } catch (error) {
        console.log('Could not fetch events');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatEventDate = (dateStr) => {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const resizedDataUrl = await resizeImageToSquare(file, 256);
      setAvatar(resizedDataUrl);
      localStorage.setItem('userAvatar', resizedDataUrl);
    } catch (error) {
      console.error('Failed to process avatar image', error);
    } finally {
      event.target.value = '';
    }
  };

  const resizeImageToSquare = (file, size) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          const minSide = Math.min(img.width, img.height);
          const sx = (img.width - minSide) / 2;
          const sy = (img.height - minSide) / 2;
          ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  return (
    <div className="dashboard-grid">
      <div className="card profile-card">
        <div className="avatar-upload" onClick={handleAvatarClick}>
          {avatar ? (
            <img src={avatar} alt="Profile avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <FaUserCircle />
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
        <h2 className="card-title">Profile</h2>
        {user ? (
          <>
            {userCV ? (
              <h3 style={{ marginTop: '0.5rem', fontWeight: '700', fontSize: '1.2rem' }}>{userCV.fullName}</h3>
            ) : (
              <h3 style={{ marginTop: '0.5rem', fontWeight: '600' }}>{user.email.split('@')[0]}</h3>
            )}
            <p style={{ marginTop: '0.25rem', color: '#666', fontSize: '0.9rem' }}>{user.email}</p>

            {cvStatus.loading ? (
              <span className="profile-status" style={{ marginTop: '0.75rem' }}>Loading...</span>
            ) : (
              <span className={`profile-status ${cvStatus.hasCV ? 'submitted' : 'not-submitted'}`} style={{ marginTop: '0.75rem' }}>
                {cvStatus.hasCV ? 'CV Submitted' : 'CV Not Submitted'}
              </span>
            )}

            {userCV && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#555', textAlign: 'left', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>Education</span>
                  <span style={{ fontWeight: '500' }}>{userCV.educationStatus}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>School</span>
                  <span style={{ fontWeight: '500' }}>{userCV.schoolName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: '#888' }}>Status</span>
                  <span style={{ fontWeight: '500' }}>{userCV.maritalStatus}</span>
                </div>
                {userCV.certificates && (
                  <div style={{ padding: '0.5rem 0' }}>
                    <span style={{ color: '#888' }}>Certificates</span>
                    <p style={{ marginTop: '0.25rem', fontWeight: '500' }}>{userCV.certificates}</p>
                  </div>
                )}
              </div>
            )}

            {!userCV && !cvStatus.loading && (
              <div style={{ marginTop: '1rem' }}>
                <a href="/cv" style={{ color: '#1985A1', textDecoration: 'none', fontWeight: '500' }}>
                  Complete your profile →
                </a>
              </div>
            )}
          </>
        ) : (
          <>
            <p>Your Status</p>
            <span className="profile-status">Not Logged In</span>
            <div style={{ marginTop: '1rem' }}>
              <a href="/auth" style={{ color: '#1985A1', textDecoration: 'none', fontWeight: '500' }}>
                Login to view profile →
              </a>
            </div>
          </>
        )}
      </div>

      <div className="card notifications-card">
        <h3 className="card-title">Notifications</h3>
        {notificationsLoading ? (
          <div className="empty-state">
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <FaBell />
            <p>No new notifications</p>
          </div>
        ) : (
          <ul className="list notification-list">
            {notifications.slice(0, 5).map((notif) => (
              <li key={notif._id} className={`list-item notification-item ${notif.read ? 'read' : 'unread'}`}>
                <div className="notification-icon">
                  {notif.type === 'application_accepted' && '🎉'}
                  {notif.type === 'application_rejected' && '📋'}
                  {notif.type === 'new_job' && '💼'}
                  {notif.type === 'new_event' && '📅'}
                  {notif.type === 'job_deleted' && '🗑️'}
                </div>
                <div className="list-item-content">
                  <h5>{notif.title}</h5>
                  <p>{notif.message}</p>
                  <small className="list-item-subtle">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card jobs-card">
        <h3 className="card-title">
          Recent Opportunities
          <a href="/jobs">View All</a>
        </h3>
        {jobsLoading ? (
          <div className="list empty-state">
            <p>Loading job opportunities...</p>
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="list empty-state">
            <p>No openings right now. Check back soon!</p>
          </div>
        ) : (
          <ul className="list">
            {recentJobs.map(job => (
              <li key={job._id || job.id} className="list-item">
                <FaBuilding className="list-item-icon" />
                <div className="list-item-content">
                  <h5>{job.title}</h5>
                  <p>{job.location} • {job.jobType || job.type}</p>
                  {job.deadline && (
                    <small className="list-item-subtle">Deadline: {new Date(job.deadline).toLocaleDateString()}</small>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card program-card">
        <h3 className="card-title">Quick Actions</h3>
        {user ? (
          <>
            {!cvStatus.hasCV && !cvStatus.loading && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.5rem', color: '#666' }}>Complete your profile to apply for jobs</p>
                <a href="/cv" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  + Submit Your CV
                </a>
              </div>
            )}
            {cvStatus.hasCV && (
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ marginBottom: '0.5rem', color: '#666' }}>Your CV is ready! Browse available positions</p>
                <a href="/jobs" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                  Browse Jobs
                </a>
              </div>
            )}
            <div>
              <a href="/cv" style={{ color: '#1985A1', textDecoration: 'none', fontSize: '0.9rem' }}>
                {cvStatus.hasCV ? 'Update your CV' : 'View CV page'} →
              </a>
            </div>
          </>
        ) : (
          <>
            <p style={{ marginBottom: '0.5rem', color: '#666' }}>Login to start your application</p>
            <a href="/auth" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Login / Register
            </a>
          </>
        )}
      </div>

      <div className="card events-card">
        <h3 className="card-title">
          Upcoming Events
        </h3>
        {eventsLoading ? (
          <div className="list empty-state">
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="list empty-state">
            <p>No upcoming events yet.</p>
          </div>
        ) : (
          <ul className="list">
            {events.map((event) => (
              <li key={event._id || event.id} className="list-item">
                <FaCalendarAlt className="list-item-icon" />
                <div className="list-item-content">
                  <h5>{event.title}</h5>
                  <p>{formatEventDate(event.date)}</p>
                  {event.description && (
                    <small className="list-item-subtle">{event.description}</small>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;