import express from "express";
import Cv from "../model/Cv.js";
import Applicant from "../model/Applicant.js";
import { uploadCVFiles } from "../config/upload.js";

const router = express.Router();

// Submit or update CV with file uploads
router.post('/submit', uploadCVFiles.fields([
    { name: 'cvDocument', maxCount: 1 },
    { name: 'certificateFiles', maxCount: 5 }
]), async (req, res) => {
    try {
        const { userId, fullName, birthDate, maritalStatus, educationStatus, schoolName, certificates, experience } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required. Please login first."
            });
        }

        if (!fullName || !birthDate || !maritalStatus || !educationStatus || !schoolName) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be filled"
            });
        }

        // Get or create applicant profile
        let applicant = await Applicant.findOne({ userId });
        if (!applicant) {
            applicant = await Applicant.create({ userId });
        }

        // Handle uploaded files
        const cvDocument = req.files?.cvDocument?.[0];
        const certificateFiles = req.files?.certificateFiles || [];

        const cvDocumentPath = cvDocument ? `/uploads/cvs/${cvDocument.filename}` : null;
        const certificatePaths = certificateFiles.map(file => `/uploads/cvs/${file.filename}`);

        // Parse experience if it's a string
        let experienceData = experience;
        if (typeof experience === 'string') {
            try {
                experienceData = JSON.parse(experience);
            } catch (e) {
                experienceData = [];
            }
        }

        // Check if CV already exists
        const existingCV = await Cv.findOne({ applicantId: applicant._id });

        const cvData = {
            applicantId: applicant._id,
            fullName,
            birthDate,
            maritalStatus,
            educationStatus,
            schoolName,
            certificates: certificates || '',
            experience: experienceData || [],
            cvDocument: cvDocumentPath || (existingCV?.cvDocument),
            certificateFiles: certificatePaths.length > 0 ? certificatePaths : (existingCV?.certificateFiles || [])
        };

        let savedCV;
        if (existingCV) {
            // Update existing CV
            savedCV = await Cv.findByIdAndUpdate(existingCV._id, cvData, { new: true });
        } else {
            // Create new CV
            savedCV = await Cv.create(cvData);
        }

        return res.status(201).json({
            success: true,
            message: existingCV ? "CV updated successfully" : "CV submitted successfully",
            cv: savedCV
        });
    } catch (error) {
        console.error("CV submit error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
});

// GET endpoint to get CV by userId
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find applicant by userId
        const applicant = await Applicant.findOne({ userId });
        
        if (!applicant) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "CV not found for this user"
            });
        }

        // Find CV by applicantId
        const userCV = await Cv.findOne({ applicantId: applicant._id }).populate('applicantId');

        if (!userCV) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "CV not found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                ...userCV.toObject(),
                userId: userId
            }
        });
    } catch (error) {
        console.error("Get CV error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// GET endpoint to check if user has submitted CV
router.get('/status/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find applicant by userId
        const applicant = await Applicant.findOne({ userId });
        
        if (!applicant) {
            return res.status(200).json({
                success: true,
                hasCV: false,
                message: "CV not submitted"
            });
        }

        // Check if CV exists
        const userCV = await Cv.findOne({ applicantId: applicant._id });

        return res.status(200).json({
            success: true,
            hasCV: !!userCV,
            message: userCV ? "CV submitted" : "CV not submitted"
        });
    } catch (error) {
        console.error("Check CV status error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// DELETE CV
router.delete('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find applicant by userId
        const applicant = await Applicant.findOne({ userId });
        
        if (!applicant) {
            return res.status(404).json({
                success: false,
                message: "Applicant not found"
            });
        }

        // Delete CV
        const deletedCV = await Cv.findOneAndDelete({ applicantId: applicant._id });

        if (!deletedCV) {
            return res.status(404).json({
                success: false,
                message: "CV not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "CV deleted successfully"
        });
    } catch (error) {
        console.error("Delete CV error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;