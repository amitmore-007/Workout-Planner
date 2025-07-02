import React, { useState, useEffect } from 'react';
import { Heart, Star, Play, Clock, Target, Users, Filter, ChevronRight, X, CreditCard, Check, Lock, Dumbbell, Utensils, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const UserWorkoutPlan = ({ userData }) => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [personalizedPlans, setPersonalizedPlans] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purchasedPlans, setPurchasedPlans] = useState(new Set());
  const [showPlanContent, setShowPlanContent] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
 const [userPreferences, setUserPreferences] = useState({
  goals: [userData?.goal || 'General Fitness'],
  fitnessLevel: userData?.fitnessExperience || 'Beginner',
  timePerSession: 30,
  daysPerWeek: 3
});
  const navigate = useNavigate();

  // Sample workout plans data with pricing
  const workoutPlansData = [
    {
      _id: "1",
      creatorName: "Sarah Johnson",
      goal: "Weight Loss",
      planName: "Ultimate Fat Burning Challenge",
      description: "A comprehensive 12-week program designed to maximize fat burning through a combination of HIIT, strength training, and cardio. Perfect for those looking to shed pounds and build lean muscle simultaneously.",
      difficulty: "Intermediate",
      totalDuration: "12 weeks",
      tags: ["HIIT", "Cardio", "Fat Burning", "Full Body"],
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop",
      videoPreview: "2:30",
      price: 49.99,
      originalPrice: 79.99,
      weeklyPlan: {
        monday: ["HIIT Cardio - 30 mins", "Core Workout - 15 mins"],
        tuesday: ["Upper Body Strength - 45 mins"],
        wednesday: ["Active Recovery - Walking/Yoga"],
        thursday: ["Lower Body Strength - 45 mins"],
        friday: ["Full Body Circuit - 40 mins"],
        saturday: ["Cardio - 30 mins"],
        sunday: ["Rest Day"]
      },
      detailedContent: {
        exercises: [
          { name: "Burpees", sets: "3x15", duration: "45 sec work, 15 sec rest" },
          { name: "Mountain Climbers", sets: "3x20", duration: "30 sec work, 10 sec rest" },
          { name: "Jump Squats", sets: "4x12", duration: "40 sec work, 20 sec rest" }
        ],
        nutrition: "High protein, moderate carb diet with 5-6 small meals daily"
      },
      likes: 1247,
      ratings: [{ stars: 5 }, { stars: 4 }, { stars: 5 }],
      avgRating: 4.8,
      createdAt: "2024-01-15"
    },
    {
      _id: "2",
      creatorName: "Mike Chen",
      goal: "Muscle Gain",
      planName: "Beast Mode Muscle Builder",
      description: "An intensive muscle-building program focusing on progressive overload and compound movements. Designed for serious lifters who want to pack on serious muscle mass over 16 weeks.",
      difficulty: "Advanced",
      totalDuration: "16 weeks",
      tags: ["Strength", "Muscle Building", "Progressive Overload", "Compound"],
      image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&h=300&fit=crop",
      videoPreview: "3:15",
      price: 89.99,
      originalPrice: 129.99,
      weeklyPlan: {
        monday: ["Chest & Triceps - 60 mins"],
        tuesday: ["Back & Biceps - 60 mins"],
        wednesday: ["Legs - 75 mins"],
        thursday: ["Shoulders - 45 mins"],
        friday: ["Arms - 50 mins"],
        saturday: ["Full Body - 90 mins"],
        sunday: ["Rest Day"]
      },
      detailedContent: {
        exercises: [
          { name: "Bench Press", sets: "4x6-8", weight: "Progressive overload" },
          { name: "Deadlifts", sets: "3x5", weight: "80-85% 1RM" },
          { name: "Squats", sets: "4x6-8", weight: "Progressive overload" }
        ],
        nutrition: "Caloric surplus with 1.6-2.2g protein per kg body weight"
      },
      likes: 892,
      ratings: [{ stars: 5 }, { stars: 5 }, { stars: 4 }],
      avgRating: 4.9,
      createdAt: "2024-02-01"
    },
    {
      _id: "3",
      creatorName: "Emma Rodriguez",
      goal: "Strength",
      planName: "Power & Performance Program",
      description: "Build functional strength and athletic performance with this powerlifting-inspired program. Focus on the big three lifts while incorporating accessory work for balanced development.",
      difficulty: "Intermediate",
      totalDuration: "10 weeks",
      tags: ["Powerlifting", "Strength", "Functional", "Athletic"],
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop",
      videoPreview: "4:00",
      price: 69.99,
      originalPrice: 99.99,
      weeklyPlan: {
        monday: ["Squat Focus - 60 mins"],
        tuesday: ["Bench Press - 50 mins"],
        wednesday: ["Accessory Work - 45 mins"],
        thursday: ["Deadlift Focus - 60 mins"],
        friday: ["Olympic Lifts - 55 mins"],
        saturday: ["Conditioning - 30 mins"],
        sunday: ["Rest Day"]
      },
      detailedContent: {
        exercises: [
          { name: "Back Squat", sets: "5x3", weight: "85-90% 1RM" },
          { name: "Bench Press", sets: "5x3", weight: "85-90% 1RM" },
          { name: "Deadlift", sets: "5x3", weight: "85-90% 1RM" }
        ],
        nutrition: "Balanced macros with adequate carbs for performance"
      },
      likes: 634,
      ratings: [{ stars: 4 }, { stars: 5 }, { stars: 5 }],
      avgRating: 4.7,
      createdAt: "2024-01-28"
    },
    {
      _id: "4",
      creatorName: "Alex Thompson",
      goal: "General Fitness",
      planName: "Complete Beginner's Journey",
      description: "Perfect introduction to fitness for absolute beginners. Learn proper form, build a foundation of strength, and develop healthy habits that will last a lifetime.",
      difficulty: "Beginner",
      totalDuration: "8 weeks",
      tags: ["Beginner Friendly", "Form Focus", "Habit Building", "Foundation"],
      image: "https://images.unsplash.com/photo-1549476464-37392f717541?w=500&h=300&fit=crop",
      videoPreview: "2:45",
      price: 29.99,
      originalPrice: 49.99,
      weeklyPlan: {
        monday: ["Basic Movements - 30 mins"],
        tuesday: ["Cardio Introduction - 25 mins"],
        wednesday: ["Rest Day"],
        thursday: ["Strength Basics - 35 mins"],
        friday: ["Flexibility - 20 mins"],
        saturday: ["Light Activity - 20 mins"],
        sunday: ["Rest Day"]
      },
      detailedContent: {
        exercises: [
          { name: "Bodyweight Squats", sets: "3x10", progression: "Add 2 reps weekly" },
          { name: "Push-ups", sets: "3x8", progression: "Knee to full push-ups" },
          { name: "Plank", sets: "3x30sec", progression: "Add 10 seconds weekly" }
        ],
        nutrition: "Focus on whole foods and proper hydration"
      },
      likes: 2156,
      ratings: [{ stars: 5 }, { stars: 5 }, { stars: 4 }],
      avgRating: 4.9,
      createdAt: "2024-02-10"
    },
    {
      _id: "5",
      creatorName: "Lisa Park",
      goal: "Flexibility",
      planName: "Yoga Flow & Mobility",
      description: "Improve flexibility, balance, and mindfulness through daily yoga practice. This program combines traditional yoga flows with modern mobility work for optimal results.",
      difficulty: "Beginner",
      totalDuration: "6 weeks",
      tags: ["Yoga", "Flexibility", "Mindfulness", "Balance"],
      image: "https://images.unsplash.com/photo-1506629905607-46c4b3aedca2?w=500&h=300&fit=crop",
      videoPreview: "3:30",
      price: 39.99,
      originalPrice: 59.99,
      weeklyPlan: {
        monday: ["Morning Flow - 30 mins"],
        tuesday: ["Power Yoga - 45 mins"],
        wednesday: ["Restorative - 40 mins"],
        thursday: ["Vinyasa Flow - 50 mins"],
        friday: ["Yin Yoga - 60 mins"],
        saturday: ["Balance Focus - 35 mins"],
        sunday: ["Meditation - 20 mins"]
      },
      detailedContent: {
        exercises: [
          { name: "Sun Salutation", sets: "5 rounds", focus: "Flow and breathing" },
          { name: "Warrior Poses", sets: "Hold 1 min each", focus: "Strength and balance" },
          { name: "Deep Stretches", sets: "Hold 2-3 mins", focus: "Flexibility" }
        ],
        nutrition: "Anti-inflammatory foods and adequate hydration"
      },
      likes: 1888,
      ratings: [{ stars: 5 }, { stars: 4 }, { stars: 5 }],
      avgRating: 4.8,
      createdAt: "2024-01-20"
    },
    {
      _id: "6",
      creatorName: "David Kim",
      goal: "Endurance",
      planName: "Marathon Ready Training",
      description: "Comprehensive marathon training program that progressively builds your endurance and speed. Includes nutrition guidance and injury prevention strategies.",
      difficulty: "Advanced",
      totalDuration: "20 weeks",
      tags: ["Running", "Endurance", "Marathon", "Cardio"],
      image: "https://images.unsplash.com/photo-1544737151406-6adde7ad7a9e?w=500&h=300&fit=crop",
      videoPreview: "5:00",
      price: 99.99,
      originalPrice: 149.99,
      weeklyPlan: {
        monday: ["Easy Run - 45 mins"],
        tuesday: ["Speed Work - 60 mins"],
        wednesday: ["Cross Training - 40 mins"],
        thursday: ["Tempo Run - 50 mins"],
        friday: ["Rest Day"],
        saturday: ["Long Run - 2-3 hours"],
        sunday: ["Recovery - 30 mins easy"]
      },
      detailedContent: {
        exercises: [
          { name: "Interval Training", sets: "6x800m", pace: "5K race pace" },
          { name: "Long Runs", distance: "Progressive 10-20 miles", pace: "Conversational" },
          { name: "Tempo Runs", distance: "3-8 miles", pace: "Comfortably hard" }
        ],
        nutrition: "Carb loading strategies and electrolyte management"
      },
      likes: 756,
      ratings: [{ stars: 4 }, { stars: 5 }, { stars: 5 }],
      avgRating: 4.7,
      createdAt: "2024-01-05"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Plans', icon: Filter },
    { id: 'weight-loss', label: 'Weight Loss', icon: Target },
    { id: 'muscle-gain', label: 'Muscle Gain', icon: Users },
    { id: 'strength', label: 'Strength', icon: Target },
    { id: 'beginner', label: 'Beginner', icon: Users },
    { id: 'advanced', label: 'Advanced', icon: Target }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-emerald-500';
      case 'intermediate': return 'bg-amber-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getGoalGradient = (goal) => {
    const gradients = {
      'Weight Loss': 'from-pink-500 to-rose-500',
      'Muscle Gain': 'from-blue-500 to-cyan-500',
      'Strength': 'from-purple-500 to-indigo-500',
      'General Fitness': 'from-green-500 to-emerald-500',
      'Flexibility': 'from-orange-500 to-yellow-500',
      'Endurance': 'from-red-500 to-pink-500'
    };
    return gradients[goal] || 'from-gray-500 to-gray-600';
  };

  useEffect(() => {
    setTimeout(() => {
      setPlans(workoutPlansData);
      setFilteredPlans(workoutPlansData);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
   const fetchUserPlans = async () => {
  try {
    // Check if userData exists before making API call
    if (userData && userData._id) {
      const response = await axios.get(`/api/users/${userData._id}/plans`);
      setPurchasedPlans(new Set(response.data.purchasedPlans));
    }
    
    // Use sample data as fallback
    setTimeout(() => {
      setPlans(workoutPlansData);
      const personalized = matchPlansToUser(workoutPlansData, userData || {});
      setPersonalizedPlans(personalized);
      setFilteredPlans(personalized);
      setLoading(false);
    }, 1500);
  } catch (error) {
    console.error("Error fetching user plans:", error);
    // Fallback to sample data if API fails
    setPlans(workoutPlansData);
    const personalized = matchPlansToUser(workoutPlansData, userData || {});
    setPersonalizedPlans(personalized);
    setFilteredPlans(personalized);
    setLoading(false);
  }
};

    fetchUserPlans();
  }, [userData]);

 const matchPlansToUser = (plans, user = {}) => {
  return plans.filter(plan => {
    const userGoal = user?.goal?.toLowerCase() || '';
    const userLevel = user?.fitnessExperience?.toLowerCase() || '';
    
    // Match goal
    const goalMatch = userGoal 
      ? plan.goal.toLowerCase().includes(userGoal)
      : true;
    
    // Match fitness level
    const levelMatch = userLevel
      ? plan.difficulty.toLowerCase() === userLevel
      : true;
    
    return goalMatch && levelMatch;
  }).map(plan => ({
    ...plan,
    matchScore: calculateMatchScore(plan, user)
  })).sort((a, b) => b.matchScore - a.matchScore);
};

const calculateMatchScore = (plan, user = {}) => {
  let score = 0;
  const userGoal = user?.goal?.toLowerCase() || '';
  const userLevel = user?.fitnessExperience?.toLowerCase() || '';
  
  // Goal match
  if (userGoal && plan.goal.toLowerCase() === userGoal) score += 40;
  else if (userGoal && plan.goal.toLowerCase().includes(userGoal)) score += 30;
  
  // Level match
  if (userLevel && plan.difficulty.toLowerCase() === userLevel) score += 30;
  
  return score;
};

  const handleFilter = (filterId) => {
    setActiveFilter(filterId);
    
    if (filterId === 'all') {
      setFilteredPlans(plans);
    } else {
      const filtered = plans.filter(plan => {
        return plan.goal.toLowerCase().includes(filterId.toLowerCase()) ||
               plan.difficulty.toLowerCase().includes(filterId.toLowerCase()) ||
               plan.tags.some(tag => tag.toLowerCase().includes(filterId.toLowerCase()));
      });
      setFilteredPlans(filtered);
    }
  };

  const handlePlanAccess = async (plan) => {
    // Track plan view in backend
    try {
      // In a real app:
      await axios.post(`/api/users/${userData._id}/viewed-plans`, { planId: plan._id });
    } catch (error) {
      console.error("Error tracking plan view:", error);
    }

    if (purchasedPlans.has(plan._id)) {
      setSelectedPlan(plan);
      setShowPlanContent(true);
    } else {
      setSelectedPlan(plan);
      setShowPurchaseModal(true);
    }
  };

  const handlePurchase = async () => {
    setPaymentProcessing(true);
    
    try {
      // In a real app, you would call your backend:
      const response = await axios.post(`/api/users/${userData._id}/purchased-plans`, {
        planId: selectedPlan._id,
        amount: selectedPlan.price
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add plan to purchased plans
      setPurchasedPlans(prev => new Set([...prev, selectedPlan._id]));
      setPaymentProcessing(false);
      setShowPurchaseModal(false);
      
      // Show success and then plan content
      setTimeout(() => {
        setShowPlanContent(true);
      }, 500);
    } catch (error) {
      console.error("Purchase failed:", error);
      setPaymentProcessing(false);
    }
  };


  const PurchaseModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative transform transition-all duration-300 scale-100">
        <button
          onClick={() => setShowPurchaseModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-white" size={24} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Purchase Plan</h3>
          <p className="text-gray-600">Get access to {selectedPlan?.planName}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Original Price</span>
            <span className="text-gray-400 line-through">${selectedPlan?.originalPrice}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600 font-semibold">
              -${(selectedPlan?.originalPrice - selectedPlan?.price).toFixed(2)}
            </span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-purple-600">${selectedPlan?.price}</span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Check className="text-green-500 mr-2" size={16} />
            Lifetime access to all exercises
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Check className="text-green-500 mr-2" size={16} />
            Detailed workout schedules
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Check className="text-green-500 mr-2" size={16} />
            Nutrition guidelines included
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Check className="text-green-500 mr-2" size={16} />
            Progress tracking tools
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={paymentProcessing}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {paymentProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Purchase Now
            </>
          )}
        </button>
      </div>
    </div>
  );

  // const PlanContentModal = () => (
  //   <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  //     <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto p-6 relative">
  //       <button
  //         onClick={() => setShowPlanContent(false)}
  //         className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
  //       >
  //         <X size={24} />
  //       </button>
        
  //       <div className="mb-6">
  //         <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedPlan?.planName}</h2>
  //         <p className="text-gray-600">by {selectedPlan?.creatorName}</p>
  //       </div>

  //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //         {/* Weekly Schedule */}
  //         <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
  //           <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Schedule</h3>
  //           <div className="space-y-3">
  //             {Object.entries(selectedPlan?.weeklyPlan || {}).map(([day, exercises]) => (
  //               <div key={day} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
  //                 <span className="font-semibold text-gray-700 capitalize">{day}</span>
  //                 <span className="text-sm text-gray-600">{exercises.join(', ')}</span>
  //               </div>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Detailed Exercises */}
  //         <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
  //           <h3 className="text-xl font-bold text-gray-800 mb-4">Key Exercises</h3>
  //           <div className="space-y-4">
  //             {selectedPlan?.detailedContent?.exercises?.map((exercise, index) => (
  //               <div key={index} className="border-l-4 border-purple-500 pl-4">
  //                 <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
  //                 <p className="text-sm text-gray-600">{exercise.sets}</p>
  //                 <p className="text-xs text-gray-500">{exercise.duration || exercise.weight || exercise.pace || exercise.progression || exercise.focus}</p>
  //               </div>
  //             ))}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Nutrition Guidelines */}
  //       <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
  //         <h3 className="text-xl font-bold text-gray-800 mb-3">Nutrition Guidelines</h3>
  //         <p className="text-gray-700">{selectedPlan?.detailedContent?.nutrition}</p>
  //       </div>
  //     </div>
  //   </div>
  // );

  const PlanContentModal = () => {
    const getPersonalizedTips = () => {
      if (!selectedPlan || !userData) return null;
      
      const tips = [];
      
      // Nutrition tip based on diet preference
      if (userData.dietPreference === 'veg') {
        tips.push(`As a vegetarian, focus on plant-based proteins like lentils and quinoa to support your ${selectedPlan.goal} goals.`);
      } else if (userData.dietPreference === 'non-veg') {
        tips.push(`With your non-vegetarian diet, lean meats and fish will help you achieve ${selectedPlan.goal}.`);
      }
      
      // Activity level tip
      if (userData.activityLevel === 'sedentary') {
        tips.push(`Since you're currently sedentary, start slowly and gradually increase intensity.`);
      }
      
      // Weight-based tip
      if (userData.goal === 'weight loss' && userData.weight) {
        tips.push(`At your current weight, this plan will help create a sustainable calorie deficit.`);
      }
      
      return tips.length > 0 ? tips : null;
    };

    const personalizedTips = getPersonalizedTips();

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto p-6 relative">
          <button
            onClick={() => setShowPlanContent(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X size={24} />
          </button>
          
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedPlan?.planName}</h2>
            <p className="text-gray-600">by {selectedPlan?.creatorName}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedPlan?.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                selectedPlan?.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedPlan?.difficulty}
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {selectedPlan?.goal}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Schedule */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Schedule</h3>
              <div className="space-y-3">
                {Object.entries(selectedPlan?.weeklyPlan || {}).map(([day, exercises]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <span className="font-semibold text-gray-700 capitalize">{day}</span>
                    <span className="text-sm text-gray-600">{exercises.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Exercises */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Key Exercises</h3>
              <div className="space-y-4">
                {selectedPlan?.detailedContent?.exercises?.map((exercise, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                    <p className="text-sm text-gray-600">{exercise.sets}</p>
                    <p className="text-xs text-gray-500">{exercise.duration || exercise.weight || exercise.pace || exercise.progression || exercise.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nutrition Guidelines */}
          <div className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Nutrition Guidelines</h3>
            <p className="text-gray-700">{selectedPlan?.detailedContent?.nutrition}</p>
          </div>

          {/* Personalized Tips */}
          {personalizedTips && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-500 w-2 h-6 rounded-full mr-2"></span>
                Personalized Tips For You
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {personalizedTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Connect with Trainer */}
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Need Help?</h3>
            <p className="text-gray-700 mb-4">Get personalized guidance from our certified trainers.</p>
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              onClick={() => navigate('/trainers')}
            >
              Connect with a Trainer
            </button>
          </div>
        </div>
      </div>
    );
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-medium">Loading amazing workout plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Personalized Header */}
        <div className="text-center mb-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          {userData ? (
            <>
              <h1 className="text-4xl font-bold text-white mb-2">
                Welcome back, {userData.name.split(' ')[0]}!
              </h1>
              <p className="text-white/80 text-lg mb-4">
                Based on your {userData.fitnessExperience} level and {userData.goal} goals
              </p>
              
              <div className="flex justify-center gap-6 mt-6">
                <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 p-4 rounded-xl border border-pink-500/30">
                  <div className="text-2xl font-bold text-pink-400">{personalizedPlans.length}</div>
                  <div className="text-sm text-white/80">Recommended Plans</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-400">
                    {userData.activityLevel}
                  </div>
                  <div className="text-sm text-white/80">Activity Level</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 animate-pulse">
                FitPlan
              </h1>
              <p className="text-white/90 text-xl font-light">Transform Your Body with Premium Workout Plans</p>
            </>
          )}
        </div>

        {/* Personalized Recommendations */}
        {personalizedPlans.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 w-2 h-6 rounded-full mr-3"></span>
              Personalized For You
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedPlans.slice(0, 3).map(plan => (
                <div 
                  key={plan._id}
                  className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 shadow-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      plan.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                      plan.difficulty === 'Intermediate' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {plan.difficulty}
                    </span>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/80">
                      {Math.round((plan.matchScore / 100) * 100)}% Match
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{plan.planName}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-2">{plan.description}</p>
                  
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-white/50 text-sm">{plan.totalDuration}</span>
                    <button 
                      onClick={() => handlePlanAccess(plan)}
                      className="flex items-center gap-1 text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-all"
                    >
                      View Details <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Plans Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 w-2 h-6 rounded-full mr-3"></span>
            All Workout Plans
          </h2>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {filters.map(filter => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilter(filter.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-lg border ${
                    activeFilter === filter.id
                      ? 'bg-white/30 text-white border-white/40 shadow-lg scale-105'
                      : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:scale-105'
                  }`}
                >
                  <Icon size={18} />
                  {filter.label}
                </button>
              );
            })}
          </div>
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPlans.map(plan => (
            <div
              key={plan._id}
              className="bg-white/95 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-white/20 group"
            >
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plan.image}
                  alt={plan.planName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Difficulty Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyColor(plan.difficulty)}`}>
                  {plan.difficulty}
                </div>
                
                {/* Video Preview */}
                {plan.videoPreview && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    <Play size={14} />
                    {plan.videoPreview}
                  </div>
                )}

                {/* Price Badge */}
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold">
                  ${plan.price}
                  {plan.originalPrice && (
                    <span className="ml-2 text-xs line-through opacity-70">${plan.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{plan.planName}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {plan.creatorName}</p>
                  <div className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${getGoalGradient(plan.goal)}`}>
                    {plan.goal}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">{plan.description}</p>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock size={16} className="text-purple-600" />
                      <span className="text-xs text-gray-600 font-medium">DURATION</span>
                    </div>
                    <p className="font-bold text-gray-800">{plan.totalDuration}</p>
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target size={16} className="text-pink-600" />
                      <span className="text-xs text-gray-600 font-medium">LEVEL</span>
                    </div>
                    <p className="font-bold text-gray-800">{plan.difficulty}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                  {plan.tags.length > 3 && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium">
                      +{plan.tags.length - 3} more
                    </span>
                  )}
                </div>

                {/* Weekly Schedule Preview */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 text-center">Weekly Schedule</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {Object.entries(plan.weeklyPlan).map(([day, exercises]) => (
                      <div
                        key={day}
                        className={`text-center p-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                          exercises.length > 0 && exercises[0] !== 'Rest Day'
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {day.slice(0, 3).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500 fill-current" size={18} />
                      <span className="font-semibold text-gray-800">{plan.avgRating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="text-red-500 fill-current" size={18} />
                      <span className="font-semibold text-gray-800">{plan.likes.toLocaleString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePlanAccess(plan)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      purchasedPlans.has(plan._id)
                        ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    }`}
                  >
                    {purchasedPlans.has(plan._id) ? (
                      <>
                        <Check size={16} />
                        View Plan
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Get Access
                      </>
                    )}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlans.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-white/60 text-xl mb-4">No workout plans found</div>
            <p className="text-white/40">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
      </div>

      {/* Modals */}
      {showPurchaseModal && <PurchaseModal />}
      {showPlanContent && <PlanContentModal />}
    </div>
  );
};

export default UserWorkoutPlan;