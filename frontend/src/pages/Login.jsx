import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const navigate = useNavigate();
  const { email, password } = formData;
  
  useEffect(() => {
    // Trigger animation completion after a delay
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Store token in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      // Redirect user
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background video */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src="/api/placeholder/1920/1080" 
          alt="Gym workout" 
          className="object-cover w-full h-full" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900 to-black"></div>
      </div>
      
      {/* Animated particles for "sweat drops" effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-2 h-2 rounded-full bg-green-400 opacity-70 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* Main content */}
      <div className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="backdrop-blur-lg bg-gray-900 bg-opacity-70 p-8 rounded-2xl shadow-2xl border border-gray-800">
          {/* Logo and header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              POWER<span className="text-white">UP</span>
            </h2>
            <p className="text-gray-400 mt-2">Your fitness journey continues here</p>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-500 text-center animate-pulse">
              {error}
            </div>
          )}
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                className="w-full p-4 pl-12 bg-gray-800 bg-opacity-80 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                placeholder="Email"
              />
              <div className="absolute left-3 top-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="group relative">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                className="w-full p-4 pl-12 bg-gray-800 bg-opacity-80 rounded-lg border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-300"
                placeholder="Password"
              />
              <div className="absolute left-3 top-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full p-4 rounded-lg font-bold text-white shadow-lg transform hover:translate-y-1 transition-all duration-300 ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "START YOUR WORKOUT"
                )}
              </button>
            </div>
          </form>
          
          {/* Registration link */}
          <div className="mt-6 text-center text-gray-400">
            <p>
              New to our gym?{" "}
              <a href="/register" className="text-green-400 hover:text-green-300 font-medium transition-colors duration-300">
                Sign Up Now
              </a>
            </p>
          </div>
          
          {/* Motivational quote */}
          <div className="mt-8 p-4 border-t border-gray-800">
            <p className="text-center text-gray-500 italic text-sm">
              "The only bad workout is the one that didn't happen."
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative dumbbells */}
      <div className="absolute bottom-4 left-4 text-gray-700 opacity-30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <div className="absolute top-4 right-4 text-gray-700 opacity-30 transform rotate-45">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
    </div>
  );
};

export default Login;