const asyncHandler = require("express-async-handler");
const Owner = require("../models/ownerModel");
const Member = require("../models/memberModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.owner_signup_get = asyncHandler(async (req, res) => {
    if (req.isAuthenticated) {
        res.redirect("/owners/dashboard");
    } else {
        res.render("signup");
    }
});

exports.owner_signup_post = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
    }

    // Check if user already exists
    const existingUser = await Owner.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    let owner = new Owner({
        name,
        email,
        role: "owner",
    });

    // Create new user
    await owner.setPassword(password);
    await owner.save();

    res.render("login", {
        message: "Signup successful! Please login.",
    });
});

exports.owner_login_get = asyncHandler(async (req, res) => {
    if (req.isAuthenticated) {
        res.redirect("/owners/dashboard");
    } else {
        res.render("login");
    }
});

exports.owner_login_post = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const owner = await Owner.findOne({ email });
    if (!owner) {
        throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await owner.validatePassword(password);
    if (!isValidPassword) {
        throw new Error("Invalid email or password");
    }

    // Create JWT token
    const token = jwt.sign(
        {
            id: owner._id,
            email: owner.email,
            name: owner.name,
            role: owner.role,
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

    res.redirect("/owners/dashboard");
});

exports.owner_logout_post = asyncHandler(async (req, res) => {
    res.clearCookie("access_token");
    res.redirect("/auth/owner/login");
});

exports.member_signup_post = asyncHandler(async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    try {
        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if user already exists
        const existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        let member = new Member({
            name,
            email,
            role: "member",
        });

        // Create new user
        await member.setPassword(password);
        await member.save();

        res.status(201).json({ message: "Signup successful! Please login." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

exports.member_login_post = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const member = await Member.findOne({ email, role: "member" });
    if (!member) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await member.validatePassword(password);
    if (!isValidPassword) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
        {
            id: member._id,
            email: member.email,
            name: member.name,
            role: member.role,
            createdAt: member.createdAt,
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

exports.member_logout_post = asyncHandler(async (req, res) => {
    res.clearCookie("access_token");
    res.status(200).json({ message: "Logout successful" });
});
