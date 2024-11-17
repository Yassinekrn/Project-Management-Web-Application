const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Project Routes (restricted to specific roles for certain actions)
router.get(
    "/",
    protect,
    authorize("owner"),
    projectController.project_create_get
);
router.post(
    "/",
    protect,
    authorize("owner"),
    projectController.project_create_post
);

router.get("/:projectId", projectController.viewProjectById); // View Project by ID
router.patch("/:projectId", projectController.updateProjectById); // Update Project by ID (Owner only)
router.delete("/:projectId", projectController.deleteProjectById); // Delete Project by ID (Owner only)
router.post("/:projectId/members", projectController.addMemberToProject); // Add Member to Project
router.delete(
    "/:projectId/members/:memberId",
    projectController.removeMemberFromProject
); // Remove Member from Project
router.get("/:projectId/members", projectController.getAllProjectMembers); // Get All Project Members
router.get("/:projectId/tasks", projectController.getAllProjectTasks); // Get All Project Tasks

module.exports = router;
