// components/NutrientPieChart.js
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const NutrientPieChart = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: parseFloat(data.protein) || 0 },
    { name: 'Carbs', value: parseFloat(data.carbohydrates) || 0 },
    { name: 'Fat', value: parseFloat(data.fat) || 0 },
    { name: 'Fiber', value: parseFloat(data.fiber) || 0 },
    { name: 'Sugar', value: parseFloat(data.sugar) || 0 },
  ].filter(item => item.value > 0);

  return (
    <div className="h-64 md:h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}g`, 'Amount']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutrientPieChart;