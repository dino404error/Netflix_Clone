const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// GET All Movies
router.get("/", async (req, res) => {
    const movies = await Movie.find();
    res.json(movies);
});

// GET Single Movie
router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.json(movie);
});

// ADD Movie
router.post("/", async (req, res) => {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
});

// UPDATE Movie
router.put("/:id", async (req, res) => {

    try {

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(movie);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// DELETE Movie
router.delete("/:id", async (req, res) => {

    try {

        await Movie.findByIdAndDelete(req.params.id);

        res.json({
            message: "Movie Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;