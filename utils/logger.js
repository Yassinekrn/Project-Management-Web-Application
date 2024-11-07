const { createLogger, format, transports } = require("winston");

const logger = createLogger({
    level: "info", // Set default log level
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }), // Include stack trace if available
        format.json() // Log in JSON format for better readability
    ),
    defaultMeta: { service: "user-service" }, // Add default metadata (e.g., service name)
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(), // Colorize console logs
                format.simple() // Simple log format in development
            ),
        }),
        new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to a file
        new transports.File({ filename: "logs/combined.log" }), // Log all levels to this file
    ],
});

// // If not in production, also log to the console with more verbose settings
// if (process.env.NODE_ENV !== "production") {
//     logger.add(
//         new transports.Console({
//             format: format.combine(format.colorize(), format.simple()),
//         })
//     );
// }

module.exports = logger;
