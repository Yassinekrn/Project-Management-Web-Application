const Member = require("../models/memberModel");
const asyncHandler = require("express-async-handler");

// Get Member Info
exports.getMemberInfo = asyncHandler(async (req, res) => {
    res.json({ message: "getMemberInfo" });
});

// Update Member Info
exports.updateMemberInfo = asyncHandler(async (req, res) => {
    res.json({ message: "updateMemberInfo" });
});

// Delete Member Account
exports.deleteMember = asyncHandler(async (req, res) => {
    res.json({ message: "deleteMember" });
});

// View Personal Projects
exports.viewPersonalProjects = asyncHandler(async (req, res) => {
    res.json({ message: "viewPersonalProjects" });
});

// View Personal Tasks
exports.viewPersonalTasks = asyncHandler(async (req, res) => {
    res.json({ message: "viewPersonalTasks" });
});
