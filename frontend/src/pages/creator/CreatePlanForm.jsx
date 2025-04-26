// components/CreatePlanForm.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// Icons
import { 
  Dumbbell, CalendarCheck, Target, Medal, Clock, Tag, 
  Upload, Video, PlusCircle, Edit, Trash2, Save, ChevronRight,
  Repeat, Weight, Activity
} from "lucide-react";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const muscleGroups = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", 
  "Legs", "Glutes", "Core", "Full Body", "Cardio"
];

const equipmentOptions = [
  "None/Bodyweight", "Dumbbells", "Barbell", "Kettlebell", 
  "Resistance Bands", "Cable Machine", "Smith Machine", 
  "Pull-up Bar", "Bench", "Medicine Ball", "Other"
];

const CreatePlanForm = () => {
  const [formData, setFormData] = useState({
    planName: "",
    goal: "",
    description: "",
    difficulty: "",
    totalDuration: "7 days",
    tags: "",
    image: null,
    videoPreview: "",
  });

  const [createdPlanId, setCreatedPlanId] = useState(null);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [exercises, setExercises] = useState([]);
  const [exerciseInput, setExerciseInput] = useState({ 
    name: "", 
    sets: "", 
    reps: "", 
    link: "",
    targetMuscles: [],
    equipment: "None/Bodyweight"
  });
  
  const [formStep, setFormStep] = useState(1);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Background animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateBackground(prev => !prev);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePlan = async () => {
    setIsLoading(true);
    
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const res = await fetch("http://localhost:5000/api/workoutPlans/create", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        const plan = await res.json();
        setCreatedPlanId(plan._id);
        setFormStep(2);
        
        // Create a success celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        throw new Error("Failed to create plan");
      }
    } catch (error) {
      console.error(error);
      showNotification("Error creating plan", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMuscleGroupToggle = (muscle) => {
    setExerciseInput(prev => {
      if (prev.targetMuscles.includes(muscle)) {
        return { ...prev, targetMuscles: prev.targetMuscles.filter(m => m !== muscle) };
      } else {
        return { ...prev, targetMuscles: [...prev.targetMuscles, muscle] };
      }
    });
  };

  const handleAddExerciseLocally = () => {
    if (exerciseInput.name.trim() !== "") {
      setExercises(prev => [...prev, exerciseInput]);
      setExerciseInput({ 
        name: "", 
        sets: "", 
        reps: "", 
        link: "",
        targetMuscles: [],
        equipment: "None/Bodyweight"
      });
      showNotification("Exercise added", "success");
    }
  };

  const handleSaveExercisesForDay = async () => {
    if (!createdPlanId) return showNotification("Please create a plan first", "error");
    
    setIsLoading(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/workoutPlans/${createdPlanId}/day/${selectedDay}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises }),
      });

      if (res.ok) {
        showNotification(`Exercises saved for ${selectedDay}`, "success");
        setExercises([]);
      } else {
        throw new Error("Failed to save exercises");
      }
    } catch (error) {
      console.error(error);
      showNotification("Error saving exercises", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
    showNotification("Exercise removed", "info");
  };

  const handleEditExercise = (index, updatedExercise) => {
    setExercises(prev => prev.map((ex, i) => (i === index ? updatedExercise : ex)));
  };
  
  const showNotification = (message, type = "success") => {
    // Create floating notification element
    const notification = document.createElement("div");
    notification.className = `fixed bottom-4 right-4 p-4 rounded-lg text-white ${
      type === "success" ? "bg-green-500" : 
      type === "error" ? "bg-red-500" : 
      "bg-blue-500"
    } shadow-lg z-50 transform transition-all duration-500 ease-in-out`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateY(-20px)";
      notification.style.opacity = "1";
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = "translateY(30px)";
      notification.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: animateBackground ? 0.2 : 0.1 }}
          transition={{ duration: 4 }}
        >
          <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-purple-600 blur-3xl" />
          <div className="absolute bottom-40 left-20 w-80 h-80 rounded-full bg-blue-600 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full bg-red-600 blur-3xl" />
        </motion.div>
        
        {/* Fitness-themed SVG patterns */}
        <svg className="absolute top-10 left-10 text-white opacity-5" width="60" height="60" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86 19.86 18.43 22 16.29 20.57 14.86z" />
        </svg>
        
        <svg className="absolute bottom-10 right-10 text-white opacity-5" width="80" height="80" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86 19.86 18.43 22 16.29 20.57 14.86z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Create Your Ultimate Workout Plan
          </h1>
          <p className="mt-4 text-gray-300 text-xl">
            Design a custom fitness journey to reach your goals
          </p>
        </motion.div>

        {/* Progress steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            <motion.div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 1 ? 'bg-blue-600' : 'bg-green-500'} shadow-lg`}
              whileHover={{ scale: 1.05 }}
            >
              {formStep > 1 ? <Check className="w-6 h-6" /> : 1}
            </motion.div>
            <div className={`h-1 w-16 ${formStep === 1 ? 'bg-gray-600' : 'bg-green-500'}`}></div>
            <motion.div 
              className={`w-10 h-10 rounded-full flex items-center justify-center ${formStep === 2 ? 'bg-blue-600' : formStep > 2 ? 'bg-green-500' : 'bg-gray-600'} shadow-lg`}
              whileHover={{ scale: 1.05 }}
            >
              2
            </motion.div>
          </div>
          <div className="flex justify-center gap-24 mt-2 text-sm">
            <span>Plan Details</span>
            <span>Add Exercises</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {formStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CalendarCheck className="mr-2 text-blue-400" />
                Plan Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <motion.div 
                  className="form-group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-blue-400" />
                    Plan Name
                  </label>
                  <input 
                    name="planName" 
                    placeholder="e.g. 30-Day Strength Builder" 
                    value={formData.planName}
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </motion.div>

                <motion.div 
                  className="form-group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-400" />
                    Goal
                  </label>
                  <select 
                    name="goal" 
                    value={formData.goal}
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Select Goal</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Weight Gain">Weight Gain</option>
                    <option value="Muscle Building">Muscle Building</option>
                    <option value="Strength">Strength</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </motion.div>

                <motion.div 
                  className="form-group md:col-span-2"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <span className="mr-2 text-blue-400">📝</span>
                    Description
                  </label>
                  <textarea 
                    name="description" 
                    placeholder="Describe your workout plan and what users can expect..." 
                    value={formData.description}
                    onChange={handleChange} 
                    rows="4"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  ></textarea>
                </motion.div>

                <motion.div 
                  className="form-group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Medal className="w-4 h-4 mr-2 text-blue-400" />
                    Difficulty
                  </label>
                  <select 
                    name="difficulty" 
                    value={formData.difficulty}
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Select Difficulty</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </motion.div>

                <motion.div 
                  className="form-group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-400" />
                    Duration
                  </label>
                  <select 
                    name="totalDuration" 
                    value={formData.totalDuration}
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="7 days">7 days</option>
                    <option value="14 days">14 days</option>
                    <option value="21 days">21 days</option>
                    <option value="30 days">30 days</option>
                    <option value="60 days">60 days</option>
                    <option value="90 days">90 days</option>
                  </select>
                </motion.div>

                <motion.div 
                  className="form-group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-blue-400" />
                    Tags
                  </label>
                  <input 
                    name="tags" 
                    placeholder="e.g. hiit, weightloss, home (comma separated)" 
                    value={formData.tags}
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </motion.div>

                <motion.div 
                  className="form-group"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Video className="w-4 h-4 mr-2 text-blue-400" />
                    Preview Video Link
                  </label>
                  <input 
                    name="videoPreview" 
                    placeholder="YouTube or Vimeo URL" 
                    value={formData.videoPreview}
                    onChange={handleChange} 
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </motion.div>

                <motion.div 
                  className="form-group md:col-span-2"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <label className="block text-gray-300 mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-blue-400" />
                    Cover Image
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="w-full flex items-center justify-center px-4 py-6 bg-gray-700 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:bg-gray-600 transition-all">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden"
                      />
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                    
                    {previewImage && (
                      <div className="relative h-32 w-32 rounded-lg overflow-hidden border-2 border-blue-500">
                        <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                        <button 
                          className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                          onClick={() => {
                            setPreviewImage(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreatePlan}
                disabled={isLoading}
                className="mt-8 w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold text-lg hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Create Plan <ChevronRight className="ml-2" />
                  </span>
                )}
              </motion.button>
            </motion.div>
          )}

          {formStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Dumbbell className="mr-2 text-blue-400" /> 
                  Add Exercises For Each Day
                </h2>
                
                <div className="flex items-center">
                  <span className="mr-3 text-gray-300">Day:</span>
                  <select 
                    value={selectedDay} 
                    onChange={(e) => {
                      // Save current exercises before switching days
                      if (exercises.length > 0) {
                        const shouldSave = window.confirm("Save current exercises before switching days?");
                        if (shouldSave) {
                          handleSaveExercisesForDay().then(() => {
                            setSelectedDay(e.target.value);
                          });
                        } else {
                          setSelectedDay(e.target.value);
                          setExercises([]);
                        }
                      } else {
                        setSelectedDay(e.target.value);
                      }
                    }}
                    className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all capitalize"
                  >
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day} className="capitalize">
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <motion.div 
                  className="bg-gray-700 rounded-xl p-6 border border-gray-600"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Add New Exercise
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm">Exercise Name</label>
                      <input
                        placeholder="e.g. Barbell Squat"
                        value={exerciseInput.name}
                        onChange={(e) => setExerciseInput(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1 text-sm flex items-center">
                          <Repeat className="w-3 h-3 mr-1" /> Sets
                        </label>
                        <input
                          placeholder="e.g. 3-4"
                          value={exerciseInput.sets}
                          onChange={(e) => setExerciseInput(prev => ({ ...prev, sets: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-1 text-sm flex items-center">
                          <Activity className="w-3 h-3 mr-1" /> Reps
                        </label>
                        <input
                          placeholder="e.g. 8-12"
                          value={exerciseInput.reps}
                          onChange={(e) => setExerciseInput(prev => ({ ...prev, reps: e.target.value }))}
                          className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm flex items-center">
                        <Target className="w-3 h-3 mr-1" /> Target Muscles
                      </label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {muscleGroups.map((muscle) => (
                          <button
                            key={muscle}
                            type="button"
                            onClick={() => handleMuscleGroupToggle(muscle)}
                            className={`px-2 py-1 text-xs rounded-full transition-all ${
                              exerciseInput.targetMuscles.includes(muscle)
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                            }`}
                          >
                            {muscle}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm flex items-center">
                        <Dumbbell className="w-3 h-3 mr-1" /> Equipment
                      </label>
                      <select
                        value={exerciseInput.equipment}
                        onChange={(e) => setExerciseInput(prev => ({ ...prev, equipment: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        {equipmentOptions.map((equip) => (
                          <option key={equip} value={equip}>
                            {equip}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-300 mb-1 text-sm flex items-center">
                        <Video className="w-3 h-3 mr-1" /> Tutorial Video Link (Optional)
                      </label>
                      <input
                        placeholder="YouTube or tutorial URL"
                        value={exerciseInput.link}
                        onChange={(e) => setExerciseInput(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddExerciseLocally}
                      className="w-full py-2 mt-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Exercise
                    </motion.button>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-700 rounded-xl p-6 border border-gray-600"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                    <Dumbbell className="w-5 h-5 mr-2" />
                    Workout Preview for <span className="capitalize ml-1">{selectedDay}</span>
                  </h3>
                  
                  <div className="h-72 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
                    {exercises.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Dumbbell className="w-10 h-10 mb-2 opacity-30" />
                        <p>No exercises added yet</p>
                        <p className="text-sm">Add exercises to build your workout</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {exercises.map((ex, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="bg-gray-800 rounded-lg p-4 mb-3 border border-gray-700 hover:border-blue-500 transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-lg">{ex.name}</h4>
                                <div className="text-sm text-gray-400 mt-1">
                                  <span className="bg-blue-900 bg-opacity-40 text-blue-300 px-2 py-0.5 rounded-full text-xs">
                                    {ex.sets} sets × {ex.reps} reps
                                  </span>
                                  
                                  {ex.equipment && ex.equipment !== "None/Bodyweight" && (
                                    <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs ml-2">
                                      {ex.equipment}
                                    </span>
                                  )}
                                </div>
                                
                                {ex.targetMuscles && ex.targetMuscles.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {ex.targetMuscles.map((muscle, i) => (
                                      <span key={i} className="text-xs text-gray-300 bg-gray-700 px-1.5 py-0.5 rounded">
                                        {muscle}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                {ex.link && (
                                  <a 
                                    href={ex.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="mt-2 text-blue-400 hover:underline text-sm inline-flex items-center"
                                  >
                                    <Video className="w-3 h-3 mr-1" /> Watch tutorial
                                  </a>
                                )}
                              </div>
                              
                              <div className="flex space-x-1">
                                <button 
                                  onClick={() => {
                                    // Open an edit modal/popover - simple prompt implementation for now
                                    const newName = prompt("Exercise Name", ex.name) || ex.name;
                                    const newSets = prompt("Sets", ex.sets) || ex.sets;
                                    const newReps = prompt("Reps", ex.reps) || ex.reps;
                                    const newLink = prompt("Video Link", ex.link) || ex.link;
                                    
                                    handleEditExercise(idx, {
                                      ...ex,
                                      name: newName,
                                      sets: newSets,
                                      reps: newReps,
                                      link: newLink
                                    });
                                  }}
                                  className="p-1 bg-gray-700 hover:bg-blue-600 rounded transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                
                                <button 
                                  onClick={() => handleDeleteExercise(idx)}
                                  className="p-1 bg-gray-700 hover:bg-red-600 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                  
                  {exercises.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={isLoading}
                      onClick={handleSaveExercisesForDay}
                      className="w-full py-2 mt-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Save className="w-4 h-4 mr-2" /> Save {selectedDay}'s Workout
                        </span>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              </div>

              {/* Workout day summary cards */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-200">Weekly Workout Schedule</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <motion.div
                      key={day}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`relative rounded-lg p-3 border cursor-pointer transition-all flex flex-col items-center justify-center ${
                        selectedDay === day 
                          ? "bg-blue-900 bg-opacity-40 border-blue-500" 
                          : "bg-gray-700 bg-opacity-40 border-gray-600 hover:border-blue-400"
                      }`}
                      onClick={() => setSelectedDay(day)}
                    >
                      <span className="capitalize font-medium">{day.slice(0, 3)}</span>
                      <div className="flex items-center justify-center mt-1">
                        <Dumbbell className="w-4 h-4 text-gray-400" />
                        <span className="ml-1 text-xs">0 exercises</span>
                      </div>
                      
                      {selectedDay === day && (
                        <motion.div 
                          layoutId="dayIndicator"
                          className="absolute -bottom-1 w-10 h-1 bg-blue-500 rounded-full"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setFormStep(1)}
                  className="px-6 py-3 bg-gray-700 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  ← Back to Plan Details
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    // Logic to finalize the entire workout plan
                    showNotification("Workout plan created successfully!", "success");
                    
                    // Trigger confetti celebration
                    confetti({
                      particleCount: 200,
                      spread: 90,
                      origin: { y: 0.6 }
                    });
                    
                    // You could redirect to a plan view page or reset the form here
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Finalize Workout Plan
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Decorative elements */}
        <div className="absolute bottom-10 left-5 opacity-10 pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 6h-3V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3h-4V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1zM8 4h2v2H8V4zm8 0h2v2h-2V4zm4 16H4V8h16v12z" fill="currentColor"/>
            <path d="M7 14h2v2H7zm4-2h2v2h-2zm4 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2z" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="absolute bottom-10 right-5 opacity-10 pointer-events-none">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57z" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const Check = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default CreatePlanForm;