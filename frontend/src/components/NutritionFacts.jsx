// components/NutritionFacts.js
import React from 'react';
import { motion } from 'framer-motion';

const NutritionFacts = ({ nutrition }) => {
  const nutrients = [
    { name: 'Calories', value: nutrition.calories || 'N/A', unit: 'kcal', color: 'from-orange-400 to-orange-600' },
    { name: 'Protein', value: nutrition.protein || 'N/A', unit: 'g', color: 'from-blue-400 to-blue-600' },
    { name: 'Carbohydrates', value: nutrition.carbohydrates || 'N/A', unit: 'g', color: 'from-green-400 to-green-600' },
    { name: 'Fat', value: nutrition.fat || 'N/A', unit: 'g', color: 'from-yellow-400 to-yellow-600' },
    { name: 'Fiber', value: nutrition.fiber || 'N/A', unit: 'g', color: 'from-purple-400 to-purple-600' },
    { name: 'Sugar', value: nutrition.sugar || 'N/A', unit: 'g', color: 'from-pink-400 to-pink-600' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {nutrients.map((nutrient, index) => (
        <motion.div
          key={nutrient.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-br ${nutrient.color} rounded-xl p-4 shadow-lg text-white`}
        >
          <h3 className="text-sm font-medium mb-1">{nutrient.name}</h3>
          <div className="flex items-end">
            <span className="text-2xl font-bold mr-1">{nutrient.value}</span>
            <span className="text-sm opacity-80">{nutrient.unit}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NutritionFacts;