const Project = require("../models/projectModel");
const Owner = require("../models/ownerModel");
const asyncHandler = require("express-async-handler");

exports.project_create_get = asyncHandler(async (req, res) => {
    res.render("project_form", { title: "Create Project", owner: req.owner });
});

exports.project_create_post = asyncHandler(async (req, res) => {
    let { name, description } = req.body;
    let project = new Project({ name, description, owner: req.owner.id });
    await project.save();
    let owner = await Owner.findById(req.owner.id);
    if (!owner) {
        res.status(404);
        throw new Error("Owner not found");
    }
    owner.projects.push(project._id);
    await owner.save();
    res.redirect("owners/dashboard");
});

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
