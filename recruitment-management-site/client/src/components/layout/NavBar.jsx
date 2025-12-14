import React from 'react';
import './Navbar.css'; // We will create this CSS file next

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a href="/">Recruitment System</a>
      </div>
      <div className="navbar-links">
        <a href="/jobs">Find a Job</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </nav>
  );
};

export default Navbar;