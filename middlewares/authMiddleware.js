const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

// DONE: updated
exports.protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
    }
});

// DONE: updated
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(
                `Role ${req.user.role} is not authorized to access this route`
            );
        }
        next();
    };
};

// DONE: updated
exports.isAuthenticated = asyncHandler(async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        req.isAuthenticated = false;
    } else {
        req.isAuthenticated = true;
    }
    next();
});
