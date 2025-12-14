import express from "express";
import Applicant from "../model/Applicant.js";
import { uploadProfilePicture } from "../config/upload.js";

const router = express.Router();

// Upload profile picture
router.post('/:userId/profile-picture', uploadProfilePicture.single('profilePicture'), async (req, res) => {
    try {
        const { userId } = req.params;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Save file path in database
        const profilePicturePath = `/uploads/profiles/${req.file.filename}`;
        
        const applicant = await Applicant.findOneAndUpdate(
            { userId },
            { profilePicture: profilePicturePath },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            profilePicture: profilePicturePath,
            applicant
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error uploading profile picture"
        });
    }
});

// Get applicant profile
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        const applicant = await Applicant.findOne({ userId }).populate('userId', 'email role');

        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: "Applicant not found"
            });
        }

        return res.status(200).json({
            success: true,
            applicant
        });
    } catch (error) {
        console.error("Get applicant error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Update applicant profile
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, phone, city, country } = req.body;

        const applicant = await Applicant.findOneAndUpdate(
            { userId },
            { firstName, lastName, phone, city, country },
            { new: true, upsert: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            applicant
        });
    } catch (error) {
        console.error("Update applicant error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Delete profile picture
router.delete('/:userId/profile-picture', async (req, res) => {
    try {
        const { userId } = req.params;

        const applicant = await Applicant.findOneAndUpdate(
            { userId },
            { profilePicture: null },
            { new: true }
        );

        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: "Applicant not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile picture removed",
            applicant
        });
    } catch (error) {
        console.error("Delete picture error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;

