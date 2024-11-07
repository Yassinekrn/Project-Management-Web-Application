const Project = require("../models/projectModel");
const asyncHandler = require("express-async-handler");

// View Project by ID
exports.viewProjectById = asyncHandler(async (req, res) => {
    res.json({ message: "viewProjectById" });
});

// Update Project by ID
exports.updateProjectById = asyncHandler(async (req, res) => {
    res.json({ message: "updateProjectById" });
});

// Delete Project by ID
exports.deleteProjectById = asyncHandler(async (req, res) => {
    res.json({ message: "deleteProjectById" });
});

// Add Member to Project
exports.addMemberToProject = asyncHandler(async (req, res) => {
    res.json({ message: "addMemberToProject" });
});

// Remove Member from Project
exports.removeMemberFromProject = asyncHandler(async (req, res) => {
    res.json({ message: "removeMemberFromProject" });
});

// Get All Project Members
exports.getAllProjectMembers = asyncHandler(async (req, res) => {
    res.json({ message: "getAllProjectMembers" });
});

// Get All Project Tasks
exports.getAllProjectTasks = asyncHandler(async (req, res) => {
    res.json({ message: "getAllProjectTasks" });
});
