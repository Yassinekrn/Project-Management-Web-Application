const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");

exports.createTask = asyncHandler(async (req, res) => {
    res.json({ message: "createTask" });
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
    res.json({ message: "deleteTaskById" });
});

exports.updateTaskStatus = asyncHandler(async (req, res) => {
    res.json({ message: "updateTaskStatus" });
});

exports.updateTaskProgress = asyncHandler(async (req, res) => {
    res.json({ message: "updateTaskProgress" });
});
