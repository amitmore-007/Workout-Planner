const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const userRoutes = require("../routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

module.exports = app;
