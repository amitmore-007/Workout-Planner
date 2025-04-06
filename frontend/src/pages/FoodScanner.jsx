import React, { useState } from 'react';
import { analyzeFoodImage } from '../api/foodScanner';
import ResultCard from '../components/ResultCard';

const FoodScanner = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await analyzeFoodImage(file);
      setResult(res.result);
    } catch (err) {
      alert("Failed to analyze image.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🍽️ Food Scanner</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
};

export default FoodScanner;
