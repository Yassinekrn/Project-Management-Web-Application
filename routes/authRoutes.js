const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get(
    "/owner/signup",
    authMiddleware.isAuthenticated,
    authController.getSignupOwner
);

router.post("/owner/signup", authController.postSignupOwner);

router.get(
    "/owner/login",
    authMiddleware.isAuthenticated,
    authController.getLoginOwner
); // Login
router.post("/owner/login", authController.postLoginOwner);
router.post("/owner/logout", authController.postLogoutOwner);

router.post("/member/signup", authController.signupMember);
router.post("/member/login", authController.loginMember);
router.post("/member/logout", authController.logoutMember);

module.exports = router;
