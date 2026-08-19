const express = require("express");
const router = express.Router();

const ContinueWatching = require("../models/ContinueWatching");

// ======================================
// Save / Update Continue Watching
// ======================================

router.post("/", async (req, res) => {

    try {

        const { userId, movieId, currentTime, duration } = req.body;

        let movie = await ContinueWatching.findOne({
            userId,
            movieId
        });

        const progress = duration > 0
            ? Math.round((currentTime / duration) * 100)
            : 0;

        if (movie) {

            movie.currentTime = currentTime;
            movie.duration = duration;
            movie.progress = progress;
            movie.lastWatched = new Date();

            await movie.save();

            return res.json({
                message: "Progress Updated",
                movie
            });

        }

        movie = await ContinueWatching.create({

            userId,
            movieId,
            currentTime,
            duration,
            progress,
            lastWatched: new Date()

        });

        res.status(201).json({

            message: "Continue Watching Created",
            movie

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// ======================================
// Get User Continue Watching
// ======================================

router.get("/:userId", async (req, res) => {

    try {

        const movies = await ContinueWatching.find({

            userId: req.params.userId

        })
        .populate("movieId")
        .sort({ lastWatched: -1 });

        res.json(movies);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// ======================================
// Delete Continue Watching
// ======================================

router.delete("/:id", async (req, res) => {

    try {

        await ContinueWatching.findByIdAndDelete(req.params.id);

        res.json({

            message: "Removed Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;