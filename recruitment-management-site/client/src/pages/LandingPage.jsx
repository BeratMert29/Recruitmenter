import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Recruiter</div>

        <div className="nav-links">
          <Link to="/auth?type=applicant">Find Jobs</Link>
          <Link to="/auth?type=recruiter">For Recruiters</Link>
          <Link to="/auth">Log in</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-left">
          <p className="tagline">HIRING MADE EASY</p>
          <h1 className="title">Jobs for Anyone,<br />Anywhere</h1>
          <p className="description">
            Discover roles that fit your life—whether you prefer remote flexibility
            or face-to-face collaboration.
          </p>

          <Link to="/auth?type=applicant" className="start-btn">Get Started</Link>
        </div>

        <div className="hero-right">
          <img
            src="/landing1.jpeg"
            className="hero-img"
            alt="working team"
          />
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="steps-section">
        <h2>Follow our steps, we will help you</h2>

        <div className="steps-container">
          <div className="step-card green">
            <h3>Create Account</h3>
            <p>Set up your profile so recruiters see the full you.</p>
          </div>

          <div className="step-card yellow">
            <h3>Enter Your CV</h3>
            <p>Upload or paste your CV once — we’ll store it securely.</p>
          </div>

          <div className="step-card teal">
            <h3>Find Job</h3>
            <p>Browse curated roles that match your skills and goals.</p>
          </div>

          <div className="step-card blue">
            <h3>Apply Job</h3>
            <p>Send tailored applications and track all statuses.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
