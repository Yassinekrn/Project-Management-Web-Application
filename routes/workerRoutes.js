const express = require("express");
const router = express.Router();
const {
    worker_info_get,
    worker_info_update,
    worker_account_delete,
} = require("../controllers/workerController");

const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/me", protect, worker_info_get); // Get Member Info
router.put("/me", protect, authorize("worker"), worker_info_update); // Update Member Info
router.delete("/me", protect, authorize("worker"), worker_account_delete); // Delete Member Account

module.exports = router;
