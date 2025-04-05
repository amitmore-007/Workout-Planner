import React, { useState, useEffect, useRef } from 'react'
import { Camera, Upload, Check, X, ChevronDown, Heart, BellRing, Zap, Utensils, Camera as CameraIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Custom Button Component with enhanced visual effects
const Button = ({ variant, onClick, children, className }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  let variantClasses = ""

  switch (variant) {
    case "outline":
      variantClasses = "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      break
    default:
      variantClasses = "bg-primary text-primary-foreground hover:bg-primary/90"
  }

  return (
    <motion.button 
      className={`${baseClasses} ${variantClasses} ${className}`} 
      onClick={onClick}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

// Custom Input Component with better styling
const Input = ({ type, accept, onChange, className, id }) => {
  return (
    <input
      type={type}
      accept={accept}
      onChange={onChange}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      id={id}
    />
  )
}

// Custom Label Component
const Label = ({ htmlFor, children, className }) => {
  return (
    <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
      {children}
    </label>
  )
}

// Enhanced Card Components with better animations
const Card = ({ className, children }) => {
  return (
    <motion.div 
      className={`rounded-3xl bg-white shadow-2xl overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

const CardHeader = ({ className, children }) => {
  return (
    <div className={`flex flex-col space-y-1.5 p-8 ${className}`}>
      {children}
    </div>
  )
}

const CardContent = ({ className, children }) => {
  return (
    <div className={`p-8 pt-0 ${className}`}>
      {children}
    </div>
  )
}

const CardTitle = ({ className, children }) => {
  return (
    <motion.h3 
      className={`text-2xl font-bold leading-none tracking-tight ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.h3>
  )
}

// Progress Bar Component with enhanced visual effects
const ProgressBar = ({ value, color, label }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-bold">{value}g</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <motion.div 
          className={`h-3 rounded-full ${color} shadow-lg`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        ></motion.div>
      </div>
    </div>
  )
}

// Badge Component with pulse effect
const Badge = ({ children, className }) => {
  return (
    <motion.span 
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.span>
  )
}

export default function FoodMacronutrientAnalyzer() {
  const [image, setImage] = useState(null)
  const [macronutrients, setMacronutrients] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [foodName, setFoodName] = useState("")
  const [calorieCount, setCalorieCount] = useState(0)
  const [nutritionTip, setNutritionTip] = useState("")
  const fileInputRef = useRef(null)

  const tips = [
    "Proteins help build muscle and keep you full longer",
    "Complex carbs provide sustained energy throughout the day",
    "Healthy fats support brain function and hormone production",
    "Aim for a colorful plate to get a variety of nutrients",
    "Portion control is key to maintaining a balanced diet"
  ]

  // Fixed file upload functionality
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
        performAnalysis()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          const video = document.createElement('video')
          video.srcObject = stream
          video.play()
          video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            context?.drawImage(video, 0, 0, canvas.width, canvas.height)
            const imageData = canvas.toDataURL('image/png')
            setImage(imageData)
            stream.getVideoTracks().forEach(track => track.stop())
            performAnalysis()
          }
        })
        .catch(err => {
          console.error("Error accessing camera: ", err)
          setFeedback("Unable to access camera. Please try uploading an image instead.")
        })
    } else {
      setFeedback("Camera access is not supported in this browser.")
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
        performAnalysis()
      }
      reader.readAsDataURL(file)
    } else {
      setFeedback("Please upload an image file.")
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = () => {
    setDragActive(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const performAnalysis = () => {
    setIsLoading(true)
    setMacronutrients(null)
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate food names for simulation
      const foods = ["Grilled Chicken Salad", "Avocado Toast", "Salmon with Quinoa", "Greek Yogurt Bowl", "Vegetable Stir Fry"]
      const selectedFood = foods[Math.floor(Math.random() * foods.length)]
      setFoodName(selectedFood)
      
      // Simulate macronutrient analysis with mock data
      const mockData = {
        carbs: Math.floor(Math.random() * 60) + 20,
        proteins: Math.floor(Math.random() * 40) + 15,
        fats: Math.floor(Math.random() * 30) + 5,
        fiber: Math.floor(Math.random() * 10) + 2,
        sugar: Math.floor(Math.random() * 15) + 1
      }
      
      // Calculate calories based on macros (4 cal/g for carbs and protein, 9 cal/g for fat)
      const calories = (mockData.carbs * 4) + (mockData.proteins * 4) + (mockData.fats * 9)
      setCalorieCount(calories)
      
      // Set random nutrition tip
      setNutritionTip(tips[Math.floor(Math.random() * tips.length)])
      
      setMacronutrients(mockData)
      setFeedback(null)
      setIsLoading(false)
    }, 2000)
  }

  // Format to macronutrient percentages
  const calculatePercentages = () => {
    if (!macronutrients) return { carbPercent: 0, proteinPercent: 0, fatPercent: 0 }
    
    const total = macronutrients.carbs + macronutrients.proteins + macronutrients.fats
    return {
      carbPercent: Math.round((macronutrients.carbs / total) * 100),
      proteinPercent: Math.round((macronutrients.proteins / total) * 100),
      fatPercent: Math.round((macronutrients.fats / total) * 100)
    }
  }

  const percentages = calculatePercentages()

  // Generate animated background particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 10 + 5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10
  }))

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 p-4 sm:p-8">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-20"
            style={{ 
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-4xl mx-auto backdrop-blur-sm bg-white/95">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-t-3xl">
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              className="mr-4 bg-white/20 p-3 rounded-full"
            >
              <Utensils size={28} />
            </motion.div>
            <div>
              <CardTitle className="text-3xl md:text-4xl font-extrabold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                NutriScan
              </CardTitle>
              <p className="text-blue-100 opacity-90 mt-2 text-lg">Analyze your food's nutritional content in seconds</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-blue-500/60 text-white border border-blue-200 px-4 py-2">
              <Zap size={14} className="mr-2" /> Instant Analysis
            </Badge>
            <Badge className="bg-purple-500/60 text-white border border-purple-200 px-4 py-2">
              <Heart size={14} className="mr-2" /> Nutritional Insights
            </Badge>
            <Badge className="bg-indigo-500/60 text-white border border-indigo-200 px-4 py-2">
              <BellRing size={14} className="mr-2" /> Personal Health Tips
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Upload Section - Enhanced visuals */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                onClick={handleCameraCapture}
                className="w-full sm:w-auto py-6 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300 hover:bg-blue-300 hover:border-blue-400 transition-all duration-300 rounded-xl shadow-md"
              >
                <Camera className="mr-3 text-blue-600" size={24} />
                <span className="font-bold text-blue-800">Take a Picture</span>
              </Button>
              
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                ref={fileInputRef}
              />
              
              <Button 
                variant="outline" 
                onClick={triggerFileInput}
                className="w-full sm:w-auto py-6 bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300 hover:bg-purple-300 hover:border-purple-400 transition-all duration-300 rounded-xl shadow-md"
              >
                <Upload className="mr-3 text-purple-600" size={24} />
                <span className="font-bold text-purple-800">Upload Image</span>
              </Button>
            </div>
            
            {/* Enhanced Drag and Drop area */}
            <motion.div
              className={`mt-6 p-8 border-3 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center h-64 ${
                dragActive ? "border-blue-500 bg-blue-50/80 shadow-lg" : "border-gray-300 bg-gray-50/60"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              whileHover={{ boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={triggerFileInput}
            >
              <div className="mb-6">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center text-blue-600 shadow-xl"
                  animate={{ 
                    scale: dragActive ? [1, 1.1, 1] : 1,
                    rotate: dragActive ? [0, 5, 0, -5, 0] : 0
                  }}
                  transition={{ repeat: dragActive ? Infinity : 0, duration: 2 }}
                >
                  <Upload size={32} />
                </motion.div>
              </div>
              <p className="text-gray-700 font-bold text-lg">Drag and drop your food image here</p>
              <p className="text-gray-500 mt-2">or click to browse your files</p>
              
              {/* Animated dashed border */}
              <motion.div 
                className="absolute inset-0 rounded-2xl border-4 border-dashed border-blue-400 opacity-0 pointer-events-none"
                animate={{ 
                  opacity: dragActive ? 0.6 : 0,
                  scale: dragActive ? [1, 1.02, 1] : 1
                }}
                transition={{ repeat: dragActive ? Infinity : 0, duration: 2 }}
              />
            </motion.div>
          </motion.div>
          
          {/* Preview Image - Enhanced visuals */}
          <AnimatePresence>
            {image && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={image} 
                    alt="Food" 
                    className="w-full h-auto object-cover rounded-2xl" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {foodName && !isLoading && (
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-6 text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-bold">{foodName}</h3>
                      <div className="flex items-center mt-2 bg-black/30 w-fit px-3 py-1 rounded-full">
                        <Zap size={18} className="text-yellow-300" />
                        <span className="ml-2 font-semibold">{calorieCount} calories</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Enhanced Loading State */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                className="flex flex-col items-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative w-24 h-24">
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-blue-200"
                  ></motion.div>
                  <motion.div 
                    className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                  <motion.div 
                    className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-600"
                    animate={{ rotate: -180 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  ></motion.div>
                </div>
                <motion.p 
                  className="mt-6 text-gray-700 font-bold text-xl"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Analyzing your food...
                </motion.p>
                <p className="text-gray-500 text-md mt-2">We're identifying nutrients and calculating macros</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results Section - Enhanced visuals */}
          <AnimatePresence>
            {macronutrients && !isLoading && (
              <motion.div 
                className="mt-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-100 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <motion.h3 
                    className="text-2xl font-extrabold text-gray-800 flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div 
                      className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                    />
                    Macronutrient Breakdown
                  </motion.h3>
                  <motion.div 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-md font-bold shadow-md"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {calorieCount} calories
                  </motion.div>
                </div>
                
                {/* Enhanced Macronutrient Circle Graph */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="relative w-56 h-56">
                    <motion.div 
                      className="absolute inset-0 rounded-full shadow-2xl"
                      animate={{ boxShadow: ["0 10px 25px rgba(59, 130, 246, 0.3)", "0 10px 25px rgba(139, 92, 246, 0.3)", "0 10px 25px rgba(236, 72, 153, 0.3)", "0 10px 25px rgba(59, 130, 246, 0.3)"] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="carbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a78bfa" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="fatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f472b6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                      
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#f0f0f0" strokeWidth="10" />
                      
                      {/* Carbs Segment */}
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="url(#carbGradient)" 
                        strokeWidth="10"
                        strokeDasharray={`${percentages.carbPercent * 2.83} 283`}
                        strokeDashoffset="0"
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${percentages.carbPercent * 2.83} 283` }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                      />
                      
                      {/* Protein Segment */}
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="url(#proteinGradient)" 
                        strokeWidth="10"
                        strokeDasharray={`${percentages.proteinPercent * 2.83} 283`}
                        strokeDashoffset={`${-percentages.carbPercent * 2.83}`}
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${percentages.proteinPercent * 2.83} 283` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                      
                      {/* Fat Segment */}
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="url(#fatGradient)" 
                        strokeWidth="10"
                        strokeDasharray={`${percentages.fatPercent * 2.83} 283`}
                        strokeDashoffset={`${-(percentages.carbPercent + percentages.proteinPercent) * 2.83}`}
                        initial={{ strokeDasharray: "0 283" }}
                        animate={{ strokeDasharray: `${percentages.fatPercent * 2.83} 283` }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                      />
                      
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="28" 
                        fill="white" 
                        stroke="#f8fafc" 
                        strokeWidth="2"
                        initial={{ r: 0 }}
                        animate={{ r: 28 }}
                        transition={{ duration: 0.5, delay: 1 }}
                      />
                      
                      <motion.text 
                        x="50" 
                        y="45" 
                        fontSize="10" 
                        textAnchor="middle" 
                        fill="#6b7280"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        Total
                      </motion.text>
                      <motion.text 
                        x="50" 
                        y="60" 
                        fontSize="18" 
                        fontWeight="bold" 
                        textAnchor="middle" 
                        fill="#1f2937"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        {calorieCount}
                      </motion.text>
                      <motion.text 
                        x="50" 
                        y="72" 
                        fontSize="10" 
                        textAnchor="middle" 
                        fill="#6b7280"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3 }}
                      >
                        calories
                      </motion.text>
                    </svg>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="space-y-5">
                      <ProgressBar value={macronutrients.carbs} color="bg-gradient-to-r from-blue-400 to-blue-600" label="Carbohydrates" />
                      <ProgressBar value={macronutrients.proteins} color="bg-gradient-to-r from-purple-400 to-purple-600" label="Proteins" />
                      <ProgressBar value={macronutrients.fats} color="bg-gradient-to-r from-pink-400 to-pink-600" label="Fats" />
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 pt-4 font-medium">
                      <motion.div 
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 }}
                      >
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                        <span>Carbs {percentages.carbPercent}%</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                        <span>Protein {percentages.proteinPercent}%</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                      >
                        <div className="w-4 h-4 bg-pink-500 rounded-full mr-2"></div>
                        <span>Fats {percentages.fatPercent}%</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Nutritional Information */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  <div className="bg-blue-50/70 p-6 rounded-xl border border-blue-100">
                    <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                      <CameraIcon size={20} className="mr-2 text-blue-600" />
                      Additional Nutrients
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Fiber</span>
                        <span className="font-semibold">{macronutrients.fiber}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Sugar</span>
                        <span className="font-semibold">{macronutrients.sugar}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50/70 p-6 rounded-xl border border-purple-100">
                    <h4 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
                      <Heart size={20} className="mr-2 text-purple-600" />
                      Nutrition Tip
                    </h4>
                    <p className="text-gray-700">{nutritionTip}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Feedback Message */}
          <AnimatePresence>
            {feedback && (
              <motion.div 
                className="p-4 bg-red-50 text-red-800 rounded-lg mt-4 border border-red-200 flex items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <X size={20} className="mr-3 text-red-500" />
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
