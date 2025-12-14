const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Make an API request
 */
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Authentication API calls
 */
export const authAPI = {
    /**
     * Register a new user
     */
    register: async (email, password, role = 'applicant') => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: { email, password, role },
        });
    },

    /**
     * Login user
     */
    login: async (email, password) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
    },

    /**
     * Get all users (admin only)
     */
    getAllUsers: async () => {
        return apiRequest('/admin/users', {
            method: 'GET',
        });
    },

    /**
     * Delete user (admin only)
     */
    deleteUser: async (userId) => {
        return apiRequest(`/admin/users/${userId}`, {
            method: 'DELETE',
        });
    },

    /**
     * Update user role (admin only)
     */
    updateUserRole: async (userId, role) => {
        return apiRequest(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: { role },
        });
    },

    /**
     * Ban/unban user (admin only)
     */
    banUser: async (userId, banned, reason = '') => {
        return apiRequest(`/admin/users/${userId}/ban`, {
            method: 'PUT',
            body: { banned, reason },
        });
    },
};

/**
 * CV API calls
 */
export const cvAPI = {
    /**
     * Submit a CV (JSON data)
     */
    submit: async (cvData) => {
        return apiRequest('/cv/submit', {
            method: 'POST',
            body: cvData,
        });
    },

    /**
     * Submit a CV with FormData (for file uploads)
     */
    submitFormData: async (formData) => {
        const url = `${API_BASE_URL}/cv/submit`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header - browser will set it with boundary for FormData
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all CVs (admin only - moved to admin API)
     */
    getAll: async () => {
        return apiRequest('/admin/cvs', {
            method: 'GET',
        });
    },

    /**
     * Get CV by userId
     */
    getByUserId: async (userId) => {
        return apiRequest(`/cv/user/${userId}`, {
            method: 'GET',
        });
    },

    /**
     * Check CV status by userId
     */
    checkStatus: async (userId) => {
        return apiRequest(`/cv/status/${userId}`, {
            method: 'GET',
        });
    },

    /**
     * Delete CV by userId
     */
    deleteCV: async (userId) => {
        return apiRequest(`/cv/user/${userId}`, {
            method: 'DELETE',
        });
    },
};

/**
 * Jobs API calls
 */
export const jobsAPI = {
    /**
     * Fetch all job postings
     */
    getAll: async () => {
        return apiRequest('/jobs', {
            method: 'GET',
        });
    },

    /**
     * Create a new job posting
     */
    create: async (jobData) => {
        return apiRequest('/jobs', {
            method: 'POST',
            body: jobData,
        });
    },

    /**
     * Get jobs posted by a specific recruiter
     */
    getMyJobs: async (recruiterId) => {
        return apiRequest(`/jobs/recruiter/${recruiterId}`, {
            method: 'GET',
        });
    },

    /**
     * Apply to a job
     */
    apply: async (jobId, userId) => {
        return apiRequest('/applications', {
            method: 'POST',
            body: { jobId, userId },
        });
    },

    /**
     * Get user's applications
     */
    getUserApplications: async (userId) => {
        return apiRequest(`/applications/user/${userId}`, {
            method: 'GET',
        });
    },

    /**
     * Get all applications (for recruiters)
     */
    getAllApplications: async () => {
        return apiRequest('/applications', {
            method: 'GET',
        });
    },

    /**
     * Get applications for a specific job (for recruiters)
     */
    getJobApplications: async (jobId) => {
        return apiRequest(`/applications/job/${jobId}`, {
            method: 'GET',
        });
    },

    /**
     * Update application status (accept/reject)
     */
    updateApplicationStatus: async (applicationId, status, notes = '') => {
        return apiRequest(`/applications/${applicationId}/status`, {
            method: 'PUT',
            body: { status, notes },
        });
    },

    /**
     * Admin delete job with reason
     */
    adminDeleteJob: async (jobId, reason, adminId) => {
        return apiRequest(`/admin/jobs/${jobId}`, {
            method: 'DELETE',
            body: { reason, adminId },
        });
    },

    /**
     * Get user notifications
     */
    getNotifications: async (userId) => {
        return apiRequest(`/notifications/${userId}`, {
            method: 'GET',
        });
    },

    /**
     * Mark notification as read
     */
    markNotificationRead: async (notificationId) => {
        return apiRequest(`/notifications/${notificationId}/read`, {
            method: 'PUT',
        });
    },
};

/**
 * Events API calls
 */
export const eventsAPI = {
    /**
     * Get all events
     */
    getAll: async () => {
        return apiRequest('/events', {
            method: 'GET',
        });
    },

    /**
     * Create a new event
     */
    create: async (eventData) => {
        return apiRequest('/events', {
            method: 'POST',
            body: eventData,
        });
    },

    /**
     * Update an event (only creator can update)
     */
    update: async (eventId, eventData, userId) => {
        return apiRequest(`/events/${eventId}`, {
            method: 'PUT',
            body: { ...eventData, userId },
        });
    },

    /**
     * Delete an event (recruiter - own events only)
     */
    delete: async (eventId, userId) => {
        return apiRequest(`/events/${eventId}`, {
            method: 'DELETE',
            body: { userId },
        });
    },
};

/**
 * Admin API calls
 */
export const adminAPI = {
    /**
     * Delete any event (admin only)
     */
    deleteEvent: async (eventId, reason, adminId) => {
        return apiRequest(`/admin/events/${eventId}`, {
            method: 'DELETE',
            body: { reason, adminId },
        });
    },

    /**
     * Get all events with creator info
     */
    getAllEvents: async () => {
        return apiRequest('/admin/events', {
            method: 'GET',
        });
    },
};

export default apiRequest;

