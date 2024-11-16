const asyncHandler = require("express-async-handler");
const Owner = require("../models/ownerModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getSignupOwner = asyncHandler(async (req, res) => {
    if (req.isAuthenticated) {
        res.redirect("/owners/dashboard");
    } else {
        res.render("signup");
    }
});

exports.postSignupOwner = asyncHandler(async (req, res) => {
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

    res.render("auth/owner/login", {
        message: "Signup successful! Please login.",
    });
});

exports.getLoginOwner = asyncHandler(async (req, res) => {
    if (req.isAuthenticated) {
        res.redirect("/owners/dashboard");
    } else {
        res.render("login");
    }
});

exports.postLoginOwner = asyncHandler(async (req, res) => {
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

exports.postLogoutOwner = asyncHandler(async (req, res) => {
    res.clearCookie("access_token");
    res.redirect("/auth/owner/login");
});

exports.signupMember = asyncHandler(async (req, res) => {
    res.json({ message: "signup member" });
});

exports.loginMember = asyncHandler(async (req, res) => {
    res.json({ message: "login member" });
});

exports.logoutMember = asyncHandler(async (req, res) => {
    res.json({ message: "logout member" });
});
