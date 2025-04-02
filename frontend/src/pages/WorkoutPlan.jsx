import { useEffect, useState } from "react";
import axios from "axios";

const WorkoutPlan = () => {
    const [workouts, setWorkouts] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workouts/todays", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Fetched Workouts:", response.data.workouts);
                setWorkouts(response.data.workouts.map(workout => ({ ...workout, time: 0, isRunning: false, liked: false, completed: false })));
            } catch (error) {
                console.error("Error fetching workouts:", error.response?.data || error.message);
            }
        };

        fetchWorkouts();
    }, []);

    const toggleTimer = (id) => {
        setWorkouts(workouts.map(workout => 
            workout._id === id ? { ...workout, isRunning: !workout.isRunning } : workout
        ));
    };

    const resetTimer = (id) => {
        setWorkouts(workouts.map(workout => 
            workout._id === id ? { ...workout, time: 0, isRunning: false } : workout
        ));
    };

    useEffect(() => {
        const timers = workouts.map(workout => 
            workout.isRunning ? setInterval(() => {
                setWorkouts(prevWorkouts => prevWorkouts.map(w => 
                    w._id === workout._id ? { ...w, time: w.time + 1 } : w
                ));
            }, 1000) : null
        );
        return () => timers.forEach(timer => timer && clearInterval(timer));
    }, [workouts]);

    const handleLike = (id) => {
        setWorkouts(workouts.map(workout => 
            workout._id === id ? { ...workout, liked: !workout.liked } : workout
        ));
    };

    const handleComplete = (id) => {
        setWorkouts(workouts.map(workout => 
            workout._id === id ? { ...workout, completed: true } : workout
        ));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h2 className="text-3xl font-bold text-center mb-6">🔥 Your Workout Plan 🔥</h2>
            
            {workouts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {workouts.map((workout) => (
                        <div key={workout._id} className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:scale-105 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-blue-400">{workout.Exercise_Name}</h3>
                            <p className="text-gray-400 text-sm">{workout.Exercise_Category.toUpperCase()}</p>

                            <div className="mt-4">
                                <p><strong className="text-yellow-400">🎯 Goal:</strong> {workout.goal}</p>
                                <p><strong className="text-green-400">⚡ Difficulty:</strong> {workout.difficulty}</p>
                                <p><strong className="text-pink-400">🛠 Equipment:</strong> {workout.Equipment}</p>
                            </div>

                            <div className="mt-3">
                                <p className="font-semibold text-purple-400">💪 Primary Muscles:</p>
                                <p>{workout.Primary_Muscles.join(", ") || "N/A"}</p>
                                <p className="font-semibold text-indigo-400 mt-2">🦵 Secondary Muscles:</p>
                                <p>{workout.Secondary_Muscles.join(", ") || "N/A"}</p>
                            </div>

                            <div className="mt-3">
                                <p className="font-semibold text-orange-400">📜 Instructions:</p>
                                <ul className="list-disc list-inside text-sm text-gray-300">
                                    {workout.Instructions.map((instruction, index) => (
                                        <li key={index}>{instruction}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <button 
                                    onClick={() => toggleTimer(workout._id)} 
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md">
                                    {workout.isRunning ? 'Pause Timer' : 'Start Timer'}
                                </button>
                                <button 
                                    onClick={() => resetTimer(workout._id)} 
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                                    Reset Timer
                                </button>
                                <span className="text-gray-300">⏱ {workout.time}s</span>
                            </div>

                            <div className="mt-4 flex gap-4">
                                <button 
                                    onClick={() => handleLike(workout._id)} 
                                    className={`px-4 py-2 rounded-md ${workout.liked ? 'bg-red-500' : 'bg-gray-600'}`}>
                                    {workout.liked ? '❤️ Liked' : '🤍 Like'}
                                </button>
                                <button 
                                    onClick={() => handleComplete(workout._id)} 
                                    disabled={workout.completed} 
                                    className={`px-4 py-2 rounded-md ${workout.completed ? 'bg-green-500' : 'bg-gray-600'}`}>
                                    {workout.completed ? '✅ Completed' : 'Mark as Completed'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 mt-10">Loading workouts or no workouts available...</p>
            )}
        </div>
    );
};

export default WorkoutPlan;
