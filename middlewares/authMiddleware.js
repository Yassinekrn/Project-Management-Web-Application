const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user info to request
        req.owner = decoded;
        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, invalid token");
    }
});

// Role authorization middleware
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.owner.role)) {
            res.status(403);
            throw new Error(
                `Role ${req.owner.role} is not authorized to access this route`
            );
        }
        next();
    };
};

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        req.isAuthenticated = false;
    } else {
        req.isAuthenticated = true;
    }
    next();
});
