const Member = require("../models/memberModel");
const asyncHandler = require("express-async-handler");

// Get Member Info
exports.getMemberInfo = asyncHandler(async (req, res) => {
    let member = await Member.findById(req.owner.id)
        .populate("projects tasks")
        .select("-passwordHash");
    if (!member) {
        res.status(404).json({ message: "Member not found" });
    }
    res.json(member);
});

// Update Member Info
exports.updateMemberInfo = asyncHandler(async (req, res) => {
    let member = await Member.findById(req.owner.id);
    if (!member) {
        res.status(404).json({ message: "Member not found" });
    }
    member.name = req.body.name || member.name;
    member.email = req.body.email || member.email;

    await member.save();
    res.json(member);
});

// Delete Member Account
exports.deleteMember = asyncHandler(async (req, res) => {
    let member = await Member.findById(req.owner.id);
    if (!member) {
        res.status(404).json({ message: "Member not found" });
    }
    await member.remove();
    // delete the cookie
    res.clearCookie("token");
    res.json({ message: "Member deleted" });
});

// View Personal Projects
exports.viewPersonalProjects = asyncHandler(async (req, res) => {
    let member = await Member.findById(req.owner.id)
        .populate("projects")
        .select("projects");

    if (!member) {
        res.status(404).json({ message: "Member not found" });
    }
    res.json(member.projects);
});

// View Personal Tasks
exports.viewPersonalTasks = asyncHandler(async (req, res) => {
    let member = await Member.findById(req.owner.id)
        .populate("tasks")
        .select("tasks");

    if (!member) {
        res.status(404).json({ message: "Member not found" });
    }
    res.json(member.tasks);
});
