import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { ChevronRight, Activity, User, Mail, Lock, Weight, Ruler, Target, Flame, Apple, Dumbbell } from "lucide-react";

const Register = () => {
  // Video states with refs for managing multiple videos
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRefs = useRef([]);
  const videos = [
    "/videos/fitness-video-1.mp4",
    "/videos/fitness-video-2.mp4",
    "/videos/fitness-video-3.mp4"
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    goal: "weight loss",
    activityLevel: "sedentary",
    dietPreference: "veg",
    fitnessExperience: "beginner",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Initialize video refs
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, videos.length);
    
    // Initial setup for all videos
    videos.forEach((_, index) => {
      if (videoRefs.current[index]) {
        // All videos should be loaded
        videoRefs.current[index].load();
        
        // Set playback rate slightly slower to avoid potential stuttering
        videoRefs.current[index].playbackRate = 0.95;
        
        // Setup ended event listener to handle continuous play
        videoRefs.current[index].addEventListener('ended', () => {
          const nextIndex = (index + 1) % videos.length;
          setCurrentVideo(nextIndex);
        });
      }
    });
    
    // Start playing all videos immediately but keep them hidden
    // This ensures they're ready when it's their turn to be displayed
    setTimeout(() => {
      videos.forEach((_, index) => {
        if (videoRefs.current[index]) {
          const playPromise = videoRefs.current[index].play();
          
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              console.log("Video play error:", e);
              
              // If autoplay is prevented, try again with user interaction
              document.addEventListener('click', () => {
                videoRefs.current[index].play().catch(e => console.log("Retry play error:", e));
              }, { once: true });
            });
          }
        }
      });
    }, 100);
    
    // Set up transition timer as a backup
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 8000);

    return () => {
      clearInterval(interval);
      // Clean up event listeners
      videos.forEach((_, index) => {
        if (videoRefs.current[index]) {
          videoRefs.current[index].removeEventListener('ended', () => {});
        }
      });
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
  
      alert("Registration successful!");
      navigate("/"); 
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen overflow-hidden">
      {/* Video Background with multiple videos for smooth transition */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        {videos.map((src, index) => (
          <video
            key={index}
            ref={el => videoRefs.current[index] = el}
            muted
            playsInline
            loop
            className="absolute w-full h-full object-cover transition-opacity duration-2000"
            style={{ 
              filter: "brightness(0.50)",
              opacity: index === currentVideo ? 1 : 0,
              zIndex: index === currentVideo ? 1 : 0,
              transition: "opacity 1.5s ease-in-out"
            }}
          >
            <source src={src} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-blue-900/60 z-10"></div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-5xl p-6 z-20 flex flex-col md:flex-row gap-8">
        {/* Left side - Title and motivation */}
        <div className="w-full md:w-1/2 text-white flex flex-col justify-center space-y-6">
          <div className="flex items-center mb-6">
            <Activity className="text-green-400 w-10 h-10 mr-3" />
            <h1 className="text-4xl font-extrabold">FitRevolution</h1>
          </div>
          
          <h2 className="text-5xl font-bold leading-tight">
            Begin Your <span className="text-green-400">Fitness</span> Journey Today
          </h2>
          
          <p className="text-xl opacity-90">
            Join thousands of members who transformed their lives with personalized fitness plans and nutrition guidance.
          </p>
          
  
          
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 mt-6 border border-white/10 shadow-xl">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              <span className="bg-green-400 w-2 h-2 rounded-full mr-2"></span>
              Why Join FitSync?
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-green-400/20 p-1 rounded mr-2 mt-1">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span>Personalized workout plans based on your goals</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-400/20 p-1 rounded mr-2 mt-1">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span>Nutrition guidance tailored to your preferences</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-400/20 p-1 rounded mr-2 mt-1">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span>Progress tracking and real-time adjustments</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Right side - Form */}
        <div className="w-full md:w-1/2">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center">
              <div className="bg-green-400/20 p-2 rounded-full mr-3">
                <User className="text-green-400 w-5 h-5" />
              </div>
              Create Your Account
            </h2>
            
            {error && (
              <div className="bg-red-500/30 backdrop-blur-md border border-red-500 text-white px-4 py-3 rounded-lg mb-6 animate-pulse">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Full Name" 
                  required 
                  className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10" 
                />
              </div>
              
              <div className="relative group">
                <Mail className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="Email Address" 
                  required 
                  className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10" 
                />
              </div>
              
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Password" 
                  required 
                  className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Weight className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                  <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange} 
                    placeholder="Weight (kg)" 
                    required 
                    className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10" 
                  />
                </div>
                
                <div className="relative group">
                  <Ruler className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                  <input 
                    type="number" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange} 
                    placeholder="Height (cm)" 
                    required 
                    className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Target className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                  <select 
                    name="goal" 
                    value={formData.goal} 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm appearance-none transition-all duration-300 group-hover:bg-white/10"
                  >
                    <option value="weight loss" className="bg-gray-800">Weight Loss</option>
                    <option value="weight gain" className="bg-gray-800">Weight Gain</option>
                    <option value="maintenance" className="bg-gray-800">Maintenance</option>
                  </select>
                </div>
                
                <div className="relative group">
                  <Flame className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                  <select 
                    name="activityLevel" 
                    value={formData.activityLevel} 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm appearance-none transition-all duration-300 group-hover:bg-white/10"
                  >
                    <option value="sedentary" className="bg-gray-800">Sedentary</option>
                    <option value="lightly active" className="bg-gray-800">Lightly Active</option>
                    <option value="moderately active" className="bg-gray-800">Moderately Active</option>
                    <option value="very active" className="bg-gray-800">Very Active</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <Apple className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                  <select 
                    name="dietPreference" 
                    value={formData.dietPreference} 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm appearance-none transition-all duration-300 group-hover:bg-white/10"
                  >
                    <option value="veg" className="bg-gray-800">Vegetarian</option>
                    <option value="non-veg" className="bg-gray-800">Non-Vegetarian</option>
                    <option value="vegan" className="bg-gray-800">Vegan</option>
                    <option value="keto" className="bg-gray-800">Keto</option>
                  </select>
                </div>
                
                <div className="relative group">
                  <Dumbbell className="absolute left-3 top-3 text-green-400 w-5 h-5 transition-all duration-300 group-hover:text-green-300" />
                  <select 
                    name="fitnessExperience" 
                    value={formData.fitnessExperience} 
                    onChange={handleChange} 
                    required 
                    className="w-full pl-10 p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-400 backdrop-blur-sm appearance-none transition-all duration-300 group-hover:bg-white/10"
                  >
                    <option value="beginner" className="bg-gray-800">Beginner</option>
                    <option value="intermediate" className="bg-gray-800">Intermediate</option>
                    <option value="advanced" className="bg-gray-800">Advanced</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full p-4 mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-lg text-white font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
                disabled={loading}
              >
                <span>{loading ? "Creating Account..." : "Start Your Journey"}</span>
                {!loading && <ChevronRight className="w-5 h-5" />}
              </button>
            </form>
            
            <p className="text-center mt-6 text-white/70">
              Already have an account?{" "}
              <Link to="/login" className="text-green-400 font-semibold hover:underline transition-all duration-300">
                Sign In
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-white/10 text-center text-white/50 text-sm">
              By signing up, you agree to our <span className="text-green-400 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-green-400 cursor-pointer hover:underline">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;