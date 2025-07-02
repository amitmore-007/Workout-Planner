const express = require('express');
const router = express.Router();
const { protect, creatorProtect } = require('../middlewares/authMiddleware');
const {
  setupCreatorAvailability,
  getCreatorAvailability,
  getAvailableCreators,
  requestVideoSession,
  getCreatorRequests,
  getCreatorSessions,
  getUserSessions,
  updateSessionStatus,
  joinSession
} = require('../controllers/videoSessionController');

// Creator routes
router.post('/creator/availability', creatorProtect, setupCreatorAvailability);
router.get('/creator/availability', creatorProtect, getCreatorAvailability);
router.get('/creator/requests', creatorProtect, getCreatorRequests);
router.get('/creator/sessions', creatorProtect, getCreatorSessions);
router.put('/creator/session/:sessionId', creatorProtect, updateSessionStatus);

// User routes
router.get('/available-creators', protect, getAvailableCreators);
router.post('/request', protect, requestVideoSession);
router.get('/user/sessions', protect, getUserSessions);

// Both creator and user
router.get('/join/:sessionId', protect, joinSession);

module.exports = router;
