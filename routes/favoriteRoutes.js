const express = require("express");
const router = express.Router();

const Favorite = require("../models/Favorite");

// ==============================
// Add Movie to Favorites
// ==============================

router.post("/", async (req, res) => {

    try {

        const favorite = await Favorite.create(req.body);

        res.status(201).json({
            message: "Movie added to My List",
            favorite
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// ==============================
// Get User Favorites
// ==============================

router.get("/:userId", async (req, res) => {

    try {

        const favorites = await Favorite.find({
            userId: req.params.userId
        }).populate("movieId");

        res.json(favorites);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// ==============================
// Remove Favorite
// ==============================

router.delete("/:id", async (req, res) => {

    try {

        await Favorite.findByIdAndDelete(req.params.id);

        res.json({
            message: "Removed from My List"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;