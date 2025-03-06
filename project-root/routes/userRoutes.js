const express = require("express");
const { register, loginUser, getUserProfile } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");


const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;
