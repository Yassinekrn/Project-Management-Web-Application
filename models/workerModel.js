const mongoose = require("mongoose");
const { User } = require("./userModel");

const workerSchema = {
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task",
        },
    ],
    expertise: [
        {
            type: String,
            required: true,
        },
    ],
    portfolio: {
        type: String,
        required: true,
    },
};

const Worker = User.discriminator(
    "worker",
    new mongoose.Schema(workerSchema),
    "workers"
);

module.exports = Worker;
