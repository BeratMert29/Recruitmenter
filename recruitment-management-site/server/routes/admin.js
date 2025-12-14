import express from "express";
import User from "../model/User.js";
import Cv from "../model/Cv.js";
import Applicant from "../model/Applicant.js";
import Job from "../model/Job.js";
import Event from "../model/Event.js";
import Notification from "../model/Notification.js";

const router = express.Router();

// Get all CVs
router.get('/cvs', async (req, res) => {
    try {
        const cvs = await Cv.find().populate('applicantId', 'userId firstName lastName');
        
        return res.status(200).json({
            success: true,
            cvs: cvs
        });
    } catch (error) {
        console.error("Get all CVs error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
        
        const usersResponse = users.map(user => ({
            id: user._id,
            email: user.email,
            role: user.role,
            banned: user.banned || false,
            banReason: user.banReason,
            bannedAt: user.bannedAt,
            createdAt: user.createdAt
        }));

        return res.status(200).json({
            success: true,
            users: usersResponse
        });
    } catch (error) {
        console.error("Get users error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findById(userId, { passwordHash: 0 });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userResponse = {
            id: user._id,
            email: user.email,
            role: user.role,
            banned: user.banned || false,
            banReason: user.banReason,
            bannedAt: user.bannedAt,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        console.error("Get user error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: "Cannot delete admin user"
            });
        }

        await User.findByIdAndDelete(userId);

        const userResponse = {
            id: user._id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            user: userResponse
        });
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Update user role
router.put('/users/:id/role', async (req, res) => {
    try {
        const userId = req.params.id;
        const { role } = req.body;

        const validRoles = ['applicant', 'recruiter', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be: applicant, recruiter, or admin"
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, select: '-passwordHash' }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const userResponse = {
            id: user._id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: userResponse
        });
    } catch (error) {
        console.error("Update role error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Ban/unban user
router.put('/users/:id/ban', async (req, res) => {
    try {
        const userId = req.params.id;
        const { banned, reason } = req.body;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: "Cannot ban admin user"
            });
        }

        const updateData = {
            banned: banned,
            banReason: banned ? (reason || 'No reason provided') : null,
            bannedAt: banned ? new Date() : null
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: '-passwordHash' }
        );

        const userResponse = {
            id: updatedUser._id,
            email: updatedUser.email,
            role: updatedUser.role,
            banned: updatedUser.banned,
            banReason: updatedUser.banReason,
            bannedAt: updatedUser.bannedAt,
            createdAt: updatedUser.createdAt
        };

        return res.status(200).json({
            success: true,
            message: banned ? "User banned successfully" : "User unbanned successfully",
            user: userResponse
        });
    } catch (error) {
        console.error("Ban/unban error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Admin delete job (with notification to recruiter)
router.delete("/jobs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, adminId } = req.body;

        const job = await Job.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const notification = await Notification.create({
            userId: job.recruiterId,
            type: "job_deleted",
            title: "Job Posting Removed",
            message: `Your job posting "${job.title}" has been removed by an administrator.`,
            reason: reason || "No reason provided",
            jobTitle: job.title,
            adminId: adminId || undefined,
        });

        await job.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Job deleted by admin successfully",
            job,
            notification,
        });
    } catch (error) {
        console.error("DELETE /admin/jobs/:id error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Admin delete event (can delete any event)
router.delete("/events/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, adminId } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        // Notify the creator if exists
        if (event.createdBy) {
            await Notification.create({
                userId: event.createdBy,
                type: "event_deleted",
                title: "Event Removed",
                message: `Your event "${event.title}" has been removed by an administrator.`,
                reason: reason || "No reason provided",
                adminId: adminId || undefined,
            });
        }

        await event.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Event deleted by admin successfully",
            event,
        });
    } catch (error) {
        console.error("DELETE /admin/events/:id error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Admin get all events
router.get("/events", async (req, res) => {
    try {
        const events = await Event.find()
            .populate("createdBy", "email")
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        console.error("GET /admin/events error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export default router;

