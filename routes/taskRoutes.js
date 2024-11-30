const express = require("express");
const router = express.Router();
const {
    deleteTaskById,
    assignMemberToTask,
    viewTaskById,
    updateTaskById,
    updateTaskStatus,
    updateTaskProgress,
    task_create_get,
    task_create_post,
    task_update_get,
    task_update_post,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Task Routes
router.get("/create/:projectId", protect, authorize("owner"), task_create_get);

router.post(
    "/create/:projectId",
    protect,
    authorize("owner"),
    task_create_post
);

router.get("/update/:taskId", protect, authorize("owner"), task_update_get);
router.post("/update/:taskId", protect, authorize("owner"), task_update_post);

// router.post("/:projectId", taskController.createTask); // Create Task (Owner only)
router.post("/:taskId/assign", assignMemberToTask); // Assign Member to Task
router.get("/:taskId", viewTaskById); // View Task by ID
router.patch("/:taskId", updateTaskById); // Update Task by ID (Owner only)
router.post("/delete/:taskId", deleteTaskById);
router.put("/:taskId/status", protect, authorize("member"), updateTaskStatus); // Update Task Status (Owner and assigned member)
router.put(
    "/:taskId/progress",
    protect,
    authorize("member"),
    updateTaskProgress
); // Update Task Progress (Owner and assigned member)

module.exports = router;
