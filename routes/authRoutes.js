const express = require("express");
const router = express.Router();
const {
    owner_login_get,
    owner_login_post,
    owner_signup_get,
    owner_signup_post,
    owner_logout_post,
    worker_signup_post,
    worker_login_post,
    worker_logout_post,
} = require("../controllers/authController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.get("/owner/signup", isAuthenticated, owner_signup_get);

router.post("/owner/signup", owner_signup_post);

router.get("/owner/login", isAuthenticated, owner_login_get);
router.post("/owner/login", owner_login_post);
router.post("/owner/logout", owner_logout_post);

router.post("/worker/signup", worker_signup_post);
router.post("/worker/login", worker_login_post);
router.post("/worker/logout", worker_logout_post);

module.exports = router;
