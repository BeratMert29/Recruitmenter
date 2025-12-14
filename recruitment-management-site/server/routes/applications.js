import express from "express";
import Job from "../model/Job.js";
import Application from "../model/Application.js";
import Notification from "../model/Notification.js";

const router = express.Router();

// Apply for a job
router.post("/", async (req, res) => {
    try {
        const { jobId, userId } = req.body;

        if (!jobId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Please login first to apply for a job",
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const alreadyApplied = await Application.findOne({
            jobId,
            userId,
        });

        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: "You have already applied to this job",
            });
        }

        const application = await Application.create({
            jobId,
            userId,
            jobTitle: job.title,
            status: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application,
        });
    } catch (error) {
        console.error("POST /applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Get all applications (admin/recruiter)
router.get("/", async (req, res) => {
    try {
        const applications = await Application.find().sort({ appliedAt: -1 });

        return res.status(200).json({
            success: true,
            applications,
        });
    } catch (error) {
        console.error("GET /applications error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Get user's applications
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const applications = await Application.find({ userId }).sort({ appliedAt: -1 });

        return res.status(200).json({
            success: true,
            applications,
        });
    } catch (error) {
        console.error("GET /applications/user/:userId error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Get applications for a specific job
router.get("/job/:jobId", async (req, res) => {
    try {
        const { jobId } = req.params;
        const applications = await Application.find({ jobId }).sort({ appliedAt: -1 });

        return res.status(200).json({
            success: true,
            applications,
        });
    } catch (error) {
        console.error("GET /applications/job/:jobId error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Update application status (recruiter)
router.put("/:applicationId/status", async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, notes } = req.body;

        if (!status || !["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Valid status (pending, accepted, rejected) is required",
            });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        const previousStatus = application.status;
        application.status = status;
        application.notes = notes || application.notes;
        application.reviewedAt = new Date();

        await application.save();

        // Create notification for applicant when status changes
        if (previousStatus !== status && status !== "pending") {
            const notificationTitle = status === "accepted"
                ? "Application Accepted! 🎉"
                : "Application Update";
            const notificationMessage = status === "accepted"
                ? `Congratulations! Your application for "${application.jobTitle}" has been accepted.`
                : `Your application for "${application.jobTitle}" has been reviewed and was not selected.`;

            await Notification.create({
                userId: application.userId,
                type: `application_${status}`,
                title: notificationTitle,
                message: notificationMessage,
                jobTitle: application.jobTitle,
            });
        }

        return res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            application,
        });
    } catch (error) {
        console.error("PUT /applications/:id/status error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export default router;

