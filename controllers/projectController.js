const Project = require("../models/projectModel");
const Owner = require("../models/ownerModel");
const Worker = require("../models/workerModel");
const asyncHandler = require("express-async-handler");

// DONE: updated
exports.project_create_get = asyncHandler(async (req, res) => {
    res.render("project_form", { title: "Create Project", owner: req.user });
});

// DONE: updated
exports.project_create_post = asyncHandler(async (req, res) => {
    let { name, description } = req.body;
    let project = new Project({ name, description, owner: req.user.id });
    await project.save();
    let owner = await Owner.findById(req.user.id);
    if (!owner) {
        res.render("project_form", {
            error: "Owner not found. Please make sure you are logged in with the correct account.",
        });
    }
    owner.projects.push(project._id);
    await owner.save();
    res.redirect("/owners/dashboard");
});

// DONE: updated
exports.project_details_get = asyncHandler(async (req, res) => {
    // get project by id and populate owner, teams and tasks
    let project = await Project.findById(req.params.projectId)
        .populate({ path: "owner", select: "name email" })
        .populate({
            path: "tasks",
            select: "title status assignedTo",
            populate: { path: "assignedTo", select: "name" },
        });

    let workers = await Worker.find({ projects: req.params.projectId }).select(
        "name email"
    );

    res.render("project_details", { project, owner: req.user, workers });
});

//TODO: implement all the functions below
// Update Project by ID
exports.project_update_get = asyncHandler(async (req, res) => {
    res.json({ message: "updateProjectById GET" });
});

exports.project_update_post = asyncHandler(async (req, res) => {
    res.json({ message: "updateProjectById POST" });
});

// Delete Project by ID
exports.project_delete_post = asyncHandler(async (req, res) => {
    res.json({ message: "deleteProjectById" });
});

exports.remove_worker_post = asyncHandler(async (req, res) => {
    res.json({ message: "removeWorker" });
});

exports.add_worker_post = asyncHandler(async (req, res) => {
    res.json({ message: "addWorker" });
});
