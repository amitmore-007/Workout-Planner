const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { getWorkoutPlan, getWorkoutByBodyPart } = require("../controllers/exerciseController");

const router = express.Router();

router.get("/workout-plan", protect, getWorkoutPlan);
router.get("/:bodyPart", getWorkoutByBodyPart);

module.exports = router;
