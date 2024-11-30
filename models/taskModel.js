const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Directly reference Worker model
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed", "Blocked"],
        default: "To Do",
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    estimatedHours: {
        type: Number,
        min: 0,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Directly reference Owner model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

module.exports = mongoose.model("Task", taskSchema);
