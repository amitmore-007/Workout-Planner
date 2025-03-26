const express = require("express");
const { getDietPlan } = require("../controllers/dietController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/diet-plan", protect, getDietPlan); // ✅ Secure Route

module.exports = router;
