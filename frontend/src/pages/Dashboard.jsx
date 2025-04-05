// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Activity,
//   Calendar,
//   ChevronRight,
//   Dumbbell,
//   Flame,
//   Heart,
//   LineChart,
//   Apple,
//   User,
//   Clock,
//   Plus,
//   BarChart4,
//   ChevronDown,
//   Utensils,
//   ArrowRight,
//   Award
// } from "lucide-react";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [userData, setUserData] = useState({
//     name: "John Doe",
//     goal: "weight loss",
//     weight: 78,
//     height: 178,
//     activityLevel: "moderately active",
//     dietPreference: "vegan",
//     fitnessExperience: "intermediate",
//     progress: 68
//   });
  
//   // Demo data for charts and statistics
//   const [stats, setStats] = useState({
//     calories: { current: 1850, target: 2200 },
//     workouts: { completed: 12, target: 20 },
//     water: { current: 1.8, target: 3 },
//     steps: { current: 8546, target: 10000 }
//   });
  
//   const [selectedTab, setSelectedTab] = useState('overview');
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     // Simulate loading user data
//     setTimeout(() => {
//       setLoading(false);
//     }, 1000);
    
//     // In a real app, you would fetch user data here
//     // Example:
//     // const fetchUserData = async () => {
//     //   try {
//     //     const token = localStorage.getItem("token");
//     //     const response = await axios.get("http://localhost:5000/api/users/profile", {
//     //       headers: { Authorization: `Bearer ${token}` }
//     //     });
//     //     setUserData(response.data);
//     //     setLoading(false);
//     //   } catch (error) {
//     //     console.error("Failed to fetch user data:", error);
//     //     navigate("/login");
//     //   }
//     // };
//     // fetchUserData();
//   }, [navigate]);
  
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };
  
//   // Calculate days until goal based on weight loss/gain rate
//   const daysUntilGoal = () => {
//     if (userData.goal === "weight loss") {
//       return Math.round((userData.weight - 70) / 0.5) * 7; // Assuming 0.5kg loss per week
//     } else if (userData.goal === "weight gain") {
//       return Math.round((85 - userData.weight) / 0.3) * 7; // Assuming 0.3kg gain per week
//     }
//     return 0;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
//         <div className="flex flex-col items-center">
//           <Activity className="text-green-400 w-12 h-12 animate-pulse" />
//           <p className="mt-4 text-white text-lg">Loading your fitness journey...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
//       {/* Header */}
//       <header className="bg-white/10 backdrop-blur-lg border-b border-white/10">
//         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center">
//             <Activity className="text-green-400 w-8 h-8 mr-2" />
//             <h1 className="text-2xl font-bold text-white">FitRevolution</h1>
//           </div>
          
//           {/* Navigation */}
//           <nav className="hidden md:flex space-x-6">
//             <button 
//               onClick={() => setSelectedTab('overview')}
//               className={`text-white/80 hover:text-white transition-colors ${selectedTab === 'overview' ? 'text-green-400 font-medium' : ''}`}
//             >
//               Overview
//             </button>
//             <button 
//               onClick={() => setSelectedTab('workouts')}
//               className={`text-white/80 hover:text-white transition-colors ${selectedTab === 'workouts' ? 'text-green-400 font-medium' : ''}`}
//             >
//               Workouts
//             </button>
//             <button 
//               onClick={() => setSelectedTab('nutrition')}
//               className={`text-white/80 hover:text-white transition-colors ${selectedTab === 'nutrition' ? 'text-green-400 font-medium' : ''}`}
//             >
//               Nutrition
//             </button>
//             <button 
//               onClick={() => setSelectedTab('progress')}
//               className={`text-white/80 hover:text-white transition-colors ${selectedTab === 'progress' ? 'text-green-400 font-medium' : ''}`}
//             >
//               Progress
//             </button>
//           </nav>
          
//           {/* User menu */}
//           <div className="flex items-center space-x-4">
//             <div className="relative group">
//               <button className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 rounded-full py-2 px-4 transition-all">
//                 <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center">
//                   <User className="text-green-400 w-5 h-5" />
//                 </div>
//                 <span className="text-white hidden sm:inline">{userData.name}</span>
//                 <ChevronDown className="w-4 h-4 text-white/70" />
//               </button>
              
//               <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
//                 <div className="py-2">
//                   <button className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors">
//                     Profile Settings
//                   </button>
//                   <button 
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
      
//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Welcome Section */}
//         <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Welcome back, {userData.name.split(' ')[0]}!</h1>
//             <p className="text-white/70 mt-1">
//               Your journey to {userData.goal === "weight loss" ? "lose weight" : userData.goal === "weight gain" ? "gain weight" : "maintain fitness"} continues. Keep up the good work!
//             </p>
//           </div>
          
//           <div className="mt-4 md:mt-0 flex space-x-4">
//             <button className="bg-green-400 hover:bg-green-500 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center transition-colors">
//               <Calendar className="w-5 h-5 mr-2" />
//               Today's Plan
//             </button>
//             <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg flex items-center transition-colors">
//               <Plus className="w-5 h-5 mr-2" />
//               Track Progress
//             </button>
//           </div>
//         </div>
        
//         {/* Progress Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           {/* Progress Card */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 flex flex-col h-full">
//             <div className="flex justify-between items-start mb-4">
//               <div>
//                 <h2 className="text-xl font-semibold text-white">Goal Progress</h2>
//                 <p className="text-white/70">
//                   {userData.goal === "weight loss" ? "Weight Loss Journey" : 
//                    userData.goal === "weight gain" ? "Weight Gain Journey" : 
//                    "Fitness Maintenance"}
//                 </p>
//               </div>
//               <div className="bg-green-400/20 p-2 rounded-lg">
//                 <Award className="text-green-400 w-6 h-6" />
//               </div>
//             </div>
            
//             <div className="relative pt-4">
//               <div className="flex justify-between mb-2">
//                 <span className="text-white/70">Progress</span>
//                 <span className="text-white font-medium">{userData.progress}%</span>
//               </div>
//               <div className="w-full bg-white/20 rounded-full h-2.5">
//                 <div 
//                   className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" 
//                   style={{ width: `${userData.progress}%` }}
//                 ></div>
//               </div>
//             </div>
            
//             <div className="mt-6 flex items-center justify-between text-white/70">
//               <div>
//                 <p className="text-sm">Estimated time to goal</p>
//                 <p className="text-xl font-semibold text-white">{daysUntilGoal()} days</p>
//               </div>
//               <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all">
//                 <ArrowRight className="w-5 h-5 text-white" />
//               </button>
//             </div>
//           </div>
          
//           {/* Stats Summary Card */}
//           <div className="md:col-span-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-white">Today's Summary</h2>
//               <div className="bg-white/10 rounded-lg px-3 py-1 text-white/70 text-sm flex items-center">
//                 <Clock className="w-4 h-4 mr-1" />
//                 Updated just now
//               </div>
//             </div>
            
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {/* Calories */}
//               <div className="bg-white/5 rounded-lg p-4 flex flex-col">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-white/70 text-sm">Calories</span>
//                   <Flame className="text-orange-400 w-5 h-5" />
//                 </div>
//                 <div className="mt-2">
//                   <span className="text-2xl font-bold text-white">{stats.calories.current}</span>
//                   <span className="text-white/50 text-sm ml-1">/ {stats.calories.target}</span>
//                 </div>
//                 <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
//                   <div 
//                     className="bg-orange-400 h-1.5 rounded-full" 
//                     style={{ width: `${(stats.calories.current / stats.calories.target) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
              
//               {/* Workouts */}
//               <div className="bg-white/5 rounded-lg p-4 flex flex-col">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-white/70 text-sm">Workouts</span>
//                   <Dumbbell className="text-purple-400 w-5 h-5" />
//                 </div>
//                 <div className="mt-2">
//                   <span className="text-2xl font-bold text-white">{stats.workouts.completed}</span>
//                   <span className="text-white/50 text-sm ml-1">/ {stats.workouts.target}</span>
//                 </div>
//                 <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
//                   <div 
//                     className="bg-purple-400 h-1.5 rounded-full" 
//                     style={{ width: `${(stats.workouts.completed / stats.workouts.target) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
              
//               {/* Water Intake */}
//               <div className="bg-white/5 rounded-lg p-4 flex flex-col">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-white/70 text-sm">Water (L)</span>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
//                   </svg>
//                 </div>
//                 <div className="mt-2">
//                   <span className="text-2xl font-bold text-white">{stats.water.current}</span>
//                   <span className="text-white/50 text-sm ml-1">/ {stats.water.target}</span>
//                 </div>
//                 <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
//                   <div 
//                     className="bg-blue-400 h-1.5 rounded-full" 
//                     style={{ width: `${(stats.water.current / stats.water.target) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
              
//               {/* Steps */}
//               <div className="bg-white/5 rounded-lg p-4 flex flex-col">
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-white/70 text-sm">Steps</span>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
//                   </svg>
//                 </div>
//                 <div className="mt-2">
//                   <span className="text-2xl font-bold text-white">{stats.steps.current.toLocaleString()}</span>
//                   <span className="text-white/50 text-sm ml-1">/ {stats.steps.target.toLocaleString()}</span>
//                 </div>
//                 <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
//                   <div 
//                     className="bg-green-400 h-1.5 rounded-full" 
//                     style={{ width: `${(stats.steps.current / stats.steps.target) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Workout Plan and Nutrition Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* Workout Plan */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 flex flex-col h-full">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-white flex items-center">
//                 <Dumbbell className="w-5 h-5 mr-2 text-purple-400" />
//                 Today's Workout
//               </h2>
//               <button className="text-green-400 hover:text-green-300 transition-colors">
//                 View All
//               </button>
//             </div>
            
//             <div className="space-y-4 flex-grow">
//               <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="bg-purple-400/20 p-3 rounded-lg mr-4">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-white">Cardio Blast</h3>
//                     <p className="text-white/70 text-sm">30 mins • 350 cal burn</p>
//                   </div>
//                 </div>
//                 <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all">
//                   <ChevronRight className="w-5 h-5 text-white" />
//                 </button>
//               </div>
              
//               <div className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
//                 <div className="flex items-center">
//                   <div className="bg-blue-400/20 p-3 rounded-lg mr-4">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
//                     </svg>
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-white">Upper Body Strength</h3>
//                     <p className="text-white/70 text-sm">45 mins • 4 exercises</p>
//                   </div>
//                 </div>
//                 <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-all">
//                   <ChevronRight className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//             </div>
            
//             <button className="mt-6 w-full bg-gradient-to-r from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-all transform hover:-translate-y-1 hover:shadow-lg">
//               <Dumbbell className="w-5 h-5 mr-2" />
//               Start Workout
//             </button>
//           </div>
          
//           {/* Nutrition Plan */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 flex flex-col h-full">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-white flex items-center">
//                 <Apple className="w-5 h-5 mr-2 text-green-400" />
//                 Meal Plan
//               </h2>
//               <button className="text-green-400 hover:text-green-300 transition-colors">
//                 View Full Plan
//               </button>
//             </div>
            
//             <div className="space-y-4 flex-grow">
//               <div className="bg-white/5 rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-medium text-white">Breakfast</h3>
//                   <span className="text-white/50 text-sm">8:00 AM • 450 cal</span>
//                 </div>
//                 <p className="text-white/70">
//                   {userData.dietPreference === "vegan" 
//                     ? "Avocado toast with coconut yogurt and berries" 
//                     : userData.dietPreference === "keto" 
//                     ? "Egg and avocado bowl with spinach" 
//                     : "Oatmeal with fruits and nuts"}
//                 </p>
//               </div>
              
//               <div className="bg-white/5 rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-medium text-white">Lunch</h3>
//                   <span className="text-white/50 text-sm">1:00 PM • 650 cal</span>
//                 </div>
//                 <p className="text-white/70">
//                   {userData.dietPreference === "vegan" 
//                     ? "Quinoa bowl with roasted vegetables and tahini" 
//                     : userData.dietPreference === "keto" 
//                     ? "Chicken salad with feta and olive oil dressing" 
//                     : "Grilled chicken with sweet potatoes and vegetables"}
//                 </p>
//               </div>
              
//               <div className="bg-white/5 rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-medium text-white">Dinner</h3>
//                   <span className="text-white/50 text-sm">7:00 PM • 550 cal</span>
//                 </div>
//                 <p className="text-white/70">
//                   {userData.dietPreference === "vegan" 
//                     ? "Lentil curry with brown rice and vegetables" 
//                     : userData.dietPreference === "keto" 
//                     ? "Baked salmon with asparagus and cauliflower rice" 
//                     : "Grilled fish with quinoa and roasted vegetables"}
//                 </p>
//               </div>
//             </div>
            
//             <button className="mt-6 w-full bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-medium py-3 rounded-lg flex items-center justify-center transition-all transform hover:-translate-y-1 hover:shadow-lg">
//               <Utensils className="w-5 h-5 mr-2" />
//               View Recipes
//             </button>
//           </div>
//         </div>
        
//         {/* Upcoming and Progress Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Upcoming */}
//           <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-white flex items-center">
//                 <Calendar className="w-5 h-5 mr-2 text-blue-400" />
//                 Upcoming
//               </h2>
//               <button className="text-green-400 hover:text-green-300 transition-colors text-sm">
//                 View Calendar
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               <div className="flex items-center p-3 bg-white/5 rounded-lg">
//                 <div className="w-12 h-12 rounded-lg bg-purple-400/20 flex items-center justify-center mr-4">
//                   <span className="text-lg font-bold text-purple-400">22</span>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-white">Personal Training</h3>
//                   <p className="text-white/70 text-sm">Tomorrow • 10:00 AM</p>
//                 </div>
//               </div>
              
//               <div className="flex items-center p-3 bg-white/5 rounded-lg">
//                 <div className="w-12 h-12 rounded-lg bg-orange-400/20 flex items-center justify-center mr-4">
//                   <span className="text-lg font-bold text-orange-400">25</span>
//                 </div>
//                 <div>
//                   <h3 className="font-medium text-white">Weekly Weigh-in</h3>
//                   <p className="text-white/70 text-sm">Saturday • 8:00 AM</p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Progress Metrics */}
//           <div className="md:col-span-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold text-white flex items-center">
//                 <LineChart className="w-5 h-5 mr-2 text-green-400" />
//                 Your Progress
//               </h2>
//               <select className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 text-sm">
//                 <option value="week" className="bg-gray-800">This Week</option>
//                 <option value="month" className="bg-gray-800">This Month</option>
//                 <option value="year" className="bg-gray-800">This Year</option>
//               </select>
//             </div>
            
//             <div className="h-48 flex items-end justify-between px-2">
//               {/* Simplified chart - In a real app, use a proper chart library */}
//               {Array.from({ length: 7 }).map((_, i) => {
//                 const height = Math.random() * 80 + 20;
//                 return (
//                   <div key={i} className="flex flex-col items-center">
//                     <div 
//                       className="w-8 bg-gradient-to-t from-green-400 to-blue-500 rounded-t-md"
//                       style={{ height: `${height}%` }}
//                     ></div>
//                     <span className="text-white/70 text-xs mt-2">
//                       {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>
            
//             <div className="grid grid-cols-3 gap-4 mt-6">
//               <div className="bg-white/5 p-3 rounded-lg text-center">
//                 <p className="text-white/70 text-sm">Avg. Calories</p>
//                 <p className="text-xl font-bold text-white mt-1">1,920</p>
//               </div>
//               <div className="bg-white/5 p-3 rounded-lg text-center">
//                 <p className="text-white/70 text-sm">Workouts</p>
//                 <p className="text-xl font-bold text-white mt-1">5/7</p>
//               </div>
//               <div className="bg-white/5 p-3 rounded-lg text-center">
//                 <p className="text-white/70 text-sm">Weight Change</p>
//                 <p className="text-xl font-bold text-green-400 mt-1">-0.5 kg</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { Activity, User, Ruler, Weight, HeartPulse, Dumbbell, Utensils, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import confetti from "canvas-confetti";
import { useSpring, animated } from "@react-spring/web";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  // Animation for the welcome message
  const fadeIn = useSpring({
    opacity: showWelcome ? 1 : 0,
    transform: showWelcome ? "translateY(0)" : "translateY(-50px)",
    config: { tension: 280, friction: 60 },
  });

  // Animation for the card hover
  const getCardAnimation = (index) => useSpring({
    scale: selectedCard === index ? 1.05 : 1,
    boxShadow: selectedCard === index 
      ? "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" 
      : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    config: { tension: 300, friction: 40 },
  });

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
            origin: { y: 0.6 }
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

  // Mock data for goal progress chart
  const goalProgressData = {
    labels: ['Progress', 'Remaining'],
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ['#10B981', '#1F2937'],
        borderWidth: 0,
      },
    ],
  };

  // Mock data for workout consistency
  const workoutData = {
    labels: ['Completed', 'Missed'],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ['#8B5CF6', '#1F2937'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="text-green-400 w-16 h-16" />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-white text-xl font-medium"
        >
          Preparing your fitness dashboard...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-grow p-6 transition-all duration-300 ${sidebarOpen ? "ml-10" : "ml-4"}`}>
        {/* Toggle Sidebar Button with animation */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-all fixed top-6 left-6 z-20"
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        {/* Welcome Header with animation */}
        <animated.div style={fadeIn} className="mb-12 mt-6">
          <motion.h2 
            className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500"
          >
            Welcome back, {user?.name}!
          </motion.h2>
          <p className="text-center text-gray-400">Let's crush your fitness goals today</p>
        </animated.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Weight */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 rounded-xl shadow-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-200 text-sm font-medium">Current Weight</p>
                <div className="flex items-baseline">
                  <CountUp
                    end={user?.weight || 0}
                    duration={2}
                    decimals={1}
                    decimal="."
                    suffix=" kg"
                    className="text-3xl font-bold text-white"
                  />
                </div>
              </div>
              <div className="bg-blue-800 p-3 rounded-lg">
                <Weight className="text-blue-200 w-8 h-8" />
              </div>
            </div>
          </motion.div>
          
          {/* Goal Progress */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-green-900 to-green-700 p-6 rounded-xl shadow-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-green-200 text-sm font-medium">Goal Progress</p>
                <CountUp
                  end={65}
                  duration={2}
                  suffix="%"
                  className="text-3xl font-bold text-white"
                />
              </div>
              <div className="bg-green-800 p-3 rounded-lg">
                <HeartPulse className="text-green-200 w-8 h-8" />
              </div>
            </div>
          </motion.div>
          
          {/* Workout Consistency */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-gradient-to-br from-purple-900 to-purple-700 p-6 rounded-xl shadow-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-purple-200 text-sm font-medium">Workout Consistency</p>
                <CountUp
                  end={80}
                  duration={2}
                  suffix="%"
                  className="text-3xl font-bold text-white"
                />
              </div>
              <div className="bg-purple-800 p-3 rounded-lg">
                <Dumbbell className="text-purple-200 w-8 h-8" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mx-auto">
          {/* Left Column - User Stats */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 p-6 rounded-xl shadow-xl mb-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Your Profile</h3>
              
              <div className="space-y-4">
                {[
                  { title: "Height", value: `${user?.height} cm`, icon: <Ruler className="text-purple-400 w-5 h-5" /> },
                  { title: "Activity Level", value: user?.activityLevel, icon: <Activity className="text-green-400 w-5 h-5" /> },
                  { title: "Diet Preference", value: user?.dietPreference, icon: <Utensils className="text-yellow-400 w-5 h-5" /> },
                  { title: "Experience", value: user?.fitnessExperience, icon: <User className="text-teal-400 w-5 h-5" /> },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center p-3 bg-gray-700 bg-opacity-40 rounded-lg"
                  >
                    <div className="mr-3">{item.icon}</div>
                    <div>
                      <p className="text-gray-400 text-xs">{item.title}</p>
                      <p className="text-white font-medium capitalize">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Goal Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800 p-6 rounded-xl shadow-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Your Goal</h3>
              <div className="bg-gradient-to-br from-blue-800 to-purple-800 p-4 rounded-lg text-center">
                <div className="w-24 h-24 mx-auto mb-3">
                  <CircularProgressbar 
                    value={65} 
                    text={`65%`}
                    styles={buildStyles({
                      textSize: '22px',
                      pathColor: '#10B981',
                      textColor: '#fff',
                      trailColor: '#374151',
                    })}
                  />
                </div>
                <h4 className="text-lg font-bold text-white">{user?.goal}</h4>
                <p className="text-gray-300 text-sm mt-1">Keep pushing! You're making great progress.</p>
              </div>
            </motion.div>
          </div>
          
          {/* Center Column - Charts & Analytics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl mb-6">
              <h3 className="text-xl font-semibold text-white mb-6">Your Fitness Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Goal Progress Chart */}
                <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg">
                  <h4 className="text-gray-300 text-sm mb-4">Goal Progress</h4>
                  <div className="h-48 relative">
                    <Doughnut data={goalProgressData} options={chartOptions} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl font-bold text-white">65%</p>
                    </div>
                  </div>
                </div>
                
                {/* Workout Consistency Chart */}
                <div className="bg-gray-700 bg-opacity-40 p-4 rounded-lg">
                  <h4 className="text-gray-300 text-sm mb-4">Workout Consistency</h4>
                  <div className="h-48 relative">
                    <Doughnut data={workoutData} options={chartOptions} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-3xl font-bold text-white">80%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                  { label: "Workouts This Week", value: "4/5", color: "text-blue-400" },
                  { label: "Calories Burned", value: "3,240", color: "text-red-400" },
                  { label: "Protein Goal", value: "85%", color: "text-green-400" },
                  { label: "Water Intake", value: "70%", color: "text-cyan-400" },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-700 bg-opacity-40 p-4 rounded-lg text-center"
                  >
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Today's Plan */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-gray-800 p-6 rounded-xl shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Today's Plan</h3>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                  Start Workout
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  { time: "07:00 AM", title: "Morning Cardio", status: "Completed", icon: <HeartPulse className="text-green-400 w-5 h-5" /> },
                  { time: "12:30 PM", title: "Protein-Rich Lunch", status: "Completed", icon: <Utensils className="text-green-400 w-5 h-5" /> },
                  { time: "06:00 PM", title: "Strength Training", status: "Upcoming", icon: <Dumbbell className="text-blue-400 w-5 h-5" /> },
                  { time: "08:30 PM", title: "Recovery Meal", status: "Upcoming", icon: <Utensils className="text-blue-400 w-5 h-5" /> },
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center p-3 bg-gray-700 bg-opacity-40 rounded-lg"
                  >
                    <div className="mr-3">{item.icon}</div>
                    <div className="flex-grow">
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gray-400 text-xs">{item.time}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      item.status === "Completed" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"
                    }`}>
                      {item.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
