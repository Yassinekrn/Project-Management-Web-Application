const mongoose = require("mongoose");
const { User } = require("./userModel");

const ownerSchema = {
    organizationName: {
        type: String,
        trim: true,
    },
    preferredContactMethod: {
        type: String,
    },
};

const Owner = User.discriminator(
    "owner",
    new mongoose.Schema(ownerSchema),
    "owners"
);

module.exports = Owner;
