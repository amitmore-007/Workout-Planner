import { useEffect, useState } from "react";
import axios from "axios";
import { Play, CheckCircle, Heart, Clock } from "lucide-react";

const WorkoutPlan = () => {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedExercises, setCompletedExercises] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/exercises/workout-plan", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setWorkoutPlan(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching workout:", error);
        setError("Could not fetch workout plan.");
        setLoading(false);
      });
  }, []);

  const markAsCompleted = (exerciseName) => {
    setCompletedExercises([...completedExercises, exerciseName]);
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold">🏋️ Today's Workout Plan</h1>

      {loading ? (
        <p className="text-gray-400 mt-2">Loading workout...</p>
      ) : error ? (
        <p className="text-red-400 mt-2">{error}</p>
      ) : workoutPlan.message ? (
        <p className="text-gray-400 mt-2">{workoutPlan.message}</p>
      ) : (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">{workoutPlan.today} Workout</h2>

          <ul className="mt-4 space-y-4">
            {workoutPlan.workoutPlan.map((bodyPartObj, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold mt-4">{bodyPartObj.bodyPart.toUpperCase()}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                  {bodyPartObj.exercises.map((exercise, idx) => (
                    <div key={idx} className="bg-gray-800 p-4 rounded-lg shadow-lg text-center">
                      <img
                        src={exercise.gifUrl}
                        alt={exercise.name}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <h3 className="text-lg font-semibold mt-2">{exercise.name}</h3>
                      <p className="text-gray-400 text-sm">Equipment: {exercise.equipment}</p>
                      
                      <div className="flex items-center justify-center space-x-3 mt-3">
                        {/* Start Timer Button */}
                        <button className="bg-blue-500 px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
                          <Clock className="w-4 h-4" />
                          <span>Start Timer</span>
                        </button>

                        {/* Mark Completed */}
                        <button
                          onClick={() => markAsCompleted(exercise.name)}
                          className={`px-3 py-2 rounded-lg flex items-center space-x-2 ${
                            completedExercises.includes(exercise.name)
                              ? "bg-green-500"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>{completedExercises.includes(exercise.name) ? "Completed" : "Done"}</span>
                        </button>

                        {/* Favorite Button */}
                        <button className="bg-red-500 px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600">
                          <Heart className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlan;
