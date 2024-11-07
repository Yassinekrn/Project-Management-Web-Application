const createError = require("http-errors");
const logger = require("../utils/logger");

// Middleware to handle 404 errors
const notFoundHandler = (req, res, next) => {
    const error = createError(404, "Not Found");
    logger.error(error.message); // Log the 404 error
    next(error);
};

// General error handling middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;

    // Log the error
    logger.error(
        `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );

    const errorDetails = process.env.NODE_ENV === "development" ? err : {};

    res.status(statusCode).json({
        message: err.message || "An unexpected error occurred",
        error: errorDetails, // Only show stack trace in development
    });
};

module.exports = { notFoundHandler, errorHandler };
