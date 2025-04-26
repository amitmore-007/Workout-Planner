const express = require("express");
const router = express.Router();
const { createWorkoutPlan,
    addExercisesToDay,
    editExerciseInDay,
    deleteExerciseFromDay,
 } = require("../controllers/workoutPlanController.js");
const upload = require("../middlewares/multer"); // if using multer for image

// Route: POST /api/workoutPlans/create
router.post("/create", upload.single("image"), createWorkoutPlan);
router.put("/:planId/day/:dayName", addExercisesToDay);

// Edit an exercise in a day
router.put("/:planId/day/:dayName/:exerciseIndex", editExerciseInDay);

// Delete an exercise in a day
router.delete("/:planId/day/:dayName/:exerciseIndex", deleteExerciseFromDay);


module.exports = router;
