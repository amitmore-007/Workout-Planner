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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const navigate = useNavigate();

  const filters = [
    { id: 'all', label: 'All Plans', icon: Filter },
    { id: 'Weight Loss', label: 'Weight Loss', icon: Target },
    { id: 'Muscle Gain', label: 'Muscle Gain', icon: Users },
    { id: 'Strength', label: 'Strength', icon: Target },
    { id: 'Beginner', label: 'Beginner', icon: Users },
    { id: 'Advanced', label: 'Advanced', icon: Target }
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

  const checkAuthStatus = () => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    return loggedIn;
  };

  const matchPlansToUser = (plans, user = {}) => {
    return plans.filter(plan => {
      const userGoal = user?.goal?.toLowerCase() || '';
      const userLevel = user?.fitnessExperience?.toLowerCase() || '';
      
      const goalMatch = userGoal 
        ? plan.goal.toLowerCase().includes(userGoal)
        : true;
      
      const levelMatch = userLevel
        ? plan.difficulty.toLowerCase() === userLevel
        : true;
      
      return goalMatch && levelMatch;
    }).slice(0, 3);
  };

  useEffect(() => {
    const isAuthenticated = checkAuthStatus();
    fetchPublishedPlans();
    if (isAuthenticated) {
      fetchUserPurchases();
    }
  }, []);

  const fetchPublishedPlans = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (activeFilter !== 'all') {
        if (['Weight Loss', 'Muscle Gain', 'Strength'].includes(activeFilter)) {
          queryParams.append('goal', activeFilter);
        } else if (['Beginner', 'Intermediate', 'Advanced'].includes(activeFilter)) {
          queryParams.append('difficulty', activeFilter);
        }
      }

      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/workoutPlans/public?${queryParams}`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
        const personalized = matchPlansToUser(data, userData || {});
        setPersonalizedPlans(personalized);
        setFilteredPlans(data);
      } else {
        console.error('Failed to fetch workout plans:', response.status);
      }
    } catch (error) {
      console.error('Error fetching workout plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPurchases = async () => {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const purchased = new Set(userData.purchasedWorkoutPlans?.map(p => p.planId) || []);
        setPurchasedPlans(purchased);
        setIsLoggedIn(true);
      } else if (response.status === 401) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      setIsLoggedIn(false);
    }
  };

  const handleFilter = (filterId) => {
    setActiveFilter(filterId);
    fetchPublishedPlans();
  };

  const handlePlanAccess = async (plan) => {
    if (purchasedPlans.has(plan._id) || plan.planType === 'regular') {
      await openPlanDetails(plan);
    } else {
      setSelectedPlan(plan);
      setShowPurchaseModal(true);
    }
  };

  const openPlanDetails = async (plan) => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5000/api/workoutPlans/public/${plan._id}`, {
        headers
      });

      if (response.ok) {
        const detailedPlan = await response.json();
        setSelectedPlan(detailedPlan);
        setShowPlanContent(true);
      } else {
        alert('Failed to load plan details');
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
      alert('Failed to load plan details');
    }
  };

  const handlePurchase = async () => {
    setPaymentProcessing(true);
    
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to purchase this plan');
        setPaymentProcessing(false);
        setShowPurchaseModal(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/workoutPlans/${selectedPlan._id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setPurchasedPlans(prev => new Set([...prev, selectedPlan._id]));
        setPaymentProcessing(false);
        setShowPurchaseModal(false);
        alert('Workout plan purchased successfully!');
        
        setTimeout(() => {
          setShowPlanContent(true);
        }, 500);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to purchase workout plan');
        setPaymentProcessing(false);
      }
    } catch (error) {
      console.error('Error purchasing workout plan:', error);
      alert('Failed to purchase workout plan. Please try again.');
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
            <span className="text-gray-400 line-through">${selectedPlan?.originalPrice || selectedPlan?.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600 font-semibold">
              -${((selectedPlan?.originalPrice || selectedPlan?.price) - selectedPlan?.price).toFixed(2)}
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

  const PlanContentModal = () => {
    const getPersonalizedTips = () => {
      if (!selectedPlan || !userData) return null;
      
      const tips = [];
      
      if (userData.dietPreference === 'veg') {
        tips.push(`As a vegetarian, focus on plant-based proteins like lentils and quinoa to support your ${selectedPlan.goal} goals.`);
      } else if (userData.dietPreference === 'non-veg') {
        tips.push(`With your non-vegetarian diet, lean meats and fish will help you achieve ${selectedPlan.goal}.`);
      }
      
      if (userData.activityLevel === 'sedentary') {
        tips.push(`Since you're currently sedentary, start slowly and gradually increase intensity.`);
      }
      
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

          {/* Weekly Schedule */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Schedule</h3>
            <div className="space-y-3">
              {Object.entries(selectedPlan?.weeklyPlan || {}).map(([day, exercises]) => (
                <div key={day} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                  <span className="font-semibold text-gray-700 capitalize">{day}</span>
                  <span className="text-sm text-gray-600">
                    {Array.isArray(exercises) ? exercises.join(', ') : exercises}
                  </span>
                </div>
              ))}
            </div>
          </div>

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

  useEffect(() => {
    fetchPublishedPlans();
  }, [activeFilter]);

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
              {personalizedPlans.map(plan => (
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
                  {plan.image ? (
                    <img
                      src={plan.image}
                      alt={plan.planName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <Dumbbell className="w-16 h-16 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  
                  {/* Difficulty Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-white text-sm font-semibold ${getDifficultyColor(plan.difficulty)}`}>
                    {plan.difficulty}
                  </div>
                  
                  {/* Video Preview */}
                  {plan.videoPreview && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                      <Play size={14} />
                      Preview
                    </div>
                  )}

                  {/* Price Badge */}
                  {plan.planType === 'premium' && (
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold">
                      ${plan.price}
                    </div>
                  )}
                  {plan.planType === 'regular' && (
                    <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full font-bold">
                      FREE
                    </div>
                  )}
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

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500 fill-current" size={18} />
                        <span className="font-semibold text-gray-800">{plan.avgRating || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="text-blue-500" size={18} />
                        <span className="font-semibold text-gray-800">{plan.totalPurchases || 0}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlanAccess(plan)}
                      className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        purchasedPlans.has(plan._id) || plan.planType === 'regular'
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                      }`}
                    >
                      {purchasedPlans.has(plan._id) || plan.planType === 'regular' ? (
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