import React, { useState, useEffect } from "react";
import axios from "axios";

const DietNutritionApp = () => {
  // Diet Plan State
  const [dietPlan, setDietPlan] = useState(null);
  const [dietLoading, setDietLoading] = useState(true);
  const [dietError, setDietError] = useState("");
  const [activeTab, setActiveTab] = useState(null);

  // Nutrition Lookup State
  const [foodName, setFoodName] = useState("");
  const [nutritionData, setNutritionData] = useState(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);
  const [nutritionError, setNutritionError] = useState("");

  // Fetch Diet Plan Effect
  useEffect(() => {
    const fetchDietPlan = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await axios.get("http://localhost:5000/api/diet/diet-plan", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Enhanced transformation of meals
        const meals = {};
        Object.entries(response.data.meals || {}).forEach(([key, meal]) => {
          meals[key] = {
            title: meal.title || 'Unnamed Meal',
            calories: meal.calories || 'N/A',
            readyInMinutes: meal.readyInMinutes || 'N/A',
            ingredients: meal.ingredients || [],
            videoUrl: meal.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(meal.title + ' recipe')}`
          };
        });

        setDietPlan({ ...response.data, meals });
        setDietLoading(false);

        // Set first meal type as active tab
        const mealTypes = Object.keys(meals);
        if (mealTypes.length > 0) {
          setActiveTab(mealTypes[0]);
        }
      } catch (error) {
        console.error("Error fetching diet plan:", error);
        setDietError("Could not fetch diet plan. Please check your connection.");
        setDietLoading(false);
      }
    };

    fetchDietPlan();
  }, []);

  // Nutrition Lookup Handler
  const handleNutritionSearch = async () => {
    if (!foodName.trim()) {
      setNutritionError("Please enter a food name");
      return;
    }

    setNutritionLoading(true);
    setNutritionError("");
    setNutritionData(null);

    try {
      // Update the nutrition API endpoint if needed
      const response = await axios.get(`http://localhost:5000/api/nutrition/details`, {
        params: { food: foodName }
      });
      
      const nutritionInfo = response.data;
      setNutritionData({
        name: nutritionInfo.name || foodName,
        calories: nutritionInfo.calories || 'N/A',
        protein: nutritionInfo.protein || 'N/A',
        carbs: nutritionInfo.carbohydrates || 'N/A',
        fat: nutritionInfo.fat || 'N/A',
        servingSize: nutritionInfo.servingSize || 'N/A'
      });
      setNutritionLoading(false);
    } catch (error) {
      console.error('Nutrition search error:', error);
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setNutritionError(`Error: ${error.response.status} - ${error.response.data.message || 'Could not fetch nutrition information'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setNutritionError('No response received from the server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setNutritionError('Error setting up the request. Please try again.');
      }
      setNutritionLoading(false);
    }
  };

  // Render loading state for diet plan
  if (dietLoading) return <div className="text-center text-2xl p-4">Loading Diet Plan...</div>;
  
  // Render diet plan error
  if (dietError) return <div className="text-center text-red-500 text-2xl p-4">{dietError}</div>;
  
  // Render main component
  return (
    <div className="container mx-auto p-4">
      {/* Diet Plan Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Today's Diet Plan</h1>
        
        {/* Meal Type Tabs */}
        <div className="flex space-x-4 mb-4">
          {Object.keys(dietPlan.meals).map((mealType) => (
            <button
              key={mealType}
              onClick={() => setActiveTab(mealType)}
              className={`
                px-4 py-2 rounded 
                ${activeTab === mealType 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
              `}
            >
              {mealType}
            </button>
          ))}
        </div>

        {/* Active Meal Details */}
        {activeTab && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{dietPlan.meals[activeTab].title}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">
                    <span className="font-medium">Calories:</span> {dietPlan.meals[activeTab].calories}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Preparation Time:</span> {dietPlan.meals[activeTab].readyInMinutes} minutes
                  </p>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Ingredients:</h3>
                    <ul className="list-disc list-inside">
                      {dietPlan.meals[activeTab].ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <a 
                    href={dietPlan.meals[activeTab].videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-red-500 text-white px-4 py-2 rounded inline-block hover:bg-red-600 transition"
                  >
                    Watch Recipe Video
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nutrition Lookup Section */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Nutrition Lookup</h1>
        <div className="flex mb-4">
          <input 
            type="text" 
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Enter food name"
            className="flex-grow p-2 border rounded-l-md"
          />
          <button 
            onClick={handleNutritionSearch} 
            disabled={nutritionLoading}
            className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 disabled:opacity-50"
          >
            {nutritionLoading ? 'Searching...' : 'Search Nutrition'}
          </button>
        </div>

        {/* Nutrition Error */}
        {nutritionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            {nutritionError}
          </div>
        )}

        {/* Nutrition Results */}
        {nutritionData && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">{nutritionData.name}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="mb-2">
                  <span className="font-medium">Calories:</span> {nutritionData.calories}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Protein:</span> {nutritionData.protein} g
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <span className="font-medium">Carbs:</span> {nutritionData.carbs} g
                </p>
                <p className="mb-2">
                  <span className="font-medium">Fat:</span> {nutritionData.fat} g
                </p>
                <p className="mb-2">
                  <span className="font-medium">Serving Size:</span> {nutritionData.servingSize}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietNutritionApp;