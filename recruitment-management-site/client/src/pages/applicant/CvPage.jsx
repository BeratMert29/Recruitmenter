import React, { useState, useEffect } from 'react';
import { cvAPI } from '../../api/api';
import './CvPage.css';
import universities from '../../data/universities.json';

const CvPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    maritalStatus: 'Single',
    educationStatus: 'Student',
    schoolName: '',
    certificates: '',
    experience: []
  });

  const [certificateFiles, setCertificateFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoadingCV, setIsLoadingCV] = useState(true);
  const [isOtherUni, setIsOtherUni] = useState(false);
  const [hasCV, setHasCV] = useState(false);

  useEffect(() => {
    const loadExistingCV = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const statusResponse = await cvAPI.checkStatus(user.id);

          if (statusResponse.success && statusResponse.hasCV) {
            setHasCV(true);
            const cvResponse = await cvAPI.getByUserId(user.id);
            if (cvResponse.success && cvResponse.data) {
              const cvData = cvResponse.data;
              
              setFormData({
                fullName: cvData.fullName || '',
                birthDate: cvData.birthDate || '',
                maritalStatus: cvData.maritalStatus || 'Single',
                educationStatus: cvData.educationStatus || 'Student',
                schoolName: cvData.schoolName || '',
                certificates: cvData.certificates || '',
                experience: cvData.experience || []
              });

              // Check if saved school is not in universities.json → must be "Other"
              if (cvData.schoolName && !universities.includes(cvData.schoolName)) {
                setIsOtherUni(true);
              }
            }
          } else {
            setHasCV(false);
          }
        }
      } catch (err) {
        console.log('No existing CV found:', err);
        setHasCV(false);
      } finally {
        setIsLoadingCV(false);
      }
    };

    loadExistingCV();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (error) setError('');
  };

  const handleCertificateUpload = (e) => {
    setCertificateFiles([...e.target.files]);
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { jobTitle: '', company: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, experience: updated }));
  };

  const removeExperience = (index) => {
    const updated = [...formData.experience];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, experience: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Please login first');

      const user = JSON.parse(userStr);

      // Create FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user.id);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('birthDate', formData.birthDate);
      formDataToSend.append('maritalStatus', formData.maritalStatus);
      formDataToSend.append('educationStatus', formData.educationStatus);
      formDataToSend.append('schoolName', formData.schoolName);
      formDataToSend.append('certificates', formData.certificates);
      formDataToSend.append('experience', JSON.stringify(formData.experience));

      // Add certificate files if selected
      if (certificateFiles.length > 0) {
        certificateFiles.forEach(file => {
          formDataToSend.append('certificateFiles', file);
        });
      }

      const response = await cvAPI.submitFormData(formDataToSend);

      if (response.success) {
        setSuccess('CV submitted successfully!');
        setHasCV(true);
        setCertificateFiles([]);
        // Reset file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit CV.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!window.confirm('Are you sure you want to delete your CV? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('Please login first');

      const user = JSON.parse(userStr);
      const response = await cvAPI.deleteCV(user.id);

      if (response.success) {
        setSuccess('CV deleted successfully!');
        setHasCV(false);
        // Reset form
        setFormData({
          fullName: '',
          birthDate: '',
          maritalStatus: 'Single',
          educationStatus: 'Student',
          schoolName: '',
          certificates: '',
          experience: []
        });
        setCertificateFiles([]);
        setIsOtherUni(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete CV.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cv-form-container">
      <h1>Submit Your CV</h1>
      <p>Please fill out the form below with your information.</p>

      {error && <div className="message error-message">{error}</div>}
      {success && <div className="message success-message">{success}</div>}

      <form className="cv-form" onSubmit={handleSubmit}>

        {/* PERSONAL INFO */}
        <div className="form-section">
          <h2>Personal Information</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* EDUCATION */}
        <div className="form-section">
          <h2>Education & Skills</h2>

          <div className="form-group">
            <label>Current Status</label>
            <select
              name="educationStatus"
              value={formData.educationStatus}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Student">Student</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          {/* UNIVERSITY DROPDOWN */}
          <div className="form-group">
            <label>University / School</label>

            <select
              id="universitySelect"
              className="scroll-dropdown"
              value={isOtherUni ? "Other" : formData.schoolName}
              onChange={(e) => {
                if (e.target.value === "Other") {
                  setIsOtherUni(true);
                  setFormData(prev => ({ ...prev, schoolName: "" }));
                } else {
                  setIsOtherUni(false);
                  setFormData(prev => ({ ...prev, schoolName: e.target.value }));
                }
              }}
              disabled={loading}
            >
              <option value="">Select a university</option>

              {universities.map((uni, idx) => (
                <option key={idx} value={uni}>
                  {uni}
                </option>
              ))}

              <option value="Other">Other…</option>
            </select>

            {isOtherUni && (
              <input
                type="text"
                name="schoolName"
                placeholder="Enter your university"
                value={formData.schoolName}
                onChange={handleChange}
                disabled={loading}
                className="other-uni-input"
              />
            )}
          </div>

          <div className="form-group">
            <label>Certificates (written)</label>
            <textarea
              name="certificates"
              value={formData.certificates}
              onChange={handleChange}
              rows="4"
              disabled={loading}
              placeholder="List your certificates here..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Upload Certificate Files (Max 5)</label>
            <input
              type="file"
              multiple
              accept="application/pdf, image/png, image/jpeg"
              onChange={handleCertificateUpload}
              disabled={loading}
            />
            {certificateFiles.length > 0 && (
              <p className="file-info">{certificateFiles.length} file(s) selected</p>
            )}
          </div>
        </div>

        {/* EXPERIENCE */}
        <div className="form-section">
          <h2>Past Experiences</h2>

          {formData.experience.map((exp, index) => (
            <div key={index} className="experience-card">
              <h3>Experience {index + 1}</h3>

              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  value={exp.jobTitle}
                  onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="two-column">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={exp.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>

              <button
                type="button"
                onClick={() => removeExperience(index)}
                className="btn-danger"
                disabled={loading}
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addExperience}
            className="btn-secondary"
            disabled={loading}
          >
            + Add Experience
          </button>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit CV'}
        </button>
      </form>

      {/* Delete CV Section */}
      {hasCV && (
        <div className="delete-cv-section">
          <p className="delete-cv-text">
            Want to start over? 
            <button 
              onClick={handleDeleteCV} 
              className="btn-delete-link" 
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete CV'}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default CvPage;
