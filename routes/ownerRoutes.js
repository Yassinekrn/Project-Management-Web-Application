const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Owner Routes (only owners can access these routes)
router.get(
    "/dashboard",
    protect,
    authorize("owner"),
    ownerController.owner_dashboard_get
); // Get Owner Dashboard
router.get(
    "/me",
    protect,
    authorize("owner"),
    ownerController.owner_details_get
); // Get Owner Info

router.get(
    "/me/update",
    protect,
    authorize("owner"),
    ownerController.owner_update_get
); // Update Owner Info

router.post(
    "/me/update",
    protect,
    authorize("owner"),
    ownerController.owner_update_post
); // Update Owner Info
router.delete("/me", ownerController.deleteOwner); // Delete Owner Account
router.get("/me/projects", ownerController.getAllOwnerProjects); // Get All Owner's Projects
router.post("/me/projects", ownerController.createProject); // Create Project

module.exports = router;
