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
    // Trigger entrance animation
    setAnimationComplete(true);
    
    // Create particle animation
    const interval = setInterval(() => {
      createParticle();
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to create animated fitness particles
  const createParticle = () => {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    const particle = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const xPos = Math.random() * window.innerWidth;
    const yPos = Math.random() * window.innerHeight;
    
    particle.className = 'absolute rounded-full bg-gradient-to-r from-red-500 to-orange-500 opacity-70';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${xPos}px`;
    particle.style.top = `${yPos}px`;
    particle.style.animation = `float 8s linear forwards`;
    
    particles.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      particles.removeChild(particle);
    }, 8000);
  };

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
  
      // ✅ Store token correctly
      localStorage.setItem("token", data.token); // Store only the token
      localStorage.setItem("userInfo", JSON.stringify(data)); // Store user info separately
  
      console.log("Token Stored:", data.token); // Debugging
  
      // Redirect user to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
         style={{ backgroundImage: "url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80)" }}>
      
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-rose-900/30 z-0"></div>
      
      {/* Animated particles container */}
      <div id="particles" className="absolute inset-0 z-10 overflow-hidden"></div>
      
      {/* Animated glowing orbs */}
      <div className="absolute w-52 h-52 bg-red-500 rounded-full filter blur-3xl opacity-20 -top-20 -left-20 animate-pulse"></div>
      <div className="absolute w-64 h-64 bg-orange-500 rounded-full filter blur-3xl opacity-10 top-1/2 -right-20 animate-pulse" 
           style={{animationDelay: "1s", animationDuration: "4s"}}></div>
      <div className="absolute w-40 h-40 bg-yellow-500 rounded-full filter blur-3xl opacity-10 bottom-0 left-1/3 animate-pulse"
           style={{animationDelay: "2s", animationDuration: "5s"}}></div>
      
      {/* Main content */}
      <div className={`relative z-20 w-96 transform transition-all duration-1000 ease-out ${
        animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}>
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Animated flame logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 text-white relative z-10">
                <path fill="currentColor" d="M13.5,1c0,0,2.5,2.5,2.5,6c0,2.3-1.9,4.2-4.2,4.2c-2.3,0-4.2-1.9-4.2-4.2c0-0.7,0.2-1.3,0.5-1.8C6,7.8,5,11.1,5,14c0,4.4,3.6,8,8,8s8-3.6,8-8C21,7.1,17.4,2,13.5,1z"/>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          {/* Heading with gradient text */}
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent mb-1">
            FITNESS CHAMP
          </h2>
          <p className="text-white/70 text-center mb-8">Unlock your potential</p>
          
          {/* Error display */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/30 backdrop-blur-sm border border-red-500/50 rounded-xl text-red-300 text-center animate-pulse">
              {error}
            </div>
          )}
          
          {/* Login form with animated focus effects */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white backdrop-blur-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Your Email"
                />
                <div className="absolute left-3 top-3.5 text-orange-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative">
                <input 
                  type="password" 
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white backdrop-blur-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="Your Password"
                />
                <div className="absolute left-3 top-3.5 text-orange-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <button
                type="submit" 
                disabled={isLoading}
                className={`relative w-full py-3 rounded-xl font-bold text-white shadow-lg overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
                }`}
              >
                <span className="absolute w-64 h-32 mt-12 group-hover:mt-0 duration-700 ease-in-out transition-all -translate-x-20 rotate-45 bg-white opacity-10"></span>
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "POWER UP YOUR SESSION"
                )}
              </button>
            </div>
          </form>
          
          {/* Registration link */}
          <div className="mt-6 text-center text-white/80">
            <p>
              New to our gym?{" "}
              <a href="/register" className="text-orange-400 hover:text-orange-300 font-medium transition-colors duration-300 relative inline-block group">
                <span>Sign Up Now</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </p>
          </div>
          
          {/* Animated motivational quote */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-white/40 italic text-sm relative overflow-hidden">
              <span className="inline-block animate-marquee whitespace-nowrap">
                "The only bad workout is the one that didn't happen. Today is your day to make it count."
              </span>
            </p>
          </div>
        </div>
        
        {/* Footer links with hover effect */}
        <div className="mt-4 text-center">
          <a href="#" className="text-white/50 mx-3 text-sm hover:text-white transition-colors duration-300 relative inline-block group">
            <span>Terms</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/50 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="text-white/50 mx-3 text-sm hover:text-white transition-colors duration-300 relative inline-block group">
            <span>Privacy</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/50 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="text-white/50 mx-3 text-sm hover:text-white transition-colors duration-300 relative inline-block group">
            <span>Help</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/50 group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>
      </div>
      
      {/* Add the keyframes animation for floating particles */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;