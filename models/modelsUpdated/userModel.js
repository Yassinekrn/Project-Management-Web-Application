const mongoose = require("mongoose");

const { Schema } = mongoose;

const options = { discriminatorKey: "role", collection: "users" };

const baseUserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        projects: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    options
);

const User = mongoose.model("User", baseUserSchema);

const Owner = User.discriminator("owner", new Schema({}));
const Member = User.discriminator("member", new Schema({}));

module.exports = { User, Owner, Member };
