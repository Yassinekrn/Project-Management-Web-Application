const Project = require("../models/projectModel");
const Owner = require("../models/ownerModel");
const Worker = require("../models/workerModel");
const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");

// DONE: updated
exports.project_create_get = asyncHandler(async (req, res) => {
    return res.render("project_form", {
        title: "Create Project",
        owner: req.user,
    });
});

// DONE: updated
exports.project_create_post = asyncHandler(async (req, res) => {
    let { name, description } = req.body;
    let project = new Project({ name, description, owner: req.user.id });
    await project.save();
    let owner = await Owner.findById(req.user.id);
    if (!owner) {
        return res.render("project_form", {
            error: "Owner not found. Please make sure you are logged in with the correct account.",
            title: "Create Project",
            owner: req.user,
        });
    }
    owner.projects.push(project._id);
    await owner.save();
    return res.redirect("/owners/dashboard");
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
    if (!project) {
        return res.render("project_details", {
            error: "Project not found. Please make sure you are logged in with the correct account.",
            title: "Project Details",
            owner: req.user,
            project: {
                name: "Project",
            },
        });
    }
    console.log(project);
    console.log(workers);

    return res.render("project_details", { project, owner: req.user, workers });
});

// DONE: updated
exports.project_update_get = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.projectId);
    console.log(project);
    if (!project || project.owner.toString() !== req.user.id) {
        return res.render("project_update", {
            error: "Project not found. Please make sure you are logged in with the correct account.",
            owner: req.user,
            project: project === null ? { name: "Project" } : project,
        });
    }
    return res.render("project_update", {
        project,
        owner: req.user,
    });
});

// DONE: updated
exports.project_update_post = asyncHandler(async (req, res) => {
    let { name, description } = req.body;
    let project = await Project.findById(req.params.projectId);
    if (!project || project.owner.toString() !== req.user.id) {
        return res.render("project_update", {
            error: "Project not found. Please make sure you are logged in with the correct account.",
            owner: req.user,
            project: project === null ? { name: "Project" } : project,
        });
    }
    project.name = name !== "" ? name : project.name;
    project.description =
        description !== "" ? description : project.description;

    await project.save();
    return res.redirect(`/projects/${req.params.projectId}`);
});

// DONE: updated
exports.project_delete_post = asyncHandler(async (req, res) => {
    let project = await Project.findById(req.params.projectId);
    if (!project || project.owner.toString() !== req.user.id) {
        return res.render("project_details", {
            error: "Project not found. Please make sure you are logged in with the correct account.",
            title: "Project Details",
            owner: req.user,
            project: {
                name: "Project",
            },
        });
    }
    // Remove project from owner and workers
    let owner = await Owner.findById(req.user.id);
    owner.projects = owner.projects.filter(
        (project) => project.toString() !== req.params.projectId
    );
    await owner.save();
    let workers = await Worker.find({ projects: req.params.projectId });
    workers.forEach(async (worker) => {
        worker.projects = worker.projects.filter(
            (project) => project.toString() !== req.params.projectId
        );
        // delete all worker tasks associated with the project
        worker.tasks = worker.tasks.filter(
            (task) =>
                task.project && task.project.toString() !== req.params.projectId
        );
        await worker.save();
    });
    // Delete all tasks associated with the project
    await Task.deleteMany({ project: req.params.projectId });

    await Project.findByIdAndDelete(req.params.projectId);
    return res.redirect("/owners/dashboard");
});

// DONE: updated
exports.remove_worker_post = asyncHandler(async (req, res) => {
    let worker = await Worker.findById(req.params.workerId);
    let project = await Project.findById(req.params.projectId);

    // Validate worker, project, and ownership
    if (!worker || !project || project.owner.toString() !== req.user.id) {
        return res.render("project_details", {
            error: "Worker or Project not found. Please make sure you are logged in with the correct account.",
            title: "Project Details",
            owner: req.user,
            project: {
                name: "Project",
            },
        });
    }

    // Remove project reference from worker
    worker.projects = worker.projects.filter(
        (projectId) => projectId.toString() !== req.params.projectId
    );

    // Find and unassign tasks associated with the project
    let tasks = await Task.find({
        _id: { $in: worker.tasks }, // Retrieve all tasks assigned to this worker
        project: req.params.projectId, // Filter by project
    });

    // Unassign each task and save
    for (let task of tasks) {
        task.assignedTo = null;
        await task.save();
    }

    // Remove task references from the worker
    worker.tasks = worker.tasks.filter(
        (taskId) =>
            !tasks.some((task) => task._id.toString() === taskId.toString())
    );

    await worker.save();

    return res.redirect(`/projects/${req.params.projectId}`);
});

// DONE: updated
exports.add_worker_post = asyncHandler(async (req, res) => {
    // Fetch worker and project
    const worker = await Worker.findOne({ email: req.body.workerEmail });
    const project = await Project.findById(req.params.projectId);

    // Check for invalid worker or project
    if (!worker || !project || project.owner.toString() !== req.user.id) {
        console.log("Worker or Project not found");
        return res.render("project_details", {
            error: "Worker or Project not found. Please make sure you are logged in with the correct account.",
            title: "Project Details",
            owner: req.user,
            project: {
                name: "Project",
            },
        });
    }

    // Check if worker is already in the project
    if (worker.projects.includes(req.params.projectId)) {
        return res.render("project_details", {
            error: "Worker is already in the project.",
            title: "Project Details",
            owner: req.user,
            project: {
                name: "Project",
            },
        });
    }

    // Add project to worker's projects and save
    worker.projects.push(req.params.projectId);
    await worker.save();

    // Redirect to the project details page
    return res.redirect(`/projects/${req.params.projectId}`);
});
