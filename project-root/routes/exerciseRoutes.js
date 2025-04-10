const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getWorkoutPlan } = require("../controllers/exerciseController");

const router = express.Router();

router.get("/workout-plan", protect, getWorkoutPlan);

module.exports = router;
