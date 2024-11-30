const express = require("express");
const router = express.Router();

const {
    team_create_get,
    team_create_post,
    team_add_member_post,
    team_remove_member_post,
    team_delete_post,
    team_update_get,
    team_update_post,
} = require("../controllers/teamController");
const { protect, authorize } = require("../middlewares/authMiddleware");

router.get("/create/:projectId", protect, authorize("owner"), team_create_get);
router.post(
    "/create/:projectId",
    protect,
    authorize("owner"),
    team_create_post
);

router.get("/update/:teamId", protect, authorize("owner"), team_update_get);
router.post("/update/:teamId", protect, authorize("owner"), team_update_post);

router.post("/add-member", team_add_member_post);
router.post("/remove-member", team_remove_member_post);

router.post("/delete/:teamId", protect, authorize("owner"), team_delete_post);

module.exports = router;
