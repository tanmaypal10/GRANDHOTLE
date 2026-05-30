import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkeyforgrandhotel";

// @route   POST /api/auth/register
// @desc    Register a new user (guest, staff, or admin)
router.post("/register", async (req: any, res: Response) => {
  const { email, password, name, role } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Determine role (default to guest, but automatically make admin@grandhotel.com an admin)
    let finalRole: "guest" | "staff" | "admin" = "guest";
    if (role && ["guest", "staff", "admin"].includes(role)) {
      finalRole = role as "guest" | "staff" | "admin";
    } else if (email.toLowerCase() === "admin@grandhotel.com") {
      finalRole = "admin";
    }

    const newUser = new User({
      email,
      passwordHash,
      name,
      role: finalRole,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration", error });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req: any, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login", error });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user details
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error fetching profile", error });
  }
});

// @route   GET /api/auth/role/:userId
// @desc    Get role for a user (mainly for frontend compatibility)
router.get("/role/:userId", async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.json({ role: null });
    }
    return res.json({ role: user.role });
  } catch (error) {
    return res.json({ role: null });
  }
});

export default router;
