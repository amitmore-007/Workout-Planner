const express = require('express');
const router = express.Router();
const { protect, creatorProtect, optionalProtect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');
const {
  createDietPlan,
  getCreatorDietPlans,
  getCreatorDietPlanById,
  updateDietPlan,
  deleteDietPlan,
  togglePublishDietPlan,
  getPublishedDietPlans,
  getPublishedDietPlanById,
  purchaseDietPlan,
  rateDietPlan,
  checkAuthStatus
} = require('../controllers/dietPlanController');

// Public routes (for users to view published plans) - now with optional authentication
router.get('/public', optionalProtect, getPublishedDietPlans);
router.get('/public/:id', optionalProtect, getPublishedDietPlanById);

// User routes (require user authentication)
router.post('/:id/purchase', protect, purchaseDietPlan); // Change back to protect instead of optionalProtect
router.post('/:id/rate', protect, rateDietPlan);
router.get('/auth-status', protect, checkAuthStatus);

// Add a route to check if user can purchase (for debugging)
router.get('/:id/can-purchase', optionalProtect, (req, res) => {
  const canPurchase = !!req.user;
  res.json({ 
    canPurchase, 
    isAuthenticated: !!req.user,
    userId: req.user ? req.user._id : null 
  });
});

// Creator routes (require creator authentication)
router.post('/', creatorProtect, upload.single('image'), createDietPlan);
router.get('/creator', creatorProtect, getCreatorDietPlans);
router.get('/creator/:id', creatorProtect, getCreatorDietPlanById);
router.put('/:id', creatorProtect, upload.single('image'), updateDietPlan);
router.delete('/:id', creatorProtect, deleteDietPlan);
router.put('/:id/publish', creatorProtect, togglePublishDietPlan);

module.exports = router;
