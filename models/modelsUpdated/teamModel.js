const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member",
        },
    ],
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

teamSchema.virtual("url").get(function () {
    return "/team/" + this._id;
});

module.exports = mongoose.model("Team", teamSchema);
