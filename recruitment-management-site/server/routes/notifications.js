import express from "express";
import Notification from "../model/Notification.js";

const router = express.Router();

// Get user's notifications
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ userId }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("GET /notifications/:userId error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findById(id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        notification.read = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        console.error("PUT /notifications/:id/read error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Mark all notifications as read
router.put("/user/:userId/read-all", async (req, res) => {
    try {
        const { userId } = req.params;

        await Notification.updateMany(
            { userId, read: false },
            { read: true }
        );

        return res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.error("PUT /notifications/user/:userId/read-all error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// Delete a notification
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Notification deleted",
        });
    } catch (error) {
        console.error("DELETE /notifications/:id error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export default router;

