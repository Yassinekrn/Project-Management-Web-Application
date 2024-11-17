const Owner = require("../models/ownerModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Testing auth with dashboard
exports.owner_dashboard_get = asyncHandler(async (req, res) => {
    res.render("dashboard", { owner: req.owner });
});

// Get Owner Info
exports.owner_details_get = asyncHandler(async (req, res) => {
    const owner = await Owner.findById(req.owner.id);
    console.log(owner);
    if (!owner) {
        res.status(404).json({ message: "Owner not found" });
    } else {
        res.render("owner_details", { owner });
    }
});

exports.owner_update_get = asyncHandler(async (req, res) => {
    const owner = await Owner.findById(req.owner.id);
    if (!owner) {
        res.status(404).json({ message: "Owner not found" });
    } else {
        res.render("owner_update", { owner });
    }
});

// Update Owner Info
exports.owner_update_post = asyncHandler(async (req, res) => {
    const { name, password, email } = req.body;
    console.log(req.body);

    // Create an update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password && password.trim() !== "") updateData.password = password;

    // Check if there is any data to update
    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
    }
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
        delete updateData.password;
    }

    const updatedOwner = await Owner.findByIdAndUpdate(
        req.owner.id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedOwner) {
        res.status(404).json({ message: "Owner not found" });
    } else {
        // Recreate the access token with updated owner data
        const token = jwt.sign(
            {
                id: updatedOwner._id,
                email: updatedOwner.email,
                name: updatedOwner.name,
                role: updatedOwner.role,
                createdAt: updatedOwner.createdAt,
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
        res.render("owner_details", { owner: updatedOwner });
    }
});

// Delete Owner Account
exports.deleteOwner = asyncHandler(async (req, res) => {
    res.json({ message: "deleteOwner" });
});

// Get All Owner's Projects
exports.getAllOwnerProjects = asyncHandler(async (req, res) => {
    res.json({ message: "getAllOwnerProjects" });
});

// Create Project
exports.createProject = asyncHandler(async (req, res) => {
    res.json({ message: "createProject" });
});
