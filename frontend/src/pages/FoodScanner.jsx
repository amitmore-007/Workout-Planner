import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, ChevronDown, ChevronUp, Award, Sparkles, Zap, Beaker } from 'lucide-react';
import { analyzeFoodImage } from '../api/foodScanner';

const FoodScanner = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Animated background elements
  const bubbleCount = 15;
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await analyzeFoodImage(file);
      setResult(res.result);
      setSelectedFood(null); // Reset selected food when getting new results
    } catch (err) {
      setResult({ error: "Failed to analyze image. Please try again." });
    }
    setLoading(false);
  };

  const handleFile = (file) => {
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setSelectedFood(null);
  };

  // Parse result JSON if it's a string
  const processedResult = React.useMemo(() => {
    if (!result || result.error) return result;
    
    // If result is already an object with a foods array, use it
    if (typeof result === 'object' && result.foods) {
      return result;
    }
    
    // If result is a string, try to parse it as JSON
    if (typeof result === 'string') {
      try {
        // Try to find JSON in the string
        const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1].trim());
        }
        
        // Try parsing the whole string as JSON
        return JSON.parse(result);
      } catch (e) {
        // If parsing fails, return original result
        return { textResult: result };
      }
    }
    
    return result;
  }, [result]);

  // Render nutrition bar
  const NutritionBar = ({ label, value, color, max = 100 }) => {
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-white/80">{label}</span>
          <span className="text-sm text-white/80">{value}g</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
      </div>
    );
  };

 // Updated FoodCard component with quantity display
const FoodCard = ({ food, index, onClick, isSelected }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + (index * 0.1) }}
      onClick={onClick}
      className={`cursor-pointer p-5 ${isSelected ? 'bg-white/20' : 'bg-white/10'} backdrop-blur-sm rounded-xl border ${isSelected ? 'border-cyan-300/50' : 'border-white/10'} shadow-lg hover:shadow-xl transition-all hover:scale-102 mb-4`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">
          {(food.quantity && food.quantity > 1) ? `${food.quantity}× ${food.name}` : food.name}
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${food.isHealthy ? 'bg-green-500/20 text-green-300' : 'bg-pink-500/20 text-pink-300'}`}>
          {food.isHealthy ? 'Healthy' : 'Not Healthy'}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center mr-3">
            <span className="text-white font-bold">{food.calories}</span>
          </div>
          <div className="text-white/70 text-sm">calories</div>
        </div>
        
        <div className="flex space-x-3">
          <div className="text-center">
            <div className="text-sm font-semibold text-white">{food.protein}g</div>
            <div className="text-xs text-white/60">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-white">{food.carbs}g</div>
            <div className="text-xs text-white/60">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-semibold text-white">{food.fats}g</div>
            <div className="text-xs text-white/60">Fats</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

  // Render food detail panel
  const FoodDetailPanel = ({ food }) => {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Sparkles className="mr-2 text-cyan-300" size={18} /> 
          {food.name} Nutritional Breakdown
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <div className="text-lg font-semibold text-white mb-2">Macronutrients</div>
              <NutritionBar label="Protein" value={food.protein} color="bg-green-400" />
              <NutritionBar label="Carbs" value={food.carbs} color="bg-blue-400" />
              <NutritionBar label="Fats" value={food.fats} color="bg-yellow-400" />
              {food.fiber !== undefined && (
                <NutritionBar label="Fiber" value={food.fiber} color="bg-amber-400" max={30} />
              )}
              {food.sugar !== undefined && (
                <NutritionBar label="Sugar" value={food.sugar} color="bg-pink-400" max={50} />
              )}
            </div>
            
            <div className="p-4 bg-white/10 rounded-lg">
              <div className="text-lg font-semibold text-white mb-2">Calories</div>
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/40 to-pink-500/40 flex items-center justify-center mr-4">
                  <span className="text-white text-xl font-bold">{food.calories}</span>
                </div>
                <div className="text-white/70">Total Calories</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-lg font-semibold text-white mb-2">Health Assessment</div>
            <div className={`p-4 rounded-lg ${food.isHealthy ? 'bg-green-500/20' : 'bg-pink-500/20'} mb-4`}>
              <div className={`text-lg font-semibold mb-2 ${food.isHealthy ? 'text-green-300' : 'text-pink-300'}`}>
                {food.isHealthy ? 'Healthy Choice' : 'Health Consideration'}
              </div>
              <p className="text-white/80">{food.healthReason}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedFood(null)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-medium transition-colors mt-2 border border-white/20"
            >
              Back to All Foods
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render food list with cards
  const renderFoodList = () => {
    // Handle raw text result
    if (processedResult && processedResult.textResult) {
      return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
          <div className="flex items-center mb-4">
            <Sparkles className="mr-2 text-cyan-300" size={20} />
            <h3 className="text-xl font-semibold text-white">Analysis Results</h3>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <pre className="whitespace-pre-wrap text-white/80 font-mono text-sm overflow-auto max-h-96">{processedResult.textResult}</pre>
          </div>
        </div>
      );
    }

    // Handle structured result
    if (processedResult && processedResult.foods) {
      return (
        <>
          {selectedFood ? (
            <FoodDetailPanel food={selectedFood} />
          ) : (
            <>
              {processedResult.overallAssessment && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/10"
                >
                  <div className="text-lg font-semibold text-white mb-1">Overall Assessment</div>
                  <p className="text-white/80">{processedResult.overallAssessment}</p>
                </motion.div>
              )}
              
              <div className="text-xl font-semibold text-white mb-4 flex items-center">
                <Award className="mr-2 text-purple-300" size={20} />
                Food Items ({processedResult.foods.length})
              </div>
              
              {processedResult.foods.map((food, index) => (
                <FoodCard 
                  key={index}
                  food={food}
                  index={index}
                  onClick={() => setSelectedFood(food)}
                  isSelected={false}
                />
              ))}
            </>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/50 via-transparent to-fuchsia-900/30 animate-pulse" 
             style={{animationDuration: '8s'}} />
        
        {/* Floating bubbles */}
        {[...Array(bubbleCount)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Light rays */}
        <div className="absolute top-0 left-1/4 w-1/2 h-screen bg-gradient-to-b from-purple-500/10 to-transparent transform -rotate-45 blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-1/2 h-screen bg-gradient-to-b from-blue-400/10 to-transparent transform rotate-45 blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Floating header with glass effect */}
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="flex items-center justify-between mb-8 bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/20"
          >
            <motion.h1 
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-pink-300"
              animate={{ textShadow: ["0 0 5px rgba(255,255,255,0.3)", "0 0 15px rgba(255,255,255,0.5)", "0 0 5px rgba(255,255,255,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              NutriScan AI
            </motion.h1>
            <div className="hidden md:flex space-x-3">
              {[
                { icon: <Sparkles size={16} className="text-cyan-300" />, text: "AI Powered" },
                { icon: <Zap size={16} className="text-pink-300" />, text: "Instant Results" },
                { icon: <Beaker size={16} className="text-purple-300" />, text: "Precise Analysis" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="px-4 py-2 bg-white/10 backdrop-blur rounded-full shadow-md flex items-center space-x-2 border border-white/20"
                >
                  {item.icon}
                  <span className="text-sm font-medium text-white">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-6">
            {/* Left Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20"
            >
              <div 
                className={`relative flex flex-col h-96 md:h-full ${previewUrl ? '' : 'border-2 border-dashed'} ${dragActive ? 'border-cyan-300 bg-white/5' : 'border-white/30'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="relative flex-grow flex items-center justify-center p-4">
                    <img 
                      src={previewUrl} 
                      alt="Food preview" 
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg" 
                    />
                    <button 
                      onClick={clearImage}
                      className="absolute top-6 right-6 bg-black/50 text-white p-2 rounded-full shadow-lg hover:bg-black/70 transition-colors backdrop-blur-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center h-full">
                    <motion.div 
                      whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }} 
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-purple-400/30 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20"
                    >
                      <Camera size={40} className="text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">Upload Food Image</h3>
                    <p className="text-white/70 text-center mb-6">Drag & drop or click to select</p>
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => fileInputRef.current.click()}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-full font-medium shadow-lg border border-white/20 flex items-center"
                    >
                      <Upload size={18} className="mr-2" /> Select Image
                    </motion.button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-3"
            >
              {/* Analysis Button */}
              {file && !loading && !result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center border border-white/20"
                  >
                    <motion.div 
                      animate={{ 
                        textShadow: ["0 0 0px #fff", "0 0 10px #fff", "0 0 0px #fff"] 
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center"
                    >
                      <span className="mr-2">Analyze Food</span>
                      <Award size={18} />
                    </motion.div>
                  </motion.button>
                </motion.div>
              )}

              {/* Loading animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center border border-white/20"
                  >
                    <div className="w-full mb-6">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: ["0%", "100%"],
                            background: ["linear-gradient(to right, #22d3ee, #a855f7)", "linear-gradient(to right, #a855f7, #ec4899)", "linear-gradient(to right, #ec4899, #22d3ee)"]
                          }}
                          transition={{ 
                            duration: 2, 
                            ease: "easeInOut",
                            background: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                          }}
                          className="h-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="relative w-20 h-20 mb-4">
                        <motion.div 
                          animate={{ rotate: 360, borderColor: ["#22d3ee", "#a855f7", "#ec4899", "#22d3ee"] }}
                          transition={{ 
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                            borderColor: { duration: 3, repeat: Infinity }
                          }}
                          className="w-full h-full border-4 rounded-full"
                          style={{ borderRadius: "50%" }}
                        />
                        <motion.div 
                          animate={{ 
                            rotate: -360,
                            borderTopColor: ["#ec4899", "#a855f7", "#22d3ee", "#ec4899"]
                          }}
                          transition={{ 
                            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                            borderTopColor: { duration: 3, repeat: Infinity }
                          }}
                          className="absolute top-1 left-1 right-1 bottom-1 border-t-4 rounded-full"
                          style={{ borderRadius: "50%" }}
                        />
                      </div>
                      <motion.h3 
                        animate={{ 
                          color: ["#fff", "#22d3ee", "#a855f7", "#ec4899", "#fff"]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-xl font-semibold mb-2"
                      >
                        Analyzing Your Food
                      </motion.h3>
                      <p className="text-white/70 text-center">Our AI is identifying ingredients and calculating nutritional values</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Section */}
              <AnimatePresence>
                {result && !loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  >
                    {result.error ? (
                      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center border border-white/20">
                        <div className="w-16 h-16 bg-pink-900/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/30">
                          <X size={32} className="text-pink-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Analysis Failed</h3>
                        <p className="text-white/70">{result.error}</p>
                        <button
                          onClick={clearImage}
                          className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-medium transition-colors border border-white/20"
                        >
                          Try Again
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur-md p-6 text-white border-b border-white/20 rounded-t-2xl">
                        <motion.h2 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold flex items-center"
              >
                <Sparkles className="mr-2 text-cyan-300" size={20} />
                Analysis Results
              </motion.h2>                      
            </div>
                        
            {renderFoodList()}
                        
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearImage}
              className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center border border-white/20 w-full"
            >
              <Camera className="mr-2" size={18} /> 
              Scan Another Image
            </motion.button>
          </div>
        )}
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodScanner;