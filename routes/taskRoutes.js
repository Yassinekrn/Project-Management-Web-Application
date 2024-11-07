const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Task Routes
router.post("/:projectId", taskController.createTask); // Create Task (Owner only)
router.post("/:taskId/assign", taskController.assignMemberToTask); // Assign Member to Task
router.get("/:taskId", taskController.viewTaskById); // View Task by ID
router.patch("/:taskId", taskController.updateTaskById); // Update Task by ID (Owner only)
router.delete("/:taskId", taskController.deleteTaskById); // Delete Task by ID (Owner only)
router.patch("/:taskId/status", taskController.updateTaskStatus); // Update Task Status (Owner and assigned member)
router.patch("/:taskId/progress", taskController.updateTaskProgress); // Update Task Progress (Owner and assigned member)

module.exports = router;
