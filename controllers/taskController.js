const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const Worker = require("../models/workerModel");

// DONE: updated
exports.task_update_get = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.taskId).populate("assignedTo");
    const workers = await Worker.find({ projects: task.project }).select(
        "name email"
    );
    return res.render("task_update", {
        title: "Update Task",
        owner: req.user,
        task,
        workers,
    });
});

// DONE: updated
exports.task_update_post = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
        return res.render("task_update", {
            error: "Task not found",
        });
    }

    const assignedTo = req.body.assignedTo
        ? await Worker.findOne({ email: req.body.assignedTo })
        : null;
    if (req.body.assignedTo && !assignedTo) {
        return res.render("task_update", {
            error: "No member found with the provided email",
        });
    }
    if (req.body.assignedTo && !assignedTo.projects.includes(task.project)) {
        return res.render("task_update", {
            error: "Member not found in the project",
        });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.progress = req.body.progress || task.progress;
    if (
        task.assignedTo &&
        assignedTo &&
        task.assignedTo.toString() !== assignedTo._id.toString()
    ) {
        const oldWorker = await Worker.findById(task.assignedTo);
        if (oldWorker) {
            oldWorker.tasks = oldWorker.tasks.filter(
                (taskId) => taskId.toString() !== task._id.toString()
            );
            await oldWorker.save();
        }
        assignedTo.tasks.push(task._id);
        await assignedTo.save();
    }
    task.assignedTo = assignedTo ? assignedTo._id : null;

    await task.save();

    return res.status(200).redirect("/projects/" + task.project);
});

// DONE: updated
exports.task_create_get = asyncHandler(async (req, res) => {
    let workers = await Worker.find({ projects: req.params.projectId }).select(
        "name email"
    );
    return res.render("task_form", {
        title: "Create Task",
        owner: req.user,
        projectId: req.params.projectId,
        workers,
    });
});

// DONE: updated
exports.task_create_post = asyncHandler(async (req, res) => {
    // find assignedTo id by email
    const assignedTo = await Worker.findOne({ email: req.body.assignedTo });
    if (!assignedTo) {
        return res.render("task_form", {
            error: "No member found with the provided email",
        });
    }
    const project = await Project.findById(req.params.projectId);
    if (!project) {
        return res.render("task_form", {
            error: "Project not found",
        });
    }
    if (!assignedTo.projects.includes(req.params.projectId)) {
        return res.render("task_form", {
            error: "Member not found in the project",
        });
    }

    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        createdBy: req.user.id,
        progress: req.body.progress,
        assignedTo: assignedTo._id,
        project: req.params.projectId,
    });

    await task.save();

    project.tasks.push(task._id);
    await project.save();

    assignedTo.tasks.push(task._id);
    await assignedTo.save();

    return res.status(201).redirect("/projects/" + req.params.projectId);
});

// DONE: updated
exports.deleteTaskById = asyncHandler(async (req, res) => {
    let taskId = req.params.taskId;
    let taskToDelete = await Task.findById(taskId);
    if (!taskToDelete) {
        return res.status(404).send("Task not found");
    }
    let projectId = taskToDelete.project;

    // remove task from project
    let project = await Project.findById(projectId);
    project.tasks = project.tasks.filter((task) => task.toString() !== taskId);
    await project.save();
    // remove task from worker
    let worker = await Worker.findById(taskToDelete.assignedTo);
    worker.tasks = worker.tasks.filter((task) => task.toString() !== taskId);
    await worker.save();
    await Task.findByIdAndDelete(taskId);
    return res.redirect("/projects/" + projectId);
});

exports.updateTaskStatus = asyncHandler(async (req, res) => {
    let taskId = req.params.taskId;
    let task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).send("Task not found");
    }
    if (task.assignedTo.toString() !== req.user.id) {
        return res.status(401).send("Unauthorized");
    }
    if (
        !["To Do", "In Progress", "Completed", "Blocked"].includes(
            req.body.status
        )
    ) {
        return res.status(400).send("Invalid status");
    }

    task.status = req.body.status || task.status;
    await task.save();
    return res.status(200).send("Task status updated");
});

exports.updateTaskProgress = asyncHandler(async (req, res) => {
    let taskId = req.params.taskId;
    let task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).send("Task not found");
    }
    if (task.assignedTo.toString() !== req.user.id) {
        return res.status(401).send("Unauthorized");
    }
    if (req.body.progress < 0 || req.body.progress > 100) {
        return res.status(400).send("Invalid progress");
    }
    task.progress = req.body.progress || task.progress;
    await task.save();
    return res.status(200).send("Task progress updated");
});
