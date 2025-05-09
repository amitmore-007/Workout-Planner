import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import '../../styles/WorkoutPlan.css';

const WorkoutPlan = () => {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workouts/todays", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("Fetched Workouts:", response.data.workouts);
                setWorkouts(response.data.workouts.map(workout => {
                    // Clean and process the data
                    const processedWorkout = { 
                        ...workout, 
                        time: 0, 
                        isRunning: false, 
                        liked: false, 
                        completed: false
                    };
                    
                    // Clean Primary_Muscles from brackets
                    if (typeof workout.Primary_Muscles === 'string') {
                        // Remove square brackets and split by commas
                        processedWorkout.Primary_Muscles = workout.Primary_Muscles
                            .replace(/^\[|\]$/g, '') // Remove [ and ]
                            .split(',')
                            .map(muscle => muscle.trim())
                            .filter(muscle => muscle); // Remove empty items
                    } else if (Array.isArray(workout.Primary_Muscles)) {
                        processedWorkout.Primary_Muscles = workout.Primary_Muscles;
                    } else {
                        processedWorkout.Primary_Muscles = [];
                    }
                    
                    // Clean Secondary_Muscles from brackets
                    if (typeof workout.Secondary_Muscles === 'string') {
                        // Remove square brackets and split by commas
                        processedWorkout.Secondary_Muscles = workout.Secondary_Muscles
                            .replace(/^\[|\]$/g, '') // Remove [ and ]
                            .split(',')
                            .map(muscle => muscle.trim())
                            .filter(muscle => muscle); // Remove empty items
                    } else if (Array.isArray(workout.Secondary_Muscles)) {
                        processedWorkout.Secondary_Muscles = workout.Secondary_Muscles;
                    } else {
                        processedWorkout.Secondary_Muscles = [];
                    }
                    
                    // Process Instructions: Convert paragraph into bullet points
                    if (typeof workout.Instructions === 'string') {
                        // Remove square brackets
                        const cleanInstructions = workout.Instructions.replace(/^\[|\]$/g, '');
                        
                        // Split the paragraph into sentences
                        processedWorkout.Instructions = cleanInstructions
                            .split(/\.\s+/) // Split on period followed by whitespace
                            .map(sentence => sentence.trim())
                            .filter(sentence => sentence) // Remove empty sentences
                            .map(sentence => sentence.endsWith('.') ? sentence : sentence + '.'); // Ensure each ends with a period
                    } else if (Array.isArray(workout.Instructions)) {
                        processedWorkout.Instructions = workout.Instructions;
                    } else {
                        processedWorkout.Instructions = [];
                    }
                    
                    return processedWorkout;
                }));
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

    const openInstructionsModal = (workout) => {
        setSelectedWorkout(workout);
        setShowModal(true);
        // Make sure the navbar is visible by preventing body scroll while maintaining positioning
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '15px'; // Prevent layout shift
    };
    
    const closeInstructionsModal = () => {
        setShowModal(false);
        // Restore normal scrolling
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    };

    // Format seconds to minutes:seconds
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getRandomDelay = () => Math.random() * 0.5;

    // Card hover animations
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }, // Fixed duration
        hover: { 
            y: -10, 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 300 }
        }
    };

    // Wave animation for the "Your Workout Plan" heading
    const waveVariants = {
        wave: {
            rotate: [0, 15, 0, -15, 0],
            transition: { repeat: Infinity, repeatType: "mirror", duration: 2.5 }
        }
    };

    // Pulse animation for timer
    const pulseVariants = {
        pulse: {
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 1.2 }
        }
    };

    // For "completed" animation
    const completedVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
    };
    
    // Like button animations
    const likeVariants = {
        liked: {
            scale: [1, 1.3, 1],
            transition: { duration: 0.5, ease: "easeInOut" }
        },
        unliked: {
            scale: 1
        }
    };
    
    // Instruction bullet point animation variants
    const bulletVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (custom) => ({
            opacity: 1,
            x: 0,
            transition: { 
                delay: custom * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }),
        hover: {
            scale: 1.05,
            x: 10,
            color: "#60a5fa", // Blue highlight
            transition: { 
                type: "spring", 
                stiffness: 300,
                damping: 10
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 overflow-hidden">
            {/* Dynamic background elements */}
            <div className="fixed inset-0 z-0 opacity-10">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl"></div>
                <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-pink-500 rounded-full filter blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-center mb-8 space-x-4">
                    <motion.div 
                        animate="wave" 
                        variants={waveVariants}
                        className="text-4xl">💪</motion.div>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                        Your Workout Plan
                    </h2>
                    <motion.div 
                        animate="wave" 
                        variants={waveVariants}
                        className="text-4xl">🔥</motion.div>
                </div>
            
                {workouts.length > 0 ? (
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {workouts.map((workout, index) => (
                            <motion.div
                                key={workout._id}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                transition={{ delay: index * 0.15 }}
                                className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-700"
                            >
                                {/* Glow effect based on exercise category */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-r ${
                                    workout.Exercise_Category?.toLowerCase().includes('cardio') ? 'from-red-500 to-orange-500' :
                                    workout.Exercise_Category?.toLowerCase().includes('strength') ? 'from-blue-500 to-cyan-500' :
                                    workout.Exercise_Category?.toLowerCase().includes('flexibility') ? 'from-purple-500 to-pink-500' :
                                    'from-green-500 to-teal-500'
                                } opacity-20 blur rounded-xl -z-10`}></div>

                                {/* Category badge */}
                                <div className="absolute right-6 top-6">
                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-900 text-blue-200 backdrop-blur-sm">
                                        {workout.Exercise_Category?.toUpperCase()}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                    {workout.Exercise_Name}
                                </h3>

                                <div className="mt-4 space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-yellow-400 text-lg">🎯</span>
                                        <div>
                                            <span className="text-gray-400 text-sm">GOAL</span>
                                            <p className="font-medium">{workout.goal}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400 text-lg">⚡</span>
                                        <div>
                                            <span className="text-gray-400 text-sm">DIFFICULTY</span>
                                            <div className="flex mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`h-2 w-6 rounded-full mx-0.5 ${
                                                        i < parseInt(workout.difficulty) ? 'bg-green-500' : 'bg-gray-600'
                                                    }`}></span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <span className="text-pink-400 text-lg">🛠</span>
                                        <div>
                                            <span className="text-gray-400 text-sm">EQUIPMENT</span>
                                            <p className="font-medium">{workout.Equipment}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-700">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-purple-400">💪</span>
                                        <span className="text-gray-300 font-medium">
                                            {workout.Primary_Muscles?.join(", ") || "None specified"}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="text-indigo-400">🦵</span>
                                        <span className="text-gray-300 font-medium">
                                            {workout.Secondary_Muscles?.join(", ") || "None specified"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => openInstructionsModal(workout)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <span>View Instructions</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </motion.button>
                                </div>

                                <div className="mt-4">
                                    <motion.div 
                                        animate={workout.isRunning ? "pulse" : ""}
                                        variants={pulseVariants}
                                        className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                                    >
                                        <div className="text-2xl font-mono font-bold text-gray-200">
                                            {formatTime(workout.time)}
                                        </div>
                                        <div className="flex space-x-2">
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => toggleTimer(workout._id)}
                                                className={`p-2.5 rounded-full ${workout.isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
                                            >
                                                {workout.isRunning ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                )}
                                            </motion.button>
                                            <motion.button 
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => resetTimer(workout._id)}
                                                className="p-2.5 rounded-full bg-gray-700 hover:bg-gray-600"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleLike(workout._id)}
                                        className={`relative overflow-hidden flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-300 ${
                                            workout.liked 
                                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white' 
                                                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        }`}
                                    >
                                        {/* Added particle effect when liked */}
                                        {workout.liked && (
                                            <motion.div 
                                                initial={{ opacity: 1 }}
                                                animate={{ opacity: 0 }}
                                                className="absolute inset-0 flex items-center justify-center"
                                            >
                                                {[...Array(8)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ 
                                                            x: 0, 
                                                            y: 0, 
                                                            scale: 0 
                                                        }}
                                                        animate={{ 
                                                            x: (Math.random() - 0.5) * 60, 
                                                            y: (Math.random() - 0.5) * 60, 
                                                            scale: Math.random() * 0.6 + 0.2,
                                                            opacity: 0
                                                        }}
                                                        transition={{ duration: 0.8 }}
                                                        className="absolute w-2 h-2 bg-pink-300 rounded-full"
                                                    />
                                                ))}
                                            </motion.div>
                                        )}
                                        
                                        <motion.span 
                                            variants={likeVariants}
                                            animate={workout.liked ? "liked" : "unliked"}
                                            className="mr-2 text-lg relative"
                                        >
                                            {workout.liked ? '❤️' : '🤍'}
                                        </motion.span>
                                        <span>{workout.liked ? 'Liked' : 'Like'}</span>
                                    </motion.button>
                                    
                                    <motion.button 
                                        whileHover={!workout.completed ? { scale: 1.05 } : {}}
                                        whileTap={!workout.completed ? { scale: 0.95 } : {}}
                                        onClick={() => !workout.completed && handleComplete(workout._id)}
                                        disabled={workout.completed}
                                        className={`flex items-center justify-center py-2 px-4 rounded-lg transition-all duration-300 ${
                                            workout.completed 
                                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                                                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                        }`}
                                    >
                                        {workout.completed ? (
                                            <motion.div 
                                                className="flex items-center"
                                                variants={completedVariants}
                                                initial="initial"
                                                animate="animate"
                                            >
                                                <span className="mr-2">✅</span>
                                                <span>Completed</span>
                                            </motion.div>
                                        ) : (
                                            <span>Complete</span>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 mb-4"
                        >
                            <svg className="w-full h-full text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </motion.div>
                        <p className="text-xl text-gray-400">Loading your personalized workouts...</p>
                    </div>
                )}
            </div>

            {/* Enhanced Instructions Modal with Bullet Points */}
            <AnimatePresence>
                {showModal && selectedWorkout && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black backdrop-blur-sm"
                            onClick={() => closeInstructionsModal()}
                        />
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl max-w-2xl w-full mx-auto shadow-2xl border border-blue-900/30 overflow-hidden"
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-10 -mr-32 -mt-32 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full opacity-10 -ml-32 -mb-32 blur-3xl"></div>
                            
                            {/* Modern header section with gradient */}
                            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 relative">
                                <div className="absolute inset-0 bg-black opacity-30"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-2xl font-bold text-white font-sans tracking-tight">
                                            {selectedWorkout.Exercise_Name}
                                        </h3>
                                        <motion.button
                                            whileHover={{ scale: 1.1, rotate: 90 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => closeInstructionsModal()}
                                            className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white"
                                            transition={{ duration: 0.2 }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                    <p className="text-blue-200 text-sm">{selectedWorkout.Exercise_Category}</p>
                                </div>
                            </div>

                            {/* Content section with 3D card effect */}
                            <div className="p-6 bg-gray-800/50 backdrop-blur-md">
                                <div className="bg-blue-900/10 rounded-lg p-4 mb-4 border border-blue-500/20 shadow-inner transform perspective-600">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
                                            <motion.span 
                                                animate={{ 
                                                    rotateY: [0, 180, 360],
                                                    scale: [1, 1.2, 1]
                                                }}
                                                transition={{ 
                                                    duration: 3, 
                                                    repeat: Infinity,
                                                    repeatType: "loop"
                                                }}
                                                className="text-2xl inline-block"
                                            >💪</motion.span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-white">Proper Form Instructions</h4>
                                            <p className="text-blue-300 text-sm">Follow these steps carefully</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions with enhanced bullet points */}
                                <div className="h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    <ul className="space-y-4">
                                        {selectedWorkout.Instructions?.map((instruction, index) => (
                                            <motion.li 
                                                key={index}
                                                custom={index}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                                variants={bulletVariants}
                                                className="flex items-start"
                                            >
                                                {/* Animated bullet point with pulse effect */}
                                                <motion.div 
                                                    className="flex-shrink-0 mr-4"
                                                    animate={{ 
                                                        scale: [1, 1.1, 1],
                                                        opacity: [0.7, 1, 0.7]
                                                    }}
                                                    transition={{ 
                                                        duration: 2,
                                                        repeat: Infinity, 
                                                        repeatType: "mirror", 
                                                        delay: index * 0.2
                                                    }}
                                                >
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
                                                        <span className="text-white font-bold">{index+1}</span>
                                                    </div>
                                                </motion.div>
                                                
                                                {/* Instruction text with modern styling */}
                                                <div className="bg-gray-800/80 backdrop-blur rounded-lg p-3 flex-grow border-l-4 border-blue-500 shadow-md">
                                                    <p className="text-gray-200 font-sans tracking-wide leading-relaxed">
                                                        {instruction}
                                                    </p>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* Interactive element - Progress tracker */}
                                <div className="mt-6 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                                    <h4 className="text-blue-300 font-semibold mb-2">Form Mastery Progress</h4>
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <motion.div 
                                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full" 
                            initial={{ width: 0 }} 
                            animate={{ width: "65%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        ></motion.div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-400">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Expert</span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex space-x-4">
                    <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => closeInstructionsModal()}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                        <span>Close</span>
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                        <span>Save to Favorites</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WorkoutPlan;