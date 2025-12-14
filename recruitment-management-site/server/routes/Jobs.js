import express from "express";
import Job from "../model/Job.js";
import Notification from "../model/Notification.js";
import User from "../model/User.js";

const router = express.Router();

// Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("GET /jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error("GET /jobs/:id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create a new job (recruiter)
router.post("/", async (req, res) => {
  try {
    const title = req.body.title;
    const details = req.body.details || req.body.description;
    const location = req.body.location;
    const jobType = (req.body.jobType || req.body.type)?.toLowerCase().replace('-', '_');
    const deadline = req.body.deadline;
    const recruiterId = req.body.recruiterId || req.body.postedBy;

    if (!title || !details || !location || !jobType || !deadline || !recruiterId) {
      return res.status(400).json({
        success: false,
        message: "title, details, location, type, deadline, recruiterId/postedBy are required",
      });
    }

    const job = await Job.create({
      recruiterId,
      title,
      description: details,
      details,
      location,
      jobType,
      deadline,
      isActive: true,
    });

    // Notify all applicants about new job
    try {
      const applicants = await User.find({ role: "applicant" });
      const notifications = applicants.map(applicant => ({
        userId: applicant._id,
        type: "new_job",
        title: "New Job Posted! 💼",
        message: `A new position "${title}" is now available in ${location}.`,
        jobTitle: title,
      }));
      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (notifError) {
      console.error("Failed to create job notifications:", notifError);
    }

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("POST /jobs error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get recruiter's job postings
router.get("/recruiter/:recruiterId", async (req, res) => {
  try {
    const { recruiterId } = req.params;
    const jobs = await Job.find({ recruiterId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error("GET /jobs/recruiter/:recruiterId error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update job (recruiter)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const title = req.body.title;
    const details = req.body.details || req.body.description;
    const location = req.body.location;
    const jobType = (req.body.jobType || req.body.type)?.toLowerCase().replace('-', '_');
    const deadline = req.body.deadline;

    if (!title || !details || !location || !jobType || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title, details, location, type and deadline are required",
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.title = title;
    job.details = details;
    job.description = details;
    job.location = location;
    job.jobType = jobType;
    job.deadline = deadline;

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("PUT /jobs/:id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete job (recruiter)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      job,
    });
  } catch (error) {
    console.error("DELETE /jobs/:id error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
