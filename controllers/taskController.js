const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const Member = require("../models/memberModel");

exports.task_update_get = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.taskId).populate("assignedTo");
    res.render("task_update", {
        title: "Update Task",
        owner: req.owner,
        task,
    });
});

exports.task_update_post = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
        return res.status(404).send("Task not found");
    }

    const assignedTo = req.body.assignedTo
        ? await Member.findOne({ email: req.body.assignedTo })
        : null;
    if (req.body.assignedTo && !assignedTo) {
        return res.status(404).send("No member found with the provided email");
    }

    if (assignedTo) {
        let project = await Project.findById(task.project).populate({
            path: "teams",
            populate: {
                path: "members",
            },
        });
        let memberFound = false;
        project.teams.forEach((team) => {
            team.members.forEach((member) => {
                if (member.email === req.body.assignedTo) {
                    memberFound = true;
                }
            });
        });
        if (!memberFound) {
            return res.status(404).send("Member not found in the project");
        }
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.progress = req.body.progress || task.progress;
    task.assignedTo = assignedTo ? assignedTo._id : null;

    await task.save();

    res.status(200).redirect("/projects/" + task.project);
});

exports.task_create_get = asyncHandler(async (req, res) => {
    res.render("task_form", {
        title: "Create Task",
        owner: req.owner,
        projectId: req.params.projectId,
    });
});

exports.task_create_post = asyncHandler(async (req, res) => {
    // find assignedTo id by email
    const assignedTo = await Member.findOne({ email: req.body.assignedTo });
    if (!assignedTo) {
        return res.status(404).send("No member found with the provided email");
    }
    // check if the member is in one of the teams of the project
    let project = await Project.findById(req.params.projectId).populate({
        path: "teams",
        populate: {
            path: "members",
        },
    });
    let memberFound = false;
    project.teams.forEach((team) => {
        team.members.forEach((member) => {
            if (member.email === req.body.assignedTo) {
                memberFound = true;
            }
        });
    });
    if (!memberFound) {
        return res.status(404).send("Member not found in the project");
    }
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        createdBy: req.owner.id,
        progress: req.body.progress,
        assignedTo: assignedTo._id,
        project: req.params.projectId,
    });

    await task.save();

    // const project = await Project.findById(req.params.projectId);
    project.tasks.push(task._id);
    await project.save();

    assignedTo.tasks.push(task._id);
    await assignedTo.save();

    res.status(201).redirect("/projects/" + req.params.projectId);
});

exports.assignMemberToTask = asyncHandler(async (req, res) => {
    res.json({ message: "assignMemberToTask" });
});

exports.viewTaskById = asyncHandler(async (req, res) => {
    res.json({ message: "viewTaskById" });
});

exports.updateTaskById = asyncHandler(async (req, res) => {
    res.json({ message: "updateTaskById" });
});

exports.deleteTaskById = asyncHandler(async (req, res) => {
    let taskId = req.params.taskId;
    let taskToDelete = await Task.findById(taskId);
    if (!taskToDelete) {
        return res.status(404).send("Task not found");
    }
    let projectId = taskToDelete.project;
    await Task.findByIdAndDelete(taskId);
    res.redirect("/projects/" + projectId);
});

exports.updateTaskStatus = asyncHandler(async (req, res) => {
    let taskId = req.params.taskId;
    let task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).send("Task not found");
    }
    if (task.assignedTo.toString() !== req.owner.id) {
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
    res.status(200).send("Task status updated");
});

exports.updateTaskProgress = asyncHandler(async (req, res) => {
    let taskId = req.params.taskId;
    let task = await Task.findById(taskId);
    if (!task) {
        return res.status(404).send("Task not found");
    }
    if (task.assignedTo.toString() !== req.owner.id) {
        return res.status(401).send("Unauthorized");
    }
    if (req.body.progress < 0 || req.body.progress > 100) {
        return res.status(400).send("Invalid progress");
    }
    task.progress = req.body.progress || task.progress;
    await task.save();
    res.status(200).send("Task progress updated");
});
