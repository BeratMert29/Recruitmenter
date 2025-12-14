import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaThLarge, FaBriefcase, FaUserTie, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';

const RecruiterSidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3>Recruiter</h3>
      </div>

      <ul className="sidebar-menu">
        <li>
          <NavLink to="/recruiter" end className="sidebar-link">
            <FaThLarge className="sidebar-icon" />
            <span className="sidebar-text">Overview</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/recruiter/job-posting" className="sidebar-link">
            <FaBriefcase className="sidebar-icon" />
            <span className="sidebar-text">Manage Jobs</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/recruiter/cv-review" className="sidebar-link">
            <FaUserTie className="sidebar-icon" />
            <span className="sidebar-text">CV Review</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/recruiter/events" className="sidebar-link">
            <FaCalendarAlt className="sidebar-icon" />
            <span className="sidebar-text">Events</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <NavLink to="/auth" className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon" />
          <span className="sidebar-text">Logout</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default RecruiterSidebar;
