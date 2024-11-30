const express = require("express");
const router = express.Router();
const {
    owner_dashboard_get,
    owner_details_get,
    owner_update_get,
    owner_update_post,
    owner_delete_post,
} = require("../controllers/ownerController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/dashboard", protect, authorize("owner"), owner_dashboard_get); // Get Owner Dashboard
router.get("/me", protect, authorize("owner"), owner_details_get); // Get Owner Info
router.get("/me/update", protect, authorize("owner"), owner_update_get); // Update Owner Info
router.post("/me/update", protect, authorize("owner"), owner_update_post); // Update Owner Info
router.post("/me/delete", protect, authorize("owner"), owner_delete_post); // Delete Owner Account

module.exports = router;
