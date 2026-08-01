const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

    title:String,

    description:String,

    image:String,

    category:String

});


module.exports = mongoose.model("Movie", movieSchema);