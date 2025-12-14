import express from "express";
import Event from "../model/Event.js";
import Notification from "../model/Notification.js";
import User from "../model/User.js";

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        return res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        console.error("GET /events error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// GET event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            event
        });
    } catch (error) {
        console.error("GET /events/:id error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// POST new event
router.post('/', async (req, res) => {
    try {
        const { title, date, description, createdBy } = req.body;

        if (!title || !date) {
            return res.status(400).json({
                success: false,
                message: "Title and date are required"
            });
        }

        // Validate date is in the future
        const eventDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (eventDate <= today) {
            return res.status(400).json({
                success: false,
                message: "Event date must be in the future"
            });
        }

        const event = await Event.create({
            title,
            date: eventDate,
            description: description || '',
            createdBy: createdBy || undefined,
        });

        // Notify all applicants about new event
        try {
            const applicants = await User.find({ role: "applicant" });
            const notifications = applicants.map(applicant => ({
                userId: applicant._id,
                type: "new_event",
                title: "New Event! 📅",
                message: `Don't miss "${title}" on ${eventDate.toLocaleDateString()}.`,
            }));
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        } catch (notifError) {
            console.error("Failed to create event notifications:", notifError);
        }

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });
    } catch (error) {
        console.error("POST /events error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// PUT (update) an event
router.put('/:id', async (req, res) => {
    try {
        const { title, date, description, userId } = req.body;

        if (!title || !date) {
            return res.status(400).json({
                success: false,
                message: "Title and date are required"
            });
        }

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.createdBy && event.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only update events you created"
            });
        }

        // Validate date is in the future
        const eventDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (eventDate <= today) {
            return res.status(400).json({
                success: false,
                message: "Event date must be in the future"
            });
        }

        event.title = title;
        event.date = eventDate;
        event.description = description || '';

        await event.save();

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event
        });
    } catch (error) {
        console.error("PUT /events/:id error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// DELETE an event
router.delete('/:id', async (req, res) => {
    try {
        const { userId } = req.body;
        const eventId = req.params.id;

        console.log("Attempting to delete event with ID:", eventId);

        // Check if ID is valid ObjectId
        if (!eventId || eventId === 'undefined' || eventId === 'null') {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: `Event not found with ID: ${eventId}`
            });
        }

        // Check if user is the creator (skip check if no createdBy)
        if (event.createdBy && userId && event.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You can only delete events you created"
            });
        }

        await event.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully",
            event
        });
    } catch (error) {
        console.error("DELETE /events/:id error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
});

export default router;
