import { useState, useEffect } from "react";

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

const Dashboard = ({ plans, onCreateNew, onEditPlan, onDeletePlan }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Your Workout Plans</h1>
          <button
            onClick={onCreateNew}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create New Plan
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">You haven't created any workout plans yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan._id} className="bg-white rounded-lg shadow overflow-hidden">
                {plan.image && (
                  <img
                    src={plan.image}
                    alt={plan.planName}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{plan.planName}</h3>
                  <p className="text-gray-600 mb-2">{plan.description}</p>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {plan.difficulty}
                    </span>
                    <span>{plan.totalDuration}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditPlan(plan._id)}
                      className="flex-1 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeletePlan(plan._id)}
                      className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CreatePlanForm = ({ onPlanCreated, onCancel, editingPlanId }) => {
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

  const [previewImage, setPreviewImage] = useState(null);
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
  const [createdPlanId, setCreatedPlanId] = useState(editingPlanId || null);

  useEffect(() => {
    if (editingPlanId) {
      // Load existing plan data if editing
      const fetchPlanData = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/workoutPlans/${editingPlanId}`);
          if (res.ok) {
            const data = await res.json();
            setFormData({
              planName: data.planName,
              goal: data.goal,
              description: data.description,
              difficulty: data.difficulty,
              totalDuration: data.totalDuration,
              tags: data.tags,
              image: data.image,
              videoPreview: data.videoPreview
            });
            if (data.image) setPreviewImage(data.image);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchPlanData();
    }
  }, [editingPlanId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePlan = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      const endpoint = editingPlanId 
        ? `http://localhost:5000/api/workoutPlans/update/${editingPlanId}`
        : "http://localhost:5000/api/workoutPlans/create";
      
      const method = editingPlanId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: form,
      });

      if (res.ok) {
        const plan = await res.json();
        setCreatedPlanId(plan._id);
        setFormStep(2);
      }
    } catch (error) {
      console.error(error);
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
    }
  };

  const handleSaveExercisesForDay = async () => {
    try {
      await fetch(`http://localhost:5000/api/workoutPlans/${createdPlanId}/day/${selectedDay}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exercises }),
      });
      setExercises([]);
      alert(`Exercises saved for ${selectedDay}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteExercise = (index) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleLoadDayExercises = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/workoutPlans/${createdPlanId}/day/${selectedDay}`);
      if (res.ok) {
        const data = await res.json();
        setExercises(data.exercises || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (formStep === 2 && createdPlanId) {
      handleLoadDayExercises();
    }
  }, [selectedDay, formStep]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {formStep === 1 && (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">
            {editingPlanId ? "Edit Workout Plan" : "Create Workout Plan"}
          </h1>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Plan Name</label>
              <input
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Goal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Goal</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Muscle Building">Muscle Building</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Difficulty</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block mb-1">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
              />
              {previewImage && (
                <img src={previewImage} alt="Preview" className="mt-2 h-32 object-cover" />
              )}
            </div>

            <div>
              <label className="block mb-1">Video Preview URL</label>
              <input
                name="videoPreview"
                value={formData.videoPreview}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Next: Add Exercises
              </button>
            </div>
          </div>
        </div>
      )}

      {formStep === 2 && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Add Exercises</h1>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="p-2 border rounded"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border p-4 rounded">
              <h2 className="font-bold mb-4">Add Exercise</h2>
              
              <div className="space-y-3">
                <div>
                  <label className="block mb-1">Exercise Name</label>
                  <input
                    value={exerciseInput.name}
                    onChange={(e) => setExerciseInput(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Sets</label>
                    <input
                      value={exerciseInput.sets}
                      onChange={(e) => setExerciseInput(prev => ({ ...prev, sets: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-1">Reps</label>
                    <input
                      value={exerciseInput.reps}
                      onChange={(e) => setExerciseInput(prev => ({ ...prev, reps: e.target.value }))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1">Target Muscles</label>
                  <div className="flex flex-wrap gap-2">
                    {muscleGroups.map((muscle) => (
                      <button
                        key={muscle}
                        type="button"
                        onClick={() => handleMuscleGroupToggle(muscle)}
                        className={`px-2 py-1 text-xs rounded ${
                          exerciseInput.targetMuscles.includes(muscle)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {muscle}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1">Equipment</label>
                  <select
                    value={exerciseInput.equipment}
                    onChange={(e) => setExerciseInput(prev => ({ ...prev, equipment: e.target.value }))}
                    className="w-full p-2 border rounded"
                  >
                    {equipmentOptions.map((equip) => (
                      <option key={equip} value={equip}>
                        {equip}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={handleAddExerciseLocally}
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                  Add Exercise
                </button>
              </div>
            </div>
            
            <div className="border p-4 rounded">
              <h2 className="font-bold mb-4">Exercises for {selectedDay}</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {exercises.length === 0 ? (
                  <p>No exercises added yet</p>
                ) : (
                  exercises.map((ex, idx) => (
                    <div key={idx} className="border p-3 rounded">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{ex.name}</h3>
                          <p>{ex.sets} sets × {ex.reps} reps</p>
                          {ex.targetMuscles.length > 0 && (
                            <p>Muscles: {ex.targetMuscles.join(", ")}</p>
                          )}
                          <p>Equipment: {ex.equipment}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteExercise(idx)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {exercises.length > 0 && (
                <button
                  onClick={handleSaveExercisesForDay}
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
                >
                  Save Exercises for {selectedDay}
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setFormStep(1)}
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
            
            <button
              onClick={() => {
                alert("Plan created successfully!");
                onPlanCreated();
              }}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Finish Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const WorkoutPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPlanId, setEditingPlanId] = useState(null);

  // Fetch plans when component mounts
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/workoutPlans");
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanCreated = (newPlan) => {
    if (newPlan) {
      setPlans(prev => [...prev, newPlan]);
    }
    setShowForm(false);
    setEditingPlanId(null);
  };

  const handleEditPlan = (planId) => {
    setEditingPlanId(planId);
    setShowForm(true);
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/workoutPlans/delete/${planId}`, {
          method: "DELETE"
        });
        
        if (res.ok) {
          setPlans(prev => prev.filter(plan => plan._id !== planId));
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      {showForm ? (
        <CreatePlanForm
          onPlanCreated={handlePlanCreated}
          onCancel={() => {
            setShowForm(false);
            setEditingPlanId(null);
          }}
          editingPlanId={editingPlanId}
        />
      ) : (
        <Dashboard
          plans={plans}
          onCreateNew={() => setShowForm(true)}
          onEditPlan={handleEditPlan}
          onDeletePlan={handleDeletePlan}
        />
      )}
    </>
  );
};

export default WorkoutPlansPage;