const express = require('express');
const router = express.Router();
const { protect, optionalProtect, creatorProtect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multer");
const {
  createWorkoutPlan,
  addExercisesToDay,
  editExerciseInDay,
  deleteExerciseFromDay,
  getCreatorWorkoutPlans,
  getCreatorWorkoutPlanById,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  togglePublishWorkoutPlan,
  getPublishedWorkoutPlans,
  getPublishedWorkoutPlanById,
  purchaseWorkoutPlan
} = require('../controllers/workoutPlanController');

// Creator routes
router.post('/', creatorProtect, upload.single('image'), createWorkoutPlan);
router.get('/creator', creatorProtect, getCreatorWorkoutPlans);
router.get('/creator/:id', creatorProtect, getCreatorWorkoutPlanById);
router.put('/:id', creatorProtect, upload.single('image'), updateWorkoutPlan);
router.delete('/:id', creatorProtect, deleteWorkoutPlan);
router.put('/:id/publish', creatorProtect, togglePublishWorkoutPlan);

// Exercise management routes
router.put('/:planId/day/:dayName', creatorProtect, addExercisesToDay);
router.put('/:planId/day/:dayName/:exerciseIndex', creatorProtect, editExerciseInDay);
router.delete('/:planId/day/:dayName/:exerciseIndex', creatorProtect, deleteExerciseFromDay);

// Public routes for users
router.get('/public', optionalProtect, getPublishedWorkoutPlans);
router.get('/public/:id', optionalProtect, getPublishedWorkoutPlanById);
router.post('/:id/purchase', protect, purchaseWorkoutPlan);

module.exports = router;