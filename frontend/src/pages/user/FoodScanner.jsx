import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, ChevronDown, ChevronUp, Award, Sparkles, Zap, Beaker } from 'lucide-react';
import { analyzeFoodImage } from '../../api/foodScanner';

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
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-300 font-medium">{label}</span>
          <span className="text-sm text-white font-semibold">{value}g</span>
        </div>
        <div className="h-3 bg-gray-800/60 rounded-full border border-gray-700/50 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full rounded-full ${color} shadow-lg relative`}
            style={{
              boxShadow: `0 0 10px ${color.includes('cyan') ? '#00f5ff' : color.includes('green') ? '#00ff88' : color.includes('yellow') ? '#ffed4e' : '#ff006e'}`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </div>
    );
  };

 // Updated FoodCard component with quantity display
const FoodCard = ({ food, index, onClick, isSelected }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1 + (index * 0.1), type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.02, rotateY: 2 }}
      onClick={onClick}
      className={`cursor-pointer p-6 ${isSelected ? 'bg-gray-800/80 border-cyan-400/60' : 'bg-gray-900/60 border-gray-700/30'} backdrop-blur-xl rounded-2xl border-2 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 mb-4 relative overflow-hidden group`}
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Neon corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/40 rounded-tl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-purple-400/40 rounded-br-2xl" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {(food.quantity && food.quantity > 1) ? `${food.quantity}× ${food.name}` : food.name}
          </h3>
          <div className={`px-4 py-2 rounded-full text-xs font-bold ${food.isHealthy ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30' : 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30'} backdrop-blur-sm`}>
            {food.isHealthy ? '✓ HEALTHY' : '⚠ CAUTION'}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 flex items-center justify-center mr-4 border border-gray-600/50 shadow-lg">
              <span className="text-white font-bold text-lg">{food.calories}</span>
            </div>
            <div className="text-gray-300 text-sm font-medium">CALORIES</div>
          </div>
          
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-400">{food.protein}g</div>
              <div className="text-xs text-gray-400 font-medium">PROTEIN</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-400">{food.carbs}g</div>
              <div className="text-xs text-gray-400 font-medium">CARBS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-400">{food.fats}g</div>
              <div className="text-xs text-gray-400 font-medium">FATS</div>
            </div>
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
        initial={{ opacity: 0, height: 0, scale: 0.95 }}
        animate={{ opacity: 1, height: 'auto', scale: 1 }}
        exit={{ opacity: 0, height: 0, scale: 0.95 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl border-2 border-gray-700/50 p-8 mb-6 relative overflow-hidden shadow-2xl"
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-lg flex items-center justify-center mr-3">
              <Sparkles className="text-white" size={18} />
            </div>
            {food.name} - Detailed Analysis
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="mb-8">
                <div className="text-xl font-bold text-white mb-4 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full mr-3" />
                  Macronutrients
                </div>
                <NutritionBar label="Protein" value={food.protein} color="bg-gradient-to-r from-green-400 to-emerald-400" />
                <NutritionBar label="Carbs" value={food.carbs} color="bg-gradient-to-r from-blue-400 to-cyan-400" />
                <NutritionBar label="Fats" value={food.fats} color="bg-gradient-to-r from-yellow-400 to-orange-400" />
                {food.fiber !== undefined && (
                  <NutritionBar label="Fiber" value={food.fiber} color="bg-gradient-to-r from-amber-400 to-yellow-400" max={30} />
                )}
                {food.sugar !== undefined && (
                  <NutritionBar label="Sugar" value={food.sugar} color="bg-gradient-to-r from-pink-400 to-red-400" max={50} />
                )}
              </div>
              
              <div className="p-6 bg-gray-800/60 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-xl font-bold text-white mb-4 flex items-center">
                  <Zap className="mr-2 text-yellow-400" size={20} />
                  Energy Content
                </div>
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/40 via-purple-500/40 to-pink-500/40 flex items-center justify-center mr-6 border border-gray-600/50 shadow-lg">
                    <span className="text-white text-2xl font-bold">{food.calories}</span>
                  </div>
                  <div>
                    <div className="text-gray-300 text-lg font-medium">Total Calories</div>
                    <div className="text-gray-400 text-sm">Energy per serving</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-xl font-bold text-white mb-4 flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-3" />
                Health Assessment
              </div>
              <div className={`p-6 rounded-2xl ${food.isHealthy ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' : 'bg-gradient-to-br from-red-500/20 to-pink-500/20 border-red-500/30'} border-2 mb-6 backdrop-blur-sm relative overflow-hidden`}>
                {/* Subtle animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                
                <div className={`text-xl font-bold mb-3 ${food.isHealthy ? 'text-green-300' : 'text-red-300'} relative z-10`}>
                  {food.isHealthy ? '✓ Healthy Choice' : '⚠ Health Consideration'}
                </div>
                <p className="text-gray-200 leading-relaxed relative z-10">{food.healthReason}</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(34, 211, 238, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedFood(null)}
                className="w-full bg-gradient-to-r from-gray-800/80 to-gray-700/80 hover:from-gray-700/80 hover:to-gray-600/80 text-white py-4 rounded-2xl font-bold transition-all duration-300 border border-gray-600/50 backdrop-blur-sm shadow-lg"
              >
                ← Back to All Foods
              </motion.button>
            </div>
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black p-6">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />
        </div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Geometric shapes */}
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={`geo-${index}`}
            className="absolute border border-cyan-400/20"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            }}
            animate={{
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Enhanced light rays */}
        <div className="absolute top-0 left-1/4 w-1/2 h-screen bg-gradient-to-b from-cyan-500/5 to-transparent transform -rotate-45 blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-1/2 h-screen bg-gradient-to-b from-purple-500/5 to-transparent transform rotate-45 blur-3xl"></div>
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-900/20 to-black/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          {/* Enhanced floating header */}
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="flex items-center justify-between mb-10 bg-gray-900/60 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl border border-gray-700/50 relative overflow-hidden"
          >
            {/* Header background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
            
            <motion.h1 
              className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 relative z-10"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              NutriScan AI
            </motion.h1>
            
            <div className="hidden md:flex space-x-4 relative z-10">
              {[
                { icon: <Sparkles size={18} className="text-cyan-400" />, text: "AI Powered", color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30" },
                { icon: <Zap size={18} className="text-yellow-400" />, text: "Instant Results", color: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30" },
                { icon: <Beaker size={18} className="text-purple-400" />, text: "Precise Analysis", color: "from-purple-500/20 to-pink-500/20 border-purple-500/30" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 + (i * 0.1), type: "spring", stiffness: 120 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className={`px-5 py-3 bg-gradient-to-r ${item.color} backdrop-blur-sm rounded-2xl shadow-lg flex items-center space-x-3 border font-bold text-white`}
                >
                  {item.icon}
                  <span className="text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {/* Enhanced Left Section */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              className="md:col-span-2 bg-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-700/50 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
              
              <div 
                className={`relative flex flex-col h-96 md:h-full ${previewUrl ? '' : 'border-2 border-dashed'} ${dragActive ? 'border-cyan-400/60 bg-cyan-500/5' : 'border-gray-600/50'} rounded-3xl`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="relative flex-grow flex items-center justify-center p-6">
                    <motion.img 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={previewUrl} 
                      alt="Food preview" 
                      className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-gray-600/30" 
                    />
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={clearImage}
                      className="absolute top-8 right-8 bg-gray-900/80 text-white p-3 rounded-full shadow-2xl hover:bg-red-500/80 transition-all duration-300 backdrop-blur-sm border border-gray-600/50"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                ) : (
                  <div className="p-10 flex flex-col items-center justify-center h-full relative z-10">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }} 
                      whileTap={{ scale: 0.95 }}
                      className="w-28 h-28 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-gray-600/50 shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                      <Camera size={48} className="text-white relative z-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-3">Upload Food Image</h3>
                    <p className="text-gray-400 text-center mb-8 font-medium">Drag & drop your image or click to browse</p>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 211, 238, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => fileInputRef.current.click()}
                      className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl border border-gray-600/30 flex items-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                      <Upload size={20} className="mr-3 relative z-10" /> 
                      <span className="relative z-10">Select Image</span>
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

            {/* Enhanced Right Section */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              className="md:col-span-3"
            >
              {/* Enhanced Analysis Button */}
              {file && !loading && !result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(34, 211, 238, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white py-5 rounded-2xl font-bold shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 flex items-center justify-center border border-gray-600/30 relative overflow-hidden text-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex items-center relative z-10"
                    >
                      <Award className="mr-3" size={24} />
                      <span>🚀 Analyze Food with AI</span>
                    </motion.div>
                  </motion.button>
                </motion.div>
              )}

              {/* Enhanced loading animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-gray-700/50 relative overflow-hidden"
                  >
                    {/* Loading background effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
                    
                    <div className="w-full mb-8 relative z-10">
                      <div className="h-3 bg-gray-800/60 rounded-full overflow-hidden border border-gray-700/50">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ 
                            width: ["0%", "100%"],
                            background: [
                              "linear-gradient(to right, #22d3ee, #a855f7)", 
                              "linear-gradient(to right, #a855f7, #ec4899)", 
                              "linear-gradient(to right, #ec4899, #22d3ee)"
                            ]
                          }}
                          transition={{ 
                            duration: 3, 
                            ease: "easeInOut",
                            background: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                          }}
                          className="h-full rounded-full shadow-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center relative z-10">
                      <div className="relative w-24 h-24 mb-6">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="w-full h-full border-4 border-cyan-400/30 rounded-full"
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute top-2 left-2 right-2 bottom-2 border-t-4 border-purple-400 rounded-full"
                        />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="absolute top-4 left-4 right-4 bottom-4 border-r-4 border-pink-400 rounded-full"
                        />
                      </div>
                      <motion.h3 
                        animate={{ 
                          color: ["#fff", "#22d3ee", "#a855f7", "#ec4899", "#fff"]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-2xl font-bold mb-3"
                      >
                        🧠 AI Processing Your Food
                      </motion.h3>
                      <p className="text-gray-400 text-center font-medium">Advanced neural networks are analyzing nutritional composition</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Results Section */}
              <AnimatePresence>
                {result && !loading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    {result.error ? (
                      <div className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 text-center border border-red-500/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5" />
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-red-900/40 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                            <X size={40} className="text-red-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-4">Analysis Failed</h3>
                          <p className="text-gray-300 mb-8">{result.error}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={clearImage}
                            className="bg-gray-800/60 hover:bg-gray-700/60 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 border border-gray-600/50"
                          >
                            Try Again
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-2xl p-8 text-white border-b border-gray-700/50 rounded-t-3xl relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
                          <motion.h2 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-3xl font-bold flex items-center relative z-10"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center mr-4">
                              <Sparkles className="text-white" size={24} />
                            </div>
                            🎯 Analysis Complete
                          </motion.h2>                      
                        </div>
                        
                        {renderFoodList()}
                        
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(34, 211, 238, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={clearImage}
                          className="mt-8 bg-gray-800/60 hover:bg-gray-700/60 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center border border-gray-600/50 w-full backdrop-blur-sm shadow-xl"
                        >
                          <Camera className="mr-3" size={20} /> 
                          🔄 Scan Another Image
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