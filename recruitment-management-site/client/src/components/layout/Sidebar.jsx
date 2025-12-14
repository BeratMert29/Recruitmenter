import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaThLarge, FaUser, FaBriefcase, FaClipboardCheck, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h3>Applicant</h3>
      </div>
      <ul className="sidebar-menu">
        <li>
          <NavLink to="/dashboard" className="sidebar-link">
            <FaThLarge className="sidebar-icon" />
            <span className="sidebar-text">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/cv" className="sidebar-link">
            <FaUser className="sidebar-icon" />
            <span className="sidebar-text">CV Page</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/jobs" className="sidebar-link">
            <FaBriefcase className="sidebar-icon" />
            <span className="sidebar-text">Job Postings</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/applied-jobs" className="sidebar-link">
            <FaClipboardCheck className="sidebar-icon" />
            <span className="sidebar-text">Applied Jobs</span>
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

export default Sidebar;