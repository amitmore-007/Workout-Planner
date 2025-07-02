import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Activity, User, Ruler, Weight, HeartPulse, Dumbbell, Utensils, Menu, Zap, Trophy, Target, Calendar, BarChart, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler } from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import confetti from "canvas-confetti";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [timeframe, setTimeframe] = useState('week');

  // Mock data for enhanced charts
  const weeklyProgress = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Burned',
        data: [420, 380, 450, 520, 390, 470, 410],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: 'Calories Consumed',
        data: [2100, 1950, 2200, 2050, 2150, 1900, 2000],
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
        borderRadius: 8,
      }
    ],
  };

  const progressLineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Weight Progress (kg)',
        data: [82, 81.5, 80.8, 80.2, 79.5, 79],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(239, 68, 68)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      }
    ],
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;
    
        if (!token) {
          console.error("No token found! Redirecting to login...");
          navigate("/login");
          return;
        }
    
        const response = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setUser(response.data);
        
        // Trigger welcome animation after data loads
        setTimeout(() => {
          setShowWelcome(true);
          
          // Launch confetti effect on successful login
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#8B5CF6', '#EF4444', '#F59E0B']
          });
        }, 300);
        
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Enhanced loading animation
  if (loading) {
    return (
      <div className="flex flex-col  justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative z-10"
        >
          <div className="w-20 h-20 border-4 border-transparent border-t-green-400 border-r-purple-400 border-b-red-400 border-l-yellow-400 rounded-full" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-white text-xl font-medium"
        >
          Preparing your fitness universe...
        </motion.p>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-gray-900 mb-20 ml-[-20] via-black to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      

      {/* Main Content */}
      <div className="flex-2 p-6 transition-all duration-500 ease-in-out relative z-10 overflow-y-auto">
        {/* Toggle Sidebar Button */}
       

        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: showWelcome ? 1 : 0, y: showWelcome ? 0 : -50 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-12 text-center"
        >
          <div className="relative">
            <motion.h2 
              className="text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-purple-500 to-pink-500"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Welcome back, {user?.name}!
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg"
            >
              Ready to crush your fitness goals today? Let's make it extraordinary! 🚀
            </motion.p>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Current Weight", 
              value: user?.weight || 0, 
              suffix: " kg", 
              icon: <Weight className="w-8 h-8" />, 
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-500/10"
            },
            { 
              title: "Goal Progress", 
              value: 68, 
              suffix: "%", 
              icon: <Target className="w-8 h-8" />, 
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-500/10"
            },
            { 
              title: "Workout Streak", 
              value: 12, 
              suffix: " days", 
              icon: <Dumbbell className="w-8 h-8" />, 
              color: "from-purple-500 to-violet-500",
              bgColor: "bg-purple-500/10"
            },
            { 
              title: "Calories Today", 
              value: 1847, 
              suffix: " kcal", 
              icon: <Zap className="w-8 h-8" />, 
              color: "from-orange-500 to-red-500",
              bgColor: "bg-orange-500/10"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
              }}
              className={`${stat.bgColor} backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden cursor-pointer`}
            >
              {/* Animated background gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20`}
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">{stat.title}</p>
                  <div className="flex items-baseline">
                    <CountUp
                      end={stat.value}
                      duration={2}
                      decimals={stat.title === "Current Weight" ? 1 : 0}
                      decimal="."
                      suffix={stat.suffix}
                      className="text-3xl font-bold text-white"
                    />
                  </div>
                </div>
                <motion.div 
                  className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl text-white`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {stat.icon}
                </motion.div>
              </div>
              
              {/* Progress bar for visual enhancement */}
              <motion.div 
                className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                  transition={{ delay: index * 0.2 + 1, duration: 1.5, ease: "easeOut" }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Enhanced Profile & Goals */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <User className="text-white w-8 h-8" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                  <p className="text-gray-400 capitalize">{user?.goal} Journey</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    title: "Height", 
                    value: `${user?.height} cm`, 
                    icon: <Ruler className="w-5 h-5" />, 
                    color: "text-purple-400" 
                  },
                  { 
                    title: "Activity Level", 
                    value: user?.activityLevel, 
                    icon: <Activity className="w-5 h-5" />, 
                    color: "text-green-400" 
                  },
                  { 
                    title: "Diet Preference", 
                    value: user?.dietPreference, 
                    icon: <Utensils className="w-5 h-5" />, 
                    color: "text-yellow-400" 
                  },
                  { 
                    title: "Experience", 
                    value: user?.fitnessExperience, 
                    icon: <Trophy className="w-5 h-5" />, 
                    color: "text-blue-400" 
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="flex items-center p-3 rounded-xl transition-all duration-300"
                  >
                    <div className={`mr-3 ${item.color}`}>{item.icon}</div>
                    <div>
                      <p className="text-gray-400 text-xs">{item.title}</p>
                      <p className="text-white font-medium capitalize">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Enhanced Goal Progress */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Target className="mr-2 text-green-400" />
                Your Goal Progress
              </h3>
              <div className="relative">
                <div className="w-32 h-32 mx-auto mb-6">
                  <CircularProgressbar 
                    value={68} 
                    text={`68%`}
                    styles={buildStyles({
                      textSize: '20px',
                      pathColor: '#10B981',
                      textColor: '#fff',
                      trailColor: '#374151',
                      pathTransitionDuration: 2,
                    })}
                  />
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 p-4 rounded-xl text-center border border-green-500/20">
                  <h4 className="text-lg font-bold text-white mb-2 capitalize">{user?.goal}</h4>
                  <p className="text-gray-300 text-sm">You're making incredible progress! Keep pushing forward.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    Update Goal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Center & Right Columns - Enhanced Charts */}
          <div className="xl:col-span-2 space-y-6">
            {/* Weekly Progress Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <BarChart className="mr-2 text-purple-400" />
                  Weekly Progress
                </h3>
                <select 
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 text-sm"
                >
                  <option value="week" className="bg-gray-800">This Week</option>
                  <option value="month" className="bg-gray-800">This Month</option>
                  <option value="year" className="bg-gray-800">This Year</option>
                </select>
              </div>
              <div className="h-64">
                <Bar 
                  data={weeklyProgress} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#fff' }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: '#9CA3AF' },
                        grid: { color: 'rgba(156, 163, 175, 0.1)' }
                      },
                      y: {
                        ticks: { color: '#9CA3AF' },
                        grid: { color: 'rgba(156, 163, 175, 0.1)' }
                      }
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Progress Line Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="mr-2 text-red-400" />
                Weight Progress Trend
              </h3>
              <div className="h-64">
                <Line 
                  data={progressLineData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        labels: { color: '#fff' }
                      }
                    },
                    scales: {
                      x: {
                        ticks: { color: '#9CA3AF' },
                        grid: { color: 'rgba(156, 163, 175, 0.1)' }
                      },
                      y: {
                        ticks: { color: '#9CA3AF' },
                        grid: { color: 'rgba(156, 163, 175, 0.1)' }
                      }
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Today's Schedule */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Calendar className="mr-2 text-blue-400" />
                  Today's Plan
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Start Workout
                </motion.button>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    time: "07:00 AM", 
                    title: "Morning Cardio", 
                    status: "completed", 
                    icon: <HeartPulse className="w-5 h-5" />, 
                    color: "green" 
                  },
                  {
                    time: "12:30 PM", 
                    title: "Protein-Rich Lunch", 
                    status: "completed", 
                    icon: <Utensils className="w-5 h-5" />, 
                    color: "green" 
                  },
                  {
                    time: "06:00 PM", 
                    title: "Strength Training", 
                    status: "upcoming", 
                    icon: <Dumbbell className="w-5 h-5" />, 
                    color: "blue" 
                  },
                  {
                    time: "08:30 PM", 
                    title: "Recovery Meal", 
                    status: "upcoming", 
                    icon: <Utensils className="w-5 h-5" />, 
                    color: "blue" 
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="flex items-center p-4 rounded-xl transition-all duration-300 border border-white/5"
                  >
                    <motion.div 
                      className={`mr-4 p-3 rounded-xl ${
                        item.color === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="flex-grow">
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gray-400 text-sm">{item.time}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      item.status === "completed" 
                        ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {item.status === "completed" ? "✓ Completed" : "⏰ Upcoming"}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;