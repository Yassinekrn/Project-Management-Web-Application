const express = require("express");
const router = express.Router();
const {
    getMemberInfo,
    updateMemberInfo,
    deleteMember,
    viewPersonalProjects,
    viewPersonalTasks,
} = require("../controllers/memberController");

const { protect } = require("../middlewares/authMiddleware");

// Member Routes (only members can access these routes)
router.get("/me", protect, getMemberInfo); // Get Member Info
router.put("/me", protect, updateMemberInfo); // Update Member Info
router.delete("/me", protect, deleteMember); // Delete Member Account
router.get("/me/projects", protect, viewPersonalProjects); // View Personal Projects
router.get("/me/tasks", protect, viewPersonalTasks); // View Personal Tasks

module.exports = router;
