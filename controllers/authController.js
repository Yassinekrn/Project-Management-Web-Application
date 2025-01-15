const asyncHandler = require("express-async-handler");
const Owner = require("../models/ownerModel");
const jwt = require("jsonwebtoken");
const Worker = require("../models/workerModel");
const validator = require("validator");
require("dotenv").config();

// TODO: check middleware and fix it
exports.owner_signup_get = asyncHandler(async (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/owners/dashboard");
    } else {
        return res.render("signup");
    }
});

// DONE: updated
exports.owner_signup_post = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.render("signup", { error: "Passwords do not match" });
    }

    // Check if user already exists
    const existingUser = await Owner.findOne({ email });
    if (existingUser) {
        return res.render("signup", {
            error: "User with the same email already exists",
        });
    }

    let owner = new Owner({
        name,
        email,
    });

    // Create new user
    await owner.setPassword(password);
    await owner.save();

    res.render("login", {
        message: "Signup successful! Please login.",
    });
});

// TODO: check middleware and fix it
exports.owner_login_get = asyncHandler(async (req, res) => {
    if (req.isAuthenticated) {
        return res.redirect("/owners/dashboard");
    } else {
        return res.render("login");
    }
});

// DONE: updated
exports.owner_login_post = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const owner = await Owner.findOne({ email });
    if (!owner) {
        return res.render("login", { error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await owner.validatePassword(password);
    if (!isValidPassword) {
        return res.render("login", { error: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
        {
            id: owner._id,
            email: owner.email,
            name: owner.name,
            role: "owner",
            createdAt: owner.createdAt,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    // Set cookie with token
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return res.redirect("/owners/dashboard");
});

// DONE: updated
exports.owner_logout_post = asyncHandler(async (req, res) => {
    res.clearCookie("access_token");
    return res.redirect("/auth/owner/login");
});

// DONE: updated
exports.worker_signup_post = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Email validation using validator
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await Worker.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        let worker = new Worker({
            name,
            email,
        });

        // Create new user
        await worker.setPassword(password);
        await worker.save();

        res.status(201).json({ message: "Signup successful! Please login." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DONE: updated
exports.worker_login_post = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Email validation using validator
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    // Find user by email
    const worker = await Worker.findOne({ email });
    if (!worker) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await worker.validatePassword(password);
    if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
        {
            id: worker._id,
            email: worker.email,
            name: worker.name,
            role: "worker",
            createdAt: worker.createdAt,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );

    // Set cookie with token
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({ message: "Login successful", token });
});

// DONE: updated
exports.worker_logout_post = asyncHandler(async (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logout successful" });
});
