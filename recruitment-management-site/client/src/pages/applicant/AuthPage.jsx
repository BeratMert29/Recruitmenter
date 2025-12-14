import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/api';
import './AuthPage.css';
import recruiterLogo from '../../data/dddd-removebg-preview.png';

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'applicant',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      role: 'applicant',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleModeSelect = (mode) => {
    if ((mode === 'login' && !isLoginMode) || (mode === 'signup' && isLoginMode)) {
      switchModeHandler();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        throw new Error('Email and password are required');
      }

      if (!isLoginMode) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }

        const response = await authAPI.register(formData.email, formData.password, formData.role);

        if (response.success) {
          setSuccess('Account created successfully! Redirecting to login...');
          setTimeout(() => {
            setIsLoginMode(true);
            setSuccess('');
            setFormData({
              email: formData.email,
              password: '',
              confirmPassword: '',
              role: 'applicant',
            });
          }, 2000);
        }
      } else {
        const response = await authAPI.login(formData.email, formData.password);

        if (response.success) {
          setSuccess('Login successful! Redirecting...');

          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('isAuthenticated', 'true');
          }

          // Redirect based on user role
          setTimeout(() => {
            const userRole = response.user?.role || 'applicant';
            if (userRole === 'admin') {
              navigate('/admin/dashboard');
            } else if (userRole === 'recruiter') {
              navigate('/recruiter/dashboard');
            } else {
              navigate('/dashboard');
            }
          }, 1000);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-illustration">
          <div className="auth-logo-wrapper">
            <img src={recruiterLogo} alt="Recruiter" className="auth-logo" />
          </div>
          <h2>Grow your career with confidence</h2>
          <p>
            Manage applications, submit CVs, and stay in sync with hiring teams — all from one sleek
            workspace.
          </p>
          <ul className="auth-highlights">
            <li>
              <span>✔</span> Submit and manage your CV
            </li>
            <li>
              <span>✔</span> Browse and apply to job postings
            </li>
            <li>
              <span>✔</span> Track application status
            </li>
            <li>
              <span>✔</span> Stay updated with upcoming events
            </li>
          </ul>
        </div>
        <div className="auth-panel">
          <div className="auth-tabs">
            <button
              type="button"
              className={isLoginMode ? 'active' : ''}
              onClick={() => handleModeSelect('login')}
              disabled={loading || isLoginMode}
            >
              Login
            </button>
            <button
              type="button"
              className={!isLoginMode ? 'active' : ''}
              onClick={() => handleModeSelect('signup')}
              disabled={loading || !isLoginMode}
            >
              Sign Up
            </button>
          </div>

          <div className="auth-header">
            <h3>{isLoginMode ? 'Welcome back' : 'Create an account'}</h3>
            <p>
              {isLoginMode
                ? 'Access your personalized dashboard and stay updated on your applications.'
                : 'Set up your profile in seconds to unlock tailored job recommendations.'}
            </p>
          </div>

          {error && (
            <div className="message error-message">
              {error}
            </div>
          )}
          {success && (
            <div className="message success-message">
              {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                placeholder="name@company.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            {!isLoginMode && (
              <>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    minLength={6}
                    placeholder="Repeat password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">I am a...</label>
                  <div className="role-selector">
                    <button
                      type="button"
                      className={`role-btn ${formData.role === 'applicant' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, role: 'applicant' }))}
                      disabled={loading}
                    >
                      <span className="role-icon">👤</span>
                      <span>Job Seeker</span>
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${formData.role === 'recruiter' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, role: 'recruiter' }))}
                      disabled={loading}
                    >
                      <span className="role-icon">💼</span>
                      <span>Recruiter</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : isLoginMode ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="form-switch subtle">
            {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => handleModeSelect(isLoginMode ? 'signup' : 'login')}
              className="switch-btn"
              disabled={loading}
            >
              {isLoginMode ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;