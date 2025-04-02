const Workout = require("../models/workoutModel");
const User = require("../models/userModel");

exports.getUserWorkouts = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from auth middleware
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const goal = user.goal.toLowerCase(); // Get user's goal
        const workouts = await Workout.find({ goal: goal }).limit(8); // Fetch 6-8 workouts

        if (workouts.length === 0) {
            return res.status(400).json({ message: "Not enough workouts available" });
        }

        res.json({ success: true, workouts });
    } catch (error) {
        console.error("Error fetching workouts:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// const Workout = require('../models/workoutModel');

// const User = require('../models/userModel'); // Import User model

// const goalMapping = {
//     "weight loss": "weight Loss",
//     "weight gain": "weight Gain",
//     "maintenance": "Balanced"  // Map "maintenance" to "Balanced"
// };

// const getTodaysWorkouts = async (req, res) => {
//   try {
//       const userId = req.user.id; // Ensure req.user exists

//       // Fetch user's goal
//       const user = await User.findById(userId);
//       if (!user || !user.goal) {
//           return res.status(400).json({ message: "User goal not found" });
//       }

//       // Normalize goal for query
//       const goal = goalMapping[user.goal.toLowerCase()];
//       if (!goal) {
//           return res.status(400).json({ message: "Invalid goal mapping" });
//       }

//       // Get today's weekday (0 = Sunday, 6 = Saturday)
//       const today = new Date().getDay();
//       if (today === 0) {
//           return res.json({ message: "Rest day today! No workouts scheduled." });
//       }

//       // Fetch workouts matching the user's goal (fix: use correct field name)
//       const workouts = await Workout.find({ Goal: { $regex: new RegExp(goal, "i") } });

//       if (!workouts || workouts.length < 8) {
//           return res.status(400).json({ message: "Not enough workouts available" });
//       }

//       // Shuffle workouts and pick 7-8
//       const shuffled = workouts.sort(() => 0.5 - Math.random());
//       const todaysWorkouts = shuffled.slice(0, 8);

//       res.json(todaysWorkouts);
//   } catch (error) {
//       console.error("Error fetching workouts:", error);
//       res.status(500).json({ message: "Error fetching today's workouts" });
//   }
// };

  

// // @desc    Get a single workout by ID
// // @route   GET /api/workouts/:id
// // @access  Public
// const getWorkoutById = async (req, res) => {
//   try {
//     const workout = await Workout.findById(req.params.id);
//     if (!workout) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }
//     res.json(workout);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching workout' });
//   }
// };

// const refreshSingleWorkout = async (req, res) => {
//     try {
//       const { goal, excludeWorkoutId } = req.query;
  
//       // Find workouts of the same goal, excluding the current one
//       const workouts = await Workout.find({ goal, _id: { $ne: excludeWorkoutId } });
  
//       if (workouts.length === 0) {
//         return res.status(404).json({ message: "No alternative workouts found" });
//       }
  
//       // Pick a random workout from the remaining
//       const newWorkout = workouts[Math.floor(Math.random() * workouts.length)];
  
//       res.json(newWorkout);
//     } catch (error) {
//       res.status(500).json({ message: "Error refreshing workout" });
//     }
//   };

//   const refreshWorkoutSet = async (req, res) => {
//     try {
//       const { goal } = req.query;
  
//       // Get a new set of 7-8 workouts
//       const workouts = await Workout.find({ goal });
  
//       if (workouts.length < 8) {
//         return res.status(400).json({ message: "Not enough workouts available" });
//       }
  
//       // Shuffle and pick a new set
//       const shuffled = workouts.sort(() => 0.5 - Math.random());
//       const newWorkoutSet = shuffled.slice(0, 8);
  
//       res.json(newWorkoutSet);
//     } catch (error) {
//       res.status(500).json({ message: "Error refreshing workout set" });
//     }
//   };
  
  

// // @desc    Create a new workout (Admin only)
// // @route   POST /api/workouts
// // @access  Private (Admin)
// const createWorkout = async (req, res) => {
//   try {
//     const { goal, difficulty, title, category, primaryMuscles, secondaryMuscles, equipment, instructions } = req.body;

//     const workout = new Workout({
//       goal,
//       difficulty,
//       title,
//       category,
//       primaryMuscles,
//       secondaryMuscles,
//       equipment,
//       instructions,
//     });

//     const createdWorkout = await workout.save();
//     res.status(201).json(createdWorkout);
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating workout' });
//   }
// };

// // @desc    Update a workout (Admin only)
// // @route   PUT /api/workouts/:id
// // @access  Private (Admin)
// const updateWorkout = async (req, res) => {
//   try {
//     const workout = await Workout.findById(req.params.id);

//     if (!workout) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }

//     Object.assign(workout, req.body);
//     const updatedWorkout = await workout.save();

//     res.json(updatedWorkout);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating workout' });
//   }
// };

// // @desc    Delete a workout (Admin only)
// // @route   DELETE /api/workouts/:id
// // @access  Private (Admin)
// const deleteWorkout = async (req, res) => {
//   try {
//     const workout = await Workout.findById(req.params.id);

//     if (!workout) {
//       return res.status(404).json({ message: 'Workout not found' });
//     }

//     await workout.deleteOne();
//     res.json({ message: 'Workout deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting workout' });
//   }
// };

// module.exports = {
//   getTodaysWorkouts,
//   getWorkoutById,
//   createWorkout,
//   updateWorkout,
//   deleteWorkout,
//   refreshWorkoutSet,
//   refreshSingleWorkout

// };


