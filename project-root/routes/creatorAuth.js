const express = require("express");
const router = express.Router();
const { registerCreator, loginCreator } = require("../controllers/creatorAuthController");

// Register
router.post("/register", registerCreator);

// Login
router.post("/login", loginCreator);

module.exports = router;
