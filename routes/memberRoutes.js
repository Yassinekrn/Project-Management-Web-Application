const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

// Member Routes (only members can access these routes)
router.get("/me", memberController.getMemberInfo); // Get Member Info
router.patch("/me", memberController.updateMemberInfo); // Update Member Info
router.delete("/me", memberController.deleteMember); // Delete Member Account
router.get("/me/projects", memberController.viewPersonalProjects); // View Personal Projects
router.get("/me/tasks", memberController.viewPersonalTasks); // View Personal Tasks

module.exports = router;
