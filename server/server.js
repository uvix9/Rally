
const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const pool = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// ================= MIDDLEWARES =================

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Parse incoming JSON requests
app.use(express.json());

// ================= API ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ================= HEALTH CHECK =================

// Backend health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rally backend is running!",
  });
});

// Database health check
app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT current_database(), current_user"
    );

    res.status(200).json({
      success: true,
      message: "Database connected successfully!",
      database: result.rows[0].current_database,
      user: result.rows[0].current_user,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// ================= START SERVER =================

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Rally server running on port ${PORT}`);
});

