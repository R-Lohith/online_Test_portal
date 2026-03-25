import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Login from "../models/Login.js";

const router = express.Router();

// Register Route
// Register Route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "student" // Default to student
    });

    await newUser.save();

    // Create role-specific document
    if (newUser.role === "student") {
      const newStudent = new Student({ user: newUser._id });
      await newStudent.save();
    } else if (newUser.role === "admin") {
      const newAdmin = new Admin({ user: newUser._id });
      await newAdmin.save();
    }

    res.status(201).json({ message: "User registered successfully", userId: newUser._id, role: newUser.role });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Built-in fixed credentials
    const BUILTIN_EMAIL = "master@portal.com";
    const BUILTIN_PASSWORD = "masterpassword123";

    if ((username === BUILTIN_EMAIL || username === "master") && password === BUILTIN_PASSWORD) {
      const referer = req.headers.referer || "";
      // If logging in from the admin page, assume admin role; else student role
      const role = referer.includes("/admin") ? "admin" : "student";
      
      const token = jwt.sign(
        { id: "builtin_master_id", role },
        process.env.JWT_SECRET || "SECRET123",
        { expiresIn: "1d" }
      );
      return res.json({ token, role, userId: "builtin_master_id", username: "Master User" });
    }

    // Pull login details from the DB by either username or email
    const user = await User.findOne({ 
      $or: [{ username: username }, { email: username }] 
    });
    
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    // Both the DB password and in-built login password can be matched
    const isMatch = await bcrypt.compare(password, user.password);
    const isBuiltinMatch = (password === BUILTIN_PASSWORD);

    if (!isMatch && !isBuiltinMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "SECRET123",
      { expiresIn: "1d" }
    );

    // Record login event (non-blocking but await to ensure saved)
    try {
      const ip = req.headers["x-forwarded-for"] || req.ip || req.connection?.remoteAddress || "";
      const userAgent = req.get("User-Agent") || "";
      const loginRecord = new Login({ userId: user._id, username: user.username, ip, userAgent });
      await loginRecord.save();
    } catch (recErr) {
      console.error("Failed to record login:", recErr.message);
    }

    res.json({ token, role: user.role, userId: user._id, username: user.username });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;