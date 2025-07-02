const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Creator = require('../models/creatorModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('Protect middleware - token received:', token ? 'Present' : 'Missing');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Protect middleware - decoded token:', decoded);

      // Extract user ID from token - handle different token structures
      let userId;
      if (decoded.id) {
        userId = decoded.id;
      } else if (decoded._id) {
        userId = decoded._id;
      } else if (decoded.userId) {
        userId = decoded.userId;
      } else {
        console.error("Invalid token structure:", decoded);
        return res.status(401).json({ message: "Invalid token structure" });
      }

      console.log('Protect middleware - looking for user ID:', userId);

      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        console.log('Protect middleware - user not found for ID:', userId);
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      console.log('Protect middleware - user authenticated:', req.user.name);
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log('Protect middleware - no authorization header');
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

const creatorProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('Decoded token:', decoded); // Debug log
      
      // Handle different token structures
      let creatorId;
      let role;
      
      // Check if the token has nested structure (your case)
      if (decoded.id && typeof decoded.id === 'object') {
        creatorId = decoded.id.id;
        role = decoded.id.role;
      } 
      // Check if token has direct role property
      else if (decoded.role) {
        creatorId = decoded.id;
        role = decoded.role;
      }
      // Fallback - check if it's the old structure
      else {
        creatorId = decoded.id || decoded._id;
        role = 'creator'; // Assume creator if no role specified
      }
      
      console.log('Creator ID:', creatorId, 'Role:', role); // Debug log
      
      if (role !== 'creator') {
        return res.status(403).json({ message: "Access denied. Creator role required." });
      }

      req.user = await Creator.findById(creatorId).select("-password");
      
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, creator not found" });
      }
      
      console.log('Creator found:', req.user.name); // Debug log

      next();
    } catch (error) {
      console.error("Creator auth error:", error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

// Optional protection - doesn't fail if no token
const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log('Optional protect - token received:', token ? 'Present' : 'Missing');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Optional protect - decoded token:', decoded);

      // Extract user ID from token - handle different token structures
      let userId;
      if (decoded.id) {
        userId = decoded.id;
      } else if (decoded._id) {
        userId = decoded._id;
      } else if (decoded.userId) {
        userId = decoded.userId;
      }

      if (userId) {
        req.user = await User.findById(userId).select("-password");
        console.log('Optional protect - user found:', req.user ? req.user.name : 'Not found');
      }
    } catch (error) {
      console.log('Optional protect - token verification failed:', error.message);
      // Continue without user if token is invalid
      req.user = null;
    }
  } else {
    console.log('Optional protect - no authorization header');
  }

  next();
});

module.exports = { protect, creatorProtect, optionalProtect };