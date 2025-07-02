import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Utensils, Flame, Zap, Calendar, User, Heart, Share2, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

const DietPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [expandedMeals, setExpandedMeals] = useState({
    breakfast: true,
    lunch: true,
    dinner: true,
    snacks: {}
  });

  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const response = await axios.get(`/api/diet-plans/${id}`);
        setDietPlan(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch diet plan');
        setLoading(false);
      }
    };

    fetchDietPlan();
  }, [id]);

  const toggleMealExpansion = (mealType, snackIndex = null) => {
    if (snackIndex !== null) {
      setExpandedMeals(prev => ({
        ...prev,
        snacks: {
          ...prev.snacks,
          [snackIndex]: !prev.snacks[snackIndex]
        }
      }));
    } else {
      setExpandedMeals(prev => ({
        ...prev,
        [mealType]: !prev[mealType]
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => navigate('/diet-plans')}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Diet Plans
        </button>
      </div>
    );
  }

  if (!dietPlan) return null;

  const currentDayPlan = dietPlan.dailyPlans[activeDay];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/diet-plans')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ChevronUp size={16} className="rotate-90 mr-1" />
          Back to all plans
        </button>
        
        <div className="relative rounded-xl overflow-hidden mb-6">
          <img 
            src={dietPlan.coverImage} 
            alt={dietPlan.title} 
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{dietPlan.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center">
                  <User size={16} className="mr-1" />
                  {dietPlan.createdBy?.name || 'Unknown'}
                </span>
                <span className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date(dietPlan.publishedAt).toLocaleDateString()}
                </span>
                <span className="flex items-center">
                  <Flame size={16} className="mr-1" />
                  {dietPlan.targetCalories} kcal/day
                </span>
                <span className="flex items-center">
                  <Utensils size={16} className="mr-1" />
                  {dietPlan.duration} days
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(dietPlan.difficulty)}`}>
                  {dietPlan.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Heart size={16} className="mr-2" />
            Save Plan
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Share2 size={16} className="mr-2" />
            Share
          </button>
        </div>
        
        <p className="text-gray-700 mb-6">{dietPlan.description}</p>
      </div>

      {/* Day Navigation */}
      <div className="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {dietPlan.dailyPlans.map((day, index) => (
          <button
            key={index}
            onClick={() => setActiveDay(index)}
            className={`flex-shrink-0 px-4 py-2 mr-2 rounded-lg ${activeDay === index ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Day {index + 1}
          </button>
        ))}
      </div>

      {/* Day Plan */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Day {activeDay + 1} Meals</h2>
          
          {/* Breakfast */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleMealExpansion('breakfast')}
            >
              <h3 className="text-xl font-semibold text-gray-800">Breakfast</h3>
              {expandedMeals.breakfast ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {expandedMeals.breakfast && (
              <MealDetail meal={currentDayPlan.breakfast} />
            )}
          </div>
          
          {/* Lunch */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleMealExpansion('lunch')}
            >
              <h3 className="text-xl font-semibold text-gray-800">Lunch</h3>
              {expandedMeals.lunch ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {expandedMeals.lunch && (
              <MealDetail meal={currentDayPlan.lunch} />
            )}
          </div>
          
          {/* Dinner */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleMealExpansion('dinner')}
            >
              <h3 className="text-xl font-semibold text-gray-800">Dinner</h3>
              {expandedMeals.dinner ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {expandedMeals.dinner && (
              <MealDetail meal={currentDayPlan.dinner} />
            )}
          </div>
          
          {/* Snacks */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Snacks</h3>
            
            {currentDayPlan.snacks.length === 0 ? (
              <p className="text-gray-500">No snacks planned for this day</p>
            ) : (
              <div className="space-y-6">
                {currentDayPlan.snacks.map((snack, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer mb-2"
                      onClick={() => toggleMealExpansion('snacks', index)}
                    >
                      <h4 className="font-medium text-gray-800">Snack {index + 1}</h4>
                      {expandedMeals.snacks[index] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    
                    {expandedMeals.snacks[index] && (
                      <MealDetail meal={snack} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MealDetail = ({ meal }) => {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h4 className="text-lg font-medium text-gray-900 mb-2">{meal.name}</h4>
          <p className="text-gray-600 mb-4">{meal.description}</p>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <span className="block text-sm text-gray-500">Calories</span>
              <span className="font-medium">{meal.calories} kcal</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <span className="block text-sm text-gray-500">Protein</span>
              <span className="font-medium">{meal.protein}g</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <span className="block text-sm text-gray-500">Carbs</span>
              <span className="font-medium">{meal.carbs}g</span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg text-center">
              <span className="block text-sm text-gray-500">Fat</span>
              <span className="font-medium">{meal.fat}g</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Clock size={14} className="mr-1" />
            <span className="mr-4">Prep: {meal.preparationTime} min</span>
            <Clock size={14} className="mr-1" />
            <span>Cook: {meal.cookingTime} min</span>
          </div>
          
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 mb-2">Ingredients</h5>
            <ul className="list-disc list-inside space-y-1">
              {meal.ingredients.map((ingredient, i) => (
                <li key={i} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Instructions</h5>
            <ol className="list-decimal list-inside space-y-2">
              {meal.instructions.map((instruction, i) => (
                <li key={i} className="text-gray-700">{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="space-y-4">
          {meal.imageUrl && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={meal.imageUrl} 
                alt={meal.name} 
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          
          {meal.videoUrl && (
            <div className="rounded-lg overflow-hidden">
              <video controls className="w-full">
                <source src={meal.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          
          {meal.tags && meal.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {meal.tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'Advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default DietPlanDetail;