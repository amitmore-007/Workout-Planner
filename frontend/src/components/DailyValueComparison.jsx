// components/DailyValueComparison.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dailyValues = {
  calories: 2000,
  protein: 50,
  carbohydrates: 300,
  fat: 65,
  fiber: 25,
  sugar: 50,
};

const DailyValueComparison = ({ nutrition }) => {
  const data = Object.keys(dailyValues)
    .filter(key => nutrition[key])
    .map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      yourValue: parseFloat(nutrition[key]) || 0,
      dailyValue: dailyValues[key],
      percentage: Math.round((parseFloat(nutrition[key]) / dailyValues[key]) * 100),
    }));

  return (
    <div className="h-64 w-full">
      <h3 className="text-lg font-semibold text-white mb-3">Daily Value Comparison (%)</h3>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
          <XAxis type="number" domain={[0, 100]} stroke="#ffffff80" />
          <YAxis dataKey="name" type="category" stroke="#ffffff80" />
          <Tooltip 
            formatter={(value, name) => [`${value}% of daily value`, name === 'yourValue' ? 'Your food' : 'Daily value']}
            contentStyle={{ backgroundColor: '#1e1b4b', borderColor: '#7e22ce' }}
          />
          <Bar dataKey="percentage" fill="#a855f7" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyValueComparison;