import React from 'react';

const ResultCard = ({ result }) => {
  return (
    <div className="bg-white mt-6 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">🍎 Nutritional Breakdown</h2>
      <pre className="whitespace-pre-wrap text-gray-800">{result}</pre>
    </div>
  );
};

export default ResultCard;
