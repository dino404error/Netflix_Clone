
const mongoose = require("mongoose");

const continueWatchingSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },

    currentTime: {
        type: Number,
        default: 0
    },

    duration: {
        type: Number,
        default: 0
    },

    progress: {
        type: Number,
        default: 0
    },

    lastWatched: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
});

module.exports = mongoose.model(
    "ContinueWatching",
    continueWatchingSchema
);