const express = require("express");
const router = express.Router();
const {
    owner_login_get,
    owner_login_post,
    owner_signup_get,
    owner_signup_post,
    owner_logout_post,
    member_signup_post,
    member_login_post,
    member_logout_post,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/owner/signup", isAuthenticated, owner_signup_get);

router.post("/owner/signup", owner_signup_post);

router.get("/owner/login", isAuthenticated, owner_login_get);
router.post("/owner/login", owner_login_post);
router.post("/owner/logout", owner_logout_post);

router.post("/member/signup", member_signup_post);
router.post("/member/login", member_login_post);
router.post("/member/logout", member_logout_post);

module.exports = router;
