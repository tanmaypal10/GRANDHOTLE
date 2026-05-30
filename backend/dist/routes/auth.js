"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkeyforgrandhotel";
// @route   POST /api/auth/register
// @desc    Register a new user (guest, staff, or admin)
router.post("/register", async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        // Determine role (default to guest, but automatically make admin@grandhotel.com an admin)
        let finalRole = "guest";
        if (role && ["guest", "staff", "admin"].includes(role)) {
            finalRole = role;
        }
        else if (email.toLowerCase() === "admin@grandhotel.com") {
            finalRole = "admin";
        }
        const newUser = new User_1.default({
            email,
            passwordHash,
            name,
            role: finalRole,
        });
        const savedUser = await newUser.save();
        const token = jsonwebtoken_1.default.sign({ id: savedUser._id, email: savedUser.email, role: savedUser.role }, JWT_SECRET, { expiresIn: "7d" });
        return res.status(201).json({
            token,
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error during registration", error });
    }
});
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error during login", error });
    }
});
// @route   GET /api/auth/me
// @desc    Get current user details
router.get("/me", auth_1.authenticate, async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user?.id).select("-passwordHash");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error fetching profile", error });
    }
});
// @route   GET /api/auth/role/:userId
// @desc    Get role for a user (mainly for frontend compatibility)
router.get("/role/:userId", async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.userId);
        if (!user) {
            return res.json({ role: null });
        }
        return res.json({ role: user.role });
    }
    catch (error) {
        return res.json({ role: null });
    }
});
exports.default = router;
