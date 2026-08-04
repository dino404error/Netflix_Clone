const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    trailer: {
        type: String,
        default: ""
    },

    video: {
        type: String,
        default: ""
    },

    year: {
        type: Number,
        default: 2025
    },

    duration: {
        type: String,
        default: ""
    },

    rating: {
        type: String,
        default: "PG-13"
    }

});

module.exports = mongoose.model("Movie", movieSchema);