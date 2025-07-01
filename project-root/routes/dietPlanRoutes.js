const express = require('express');
const router = express.Router();
const { protect, creatorProtect } = require('../middlewares/authMiddleware');
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
  rateDietPlan
} = require('../controllers/dietPlanController');

// Public routes (for users to view published plans)
router.get('/public', getPublishedDietPlans);
router.get('/public/:id', getPublishedDietPlanById);

// User routes (require user authentication)
router.post('/:id/purchase', protect, purchaseDietPlan);
router.post('/:id/rate', protect, rateDietPlan);

// Creator routes (require creator authentication)
router.post('/', creatorProtect, upload.single('image'), createDietPlan);
router.get('/creator', creatorProtect, getCreatorDietPlans);
router.get('/creator/:id', creatorProtect, getCreatorDietPlanById);
router.put('/:id', creatorProtect, upload.single('image'), updateDietPlan);
router.delete('/:id', creatorProtect, deleteDietPlan);
router.put('/:id/publish', creatorProtect, togglePublishDietPlan);

module.exports = router;
