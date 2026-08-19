const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = express();

// ==============================
// Connect MongoDB
// ==============================

connectDB();

// ==============================
// Middlewares
// ==============================

app.use(cors());
app.use(express.json());

// ==============================
// Routes
// ==============================

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/movies", require("./routes/movieRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/continue", require("./routes/continueRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
// ==============================
// Default Route
// ==============================

app.get("/", (req, res) => {
    res.send("Netflix Clone Backend Running 🚀");
});

// ==============================
// Start Server
// ==============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
