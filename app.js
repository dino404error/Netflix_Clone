const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./routes/authRoutes.js"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/movies", require("./routes/movieRoutes.js"));


app.listen(5000,()=>{
    console.log("Server running on port 5000");
});