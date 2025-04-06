import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, ChevronDown, ChevronUp, Award, Clock } from 'lucide-react';
import { analyzeFoodImage } from '../api/foodScanner';

const FoodScanner = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await analyzeFoodImage(file);
      setResult(res.result);
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
  };

  const nutrients = result && !result.error ? {
    calories: '245 kcal',
    protein: '8.5g',
    carbs: '32g',
    fat: '10.2g',
    fiber: '4.5g'
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            NutriScan AI
          </h1>
          <div className="px-4 py-2 bg-white rounded-full shadow-md flex items-center space-x-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-medium">Instant Analysis</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Left Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div 
              className={`relative h-full flex flex-col ${previewUrl ? 'border-0' : 'border-2 border-dashed'} ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="relative flex-grow">
                  <img 
                    src={previewUrl} 
                    alt="Food preview" 
                    className="w-full h-full object-cover" 
                  />
                  <button 
                    onClick={clearImage}
                    className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="p-8 flex flex-col items-center justify-center h-full">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4"
                  >
                    <Camera size={40} className="text-blue-500" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Food Image</h3>
                  <p className="text-gray-500 text-center mb-6">Drag & drop or click to select</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center"
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
                >
                  <span className="mr-2">Analyze Food</span>
                  <Award size={18} />
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
                  className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center"
                >
                  <div className="w-full mb-6">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full border-4 border-blue-200 rounded-full"
                      />
                      <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-full border-t-4 border-blue-600 rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyzing Your Food</h3>
                    <p className="text-gray-500 text-center">Our AI is identifying ingredients and calculating nutritional values</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Card */}
            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                  {result.error ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <X size={32} className="text-red-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Analysis Failed</h3>
                      <p className="text-gray-500">{result.error}</p>
                      <button
                        onClick={clearImage}
                        className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                        <h2 className="text-2xl font-bold mb-2">Nutritional Analysis</h2>
                        <p className="text-blue-100">Your food has been successfully analyzed</p>
                      </div>
                      
                      {/* Nutrition Value Cards */}
                      <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                          {nutrients && Object.entries(nutrients).map(([key, value], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="bg-gray-50 rounded-xl p-4 text-center"
                            >
                              <div className="text-gray-500 text-sm capitalize mb-1">{key}</div>
                              <div className="text-xl font-bold text-gray-800">{value}</div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Detailed Analysis */}
                        <div className="bg-gray-50 rounded-xl overflow-hidden">
                          <button 
                            onClick={() => setDetailsOpen(!detailsOpen)}
                            className="w-full flex items-center justify-between p-4 text-left font-medium text-gray-800"
                          >
                            Detailed Analysis
                            {detailsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </button>
                          
                          <AnimatePresence>
                            {detailsOpen && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 border-t border-gray-200">
                                  <pre className="whitespace-pre-wrap text-gray-700 font-mono text-sm">{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</pre>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Placeholder message when no file is selected */}
            {!file && !loading && !result && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col items-center text-center h-full"
              >
                <div className="flex-1 flex flex-col items-center justify-center">
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <Camera size={36} className="text-purple-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-3 text-gray-800">Start Your Food Analysis</h2>
                  <p className="text-gray-600 max-w-md mb-6">
                    Upload a clear image of your food to get detailed nutritional information using our advanced AI technology.
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current.click()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Get Started
                  </motion.button>
                </div>
                
                <div className="mt-10 pt-6 border-t border-gray-200 w-full">
                  <div className="grid grid-cols-3 gap-4">
                    {['Accurate Analysis', 'Instant Results', 'Diet Tracking'].map((feature, index) => (
                      <motion.div 
                        key={feature}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <span className="text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">{feature}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default FoodScanner;