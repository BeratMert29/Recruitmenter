import express from 'express';
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import authenticationRoutes from './routes/authentication.js';
import adminRoutes from './routes/admin.js';
import applicantRoutes from './routes/applicant.js';
import cvRoutes from './routes/cvs.js';
import jobsRoutes from './routes/jobs.js';
import applicationsRoutes from './routes/applications.js';
import notificationsRoutes from './routes/notifications.js';
import eventsRoutes from './routes/events.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS middleware (adjust for production)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, User-Id');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Routes
app.use('/api/auth', authenticationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applicants', applicantRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/events', eventsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Authentication API: http://localhost:${PORT}/api/auth`);
    console.log(`Admin API: http://localhost:${PORT}/api/admin`);
    console.log(`Applicants API: http://localhost:${PORT}/api/applicants`);
    console.log(`CV API: http://localhost:${PORT}/api/cv`);
    console.log(`Jobs API: http://localhost:${PORT}/api/jobs`);
    console.log(`Applications API: http://localhost:${PORT}/api/applications`);
    console.log(`Notifications API: http://localhost:${PORT}/api/notifications`);
    console.log(`Events API: http://localhost:${PORT}/api/events`);
});

