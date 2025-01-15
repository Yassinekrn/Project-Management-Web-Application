const Owner = require("../models/ownerModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// DONE: updated
exports.owner_dashboard_get = asyncHandler(async (req, res) => {
    // get all owners projects
    let owner = await Owner.findById(req.user.id)
        .select("projects")
        .populate("projects");
    req.user.projects = owner.projects;
    return res.render("dashboard", { owner: req.user });
});

// DONE: updated
exports.owner_details_get = asyncHandler(async (req, res) => {
    const owner = await Owner.findById(req.user.id);
    if (!owner) {
        return res.status(404).render("owner_details", {
            error: "Owner not found. Please make sure you are logged in with the correct account.",
        });
    } else {
        return res.render("owner_details", { owner: req.user });
    }
});

// DONE: updated
exports.owner_update_get = asyncHandler(async (req, res) => {
    const owner = await Owner.findById(req.user.id);
    if (!owner) {
        return res.render("owner_update", {
            error: "Owner not found. Please make sure you are logged in with the correct account.",
        });
    } else {
        return res.render("owner_update", { owner: req.user });
    }
});

// DONE: updated
exports.owner_update_post = asyncHandler(async (req, res) => {
    const { name, password, email } = req.body;

    // Create an update object
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password && password.trim() !== "") updateData.password = password;

    // Check if there is any data to update
    if (Object.keys(updateData).length === 0) {
        return res.render("owner_update", {
            owner: req.user,
            error: "No data to update",
        });
    }
    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
        delete updateData.password;
    }

    const updatedOwner = await Owner.findByIdAndUpdate(
        req.user.id,
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedOwner) {
        return res.render("owner_update", {
            owner: req.user,
            error: "Owner not found. Please make sure you are logged in with the correct account.",
        });
    } else {
        // Recreate the access token with updated owner data
        const token = jwt.sign(
            {
                id: updatedOwner._id,
                email: updatedOwner.email,
                name: updatedOwner.name,
                role: "owner",
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
        return res.render("owner_details", { owner: updatedOwner });
    }
});

// DONE: updated
exports.owner_delete_post = asyncHandler(async (req, res) => {
    const owner = await Owner.findById(req.user.id);
    if (!owner) {
        return res.render("owner_details", {
            owner: req.user,
            error: "Owner not found. Please make sure you are logged in with the correct account.",
        });
    } else {
        await owner.remove();
        res.clearCookie("access_token");
        return res.redirect("/auth/owner/login");
    }
});
