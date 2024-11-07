const asyncHandler = require("express-async-handler");

exports.signup = asyncHandler(async (req, res) => {
    res.json({ message: "signup" });
});

exports.login = asyncHandler(async (req, res) => {
    res.json({ message: "login" });
});

exports.logout = asyncHandler(async (req, res) => {
    res.json({ message: "logout" });
});
