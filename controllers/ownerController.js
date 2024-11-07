const Owner = require("../models/ownerModel");
const asyncHandler = require("express-async-handler");

// Get Owner Info
exports.getOwnerInfo = asyncHandler(async (req, res) => {
    res.json({ message: "getOwnerInfo" });
});

// Update Owner Info
exports.updateOwnerInfo = asyncHandler(async (req, res) => {
    res.json({ message: "updateOwnerInfo" });
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
