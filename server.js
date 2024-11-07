const app = require("./app"); // Import the app
const logger = require("./utils/logger");
const connectDB = require("./config/db");
const dotenv = require("dotenv");

const PORT = process.env.PORT || 5000;

dotenv.config();
if (process.env.NODE_ENV !== "test") {
    connectDB(); // Connect to MongoDB only if not running tests
}

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Global error handlers for uncaught exceptions and unhandled promise rejections
process.on("unhandledRejection", (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`, err);
    process.exit(1); // Exit on unhandled promise rejection
});

process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`, err);
    process.exit(1); // Exit on uncaught exception
});
