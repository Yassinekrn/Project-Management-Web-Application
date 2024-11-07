const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");

// Owner Routes (only owners can access these routes)
router.get("/me", ownerController.getOwnerInfo); // Get Owner Info
router.patch("/me", ownerController.updateOwnerInfo); // Update Owner Info
router.delete("/me", ownerController.deleteOwner); // Delete Owner Account
router.get("/me/projects", ownerController.getAllOwnerProjects); // Get All Owner's Projects
router.post("/me/projects", ownerController.createProject); // Create Project

module.exports = router;
