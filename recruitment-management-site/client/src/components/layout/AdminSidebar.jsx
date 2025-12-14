import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import { FaThLarge, FaUsers, FaBriefcase, FaClipboardList, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const AdminSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userAvatar');
        navigate('/auth');
    };

    return (
        <nav className="sidebar admin-sidebar">
            <div className="sidebar-header">
                <FaUserShield className="admin-icon" />
                <h3>Admin Panel</h3>
            </div>
            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/admin/dashboard" className="sidebar-link">
                        <FaThLarge className="sidebar-icon" />
                        <span className="sidebar-text">Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/users" className="sidebar-link">
                        <FaUsers className="sidebar-icon" />
                        <span className="sidebar-text">Manage Users</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/jobs" className="sidebar-link">
                        <FaBriefcase className="sidebar-icon" />
                        <span className="sidebar-text">All Jobs</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/applications" className="sidebar-link">
                        <FaClipboardList className="sidebar-icon" />
                        <span className="sidebar-text">All Applications</span>
                    </NavLink>
                </li>
            </ul>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="sidebar-link logout-btn">
                    <FaSignOutAlt className="sidebar-icon" />
                    <span className="sidebar-text">Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default AdminSidebar;

