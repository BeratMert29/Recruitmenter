import express from "express";
import bcrypt from "bcryptjs";
import User from "../model/User.js";

const router = express.Router();

// Initialize default admin account on first run
const initializeAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: "admin@recruiter.com" });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                email: "admin@recruiter.com",
                passwordHash: hashedPassword,
                role: "admin"
            });
            console.log("✅ Default admin account created");
        }
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
    }
};

// Initialize admin on module load
initializeAdmin();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const validRoles = ['applicant', 'recruiter'];
        const userRole = validRoles.includes(role) ? role : 'applicant';

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            passwordHash: hashedPassword,
            role: userRole
        });

        const userResponse = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt
        };

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
        });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

// Login existing user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (user.banned) {
            return res.status(403).json({
                success: false,
                message: `Your account has been banned. Reason: ${user.banReason || 'No reason provided'}`,
                banned: true
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
            message: "Login successful",
            user: userResponse
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default router;