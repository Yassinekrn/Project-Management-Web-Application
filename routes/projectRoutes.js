const express = require("express");
const router = express.Router();
const {
    project_create_get,
    project_create_post,
    project_details_get,
    project_update_get,
    project_update_post,
    project_delete_post,
    remove_worker_post,
    add_worker_post,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/", protect, authorize("owner"), project_create_get);
router.post("/", protect, authorize("owner"), project_create_post);

router.get("/:projectId", protect, project_details_get);
router.get(
    "/:projectId/update",
    protect,
    authorize("owner"),
    project_update_get
);
router.post(
    "/:projectId/update",
    protect,
    authorize("owner"),
    project_update_post
);
router.post(
    "/:projectId/delete",
    protect,
    authorize("owner"),
    project_delete_post
);

router.post(
    "/:projectId/add-worker-by-email",
    protect,
    authorize("owner"),
    add_worker_post
);

router.post(
    "/:projectId/remove-worker/:workerId",
    protect,
    authorize("owner"),
    remove_worker_post
);

module.exports = router;
