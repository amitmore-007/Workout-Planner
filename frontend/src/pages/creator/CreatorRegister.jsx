import { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, UserPlus, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreatorRegister = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const canvasRef = useRef(null);
  const backgroundRef = useRef(null);
  const formRef = useRef(null);
    const navigate = useNavigate();

  // Initialize animations
  useEffect(() => {
    // Staggered entrance animation for form
    setTimeout(() => {
      setShowForm(true);
    }, 800);
    
    // Initialize the interactive background
    initCanvas();
    
    // Create parallax effect for background image
    initParallaxEffect();
    
    return () => {
      if (canvasRef.current) {
        cancelAnimationFrame(canvasRef.current.animationFrame);
      }
    };
  }, []);

  // Calculate form progress
  useEffect(() => {
    const filledFields = Object.values(form).filter(val => val.trim() !== '').length;
    setFormProgress((filledFields / 3) * 100);
  }, [form]);

  // Initialize interactive canvas animation
  const initCanvas = () => {
    const canvas = document.getElementById('background-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particles configuration
    const particlesArray = [];
    const numberOfParticles = 100;
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${200 + Math.random() * 55}, ${0.1 + Math.random() * 0.2})`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Create particles
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        
        // Connect particles with lines
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(140, 255, 230, ${0.1 - distance/1000})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      }
      
      canvasRef.current = {
        animationFrame: requestAnimationFrame(animate)
      };
    };
    
    animate();
    
    // Resize event
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  };
  
  // Initialize parallax effect for background
  const initParallaxEffect = () => {
    const handleMouseMove = (e) => {
      if (!backgroundRef.current || !formRef.current) return;
      
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      // Background parallax (subtle)
      const backgroundX = (clientX - centerX) * -0.02;
      const backgroundY = (clientY - centerY) * -0.02;
      backgroundRef.current.style.transform = `translate(${backgroundX}px, ${backgroundY}px) scale(1.1)`;
      
      // Form parallax (very subtle)
      const formX = (clientX - centerX) * 0.01;
      const formY = (clientY - centerY) * 0.01;
      formRef.current.style.transform = `translate(${formX}px, ${formY}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = (field) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await fetch('http://localhost:5000/api/creator/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      navigate('/creator-login');
      
      // Show success animation
      const formElement = formRef.current;
      if (formElement) {
        formElement.classList.add('success-animation');
        
        setTimeout(() => {
          setIsLoading(false);
          alert('Registered successfully');
          formElement.classList.remove('success-animation');
        }, 1500);
      } else {
        setIsLoading(false);
        alert('Registered successfully');
      }
    } catch (err) {
      setTimeout(() => {
        setIsLoading(false);
        setError("Registration failed. Please try again.");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-black">
      {/* Your image from assets folder */}
      <div className="absolute inset-0 z-0" ref={backgroundRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-gray-900/80 to-emerald-900/50 z-0"></div>
        <img 
          src="/src/assets/creator-register.jpg" 
          alt="Background" 
          className="w-full h-full object-fit scale-110 filter blur-sm transition-all duration-1000"
        />
      </div>
      
      {/* Interactive canvas for particle network */}
      <canvas id="background-canvas" className="absolute inset-0 z-0"></canvas>
      
      {/* Animated glowing orbs */}
      <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full filter blur-3xl opacity-20 -top-40 -left-20 animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-cyan-500/20 rounded-full filter blur-3xl opacity-20 top-1/2 -right-40 animate-pulse" 
           style={{animationDelay: "1s", animationDuration: "4s"}}></div>
      <div className="absolute w-64 h-64 bg-teal-500/20 rounded-full filter blur-3xl opacity-10 bottom-0 left-1/3 animate-pulse"
           style={{animationDelay: "2s", animationDuration: "5s"}}></div>
      
      {/* Main content with staggered animations */}
      <div 
        className={`relative z-20 w-full max-w-md transition-all duration-1000 ease-out ${
          showForm ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        ref={formRef}
      >
        <div className="backdrop-blur-xl bg-gray-900/40 p-10 rounded-3xl shadow-2xl border border-gray-700/30 overflow-hidden">
          {/* Animated logo with floating effect */}
          <div className={`flex justify-center mb-8 transition-all duration-700 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800/80 to-gray-900/60 flex items-center justify-center shadow-lg hover:shadow-emerald-500/20 transition-all duration-500 relative overflow-hidden group">
              {/* Background animation for logo */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="w-full h-full animate-spin-slow bg-gradient-conic from-emerald-600/20 via-teal-500/0 to-cyan-400/20"></div>
                </div>
              </div>
              
              {/* Logo icon with glow effect */}
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                <UserPlus className="w-10 h-10 text-emerald-400 drop-shadow-glow" />
              </div>
              
              {/* Animated ring */}
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 blur-sm group-hover:animate-pulse transition-opacity duration-500"></div>
            </div>
          </div>
          
          {/* Title with text reveal animation */}
          <div className="text-center overflow-hidden">
            <h2 
              className={`text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-200 bg-clip-text text-transparent mb-1 transition-all duration-700 delay-100 ${
                showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              CREATOR SPACE
            </h2>
            <p 
              className={`text-gray-300 text-center mb-8 transition-all duration-700 delay-200 ${
                showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              Join our exclusive creative community
            </p>
          </div>
          
          {/* Progressive form progress bar */}
          <div 
            className={`mb-8 transition-all duration-700 delay-300 ${
              showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="w-full h-1 bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Error display with shake animation */}
          {error && (
            <div 
              className="mb-6 p-3 bg-red-900/30 backdrop-blur-sm border border-red-800/50 rounded-xl text-red-300 text-center animate-shake"
            >
              {error}
            </div>
          )}
          
          {/* Registration form with animated field interactions */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name field */}
            <div 
              className={`relative group transition-all duration-700 delay-400 ${
                showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${
                activeField === 'name' 
                  ? 'from-emerald-500 to-cyan-500 blur-sm'
                  : 'from-emerald-600/50 to-teal-600/50 blur-sm opacity-0'
              } ${activeField === 'name' ? 'opacity-80' : 'group-hover:opacity-40'} transition duration-500`}></div>
              
              <div className="relative">
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className="w-full bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm rounded-xl pl-12 pr-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all duration-300"
                />
                <div className={`absolute left-4 top-4 transition-all duration-300 ${
                  activeField === 'name' ? 'text-emerald-400 scale-110' : 'text-emerald-500/70'
                }`}>
                  <User size={20} />
                </div>
              </div>
            </div>
            
            {/* Email field */}
            <div 
              className={`relative group transition-all duration-700 delay-500 ${
                showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${
                activeField === 'email' 
                  ? 'from-emerald-500 to-cyan-500 blur-sm'
                  : 'from-emerald-600/50 to-teal-600/50 blur-sm opacity-0'
              } ${activeField === 'email' ? 'opacity-80' : 'group-hover:opacity-40'} transition duration-500`}></div>
              
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="w-full bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm rounded-xl pl-12 pr-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all duration-300"
                />
                <div className={`absolute left-4 top-4 transition-all duration-300 ${
                  activeField === 'email' ? 'text-emerald-400 scale-110' : 'text-emerald-500/70'
                }`}>
                  <Mail size={20} />
                </div>
              </div>
            </div>
            
            {/* Password field */}
            <div 
              className={`relative group transition-all duration-700 delay-600 ${
                showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${
                activeField === 'password' 
                  ? 'from-emerald-500 to-cyan-500 blur-sm'
                  : 'from-emerald-600/50 to-teal-600/50 blur-sm opacity-0'
              } ${activeField === 'password' ? 'opacity-80' : 'group-hover:opacity-40'} transition duration-500`}></div>
              
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  className="w-full bg-gray-900/50 border border-gray-700/50 backdrop-blur-sm rounded-xl pl-12 pr-4 py-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 transition-all duration-300"
                />
                <div className={`absolute left-4 top-4 transition-all duration-300 ${
                  activeField === 'password' ? 'text-emerald-400 scale-110' : 'text-emerald-500/70'
                }`}>
                  <Lock size={20} />
                </div>
              </div>
            </div>
            
            {/* Submit button with animated states */}
            <div 
              className={`transition-all duration-700 delay-700 ${
                showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <button
                type="submit" 
                disabled={isLoading}
                className={`relative w-full py-4 rounded-xl font-bold text-white shadow-lg overflow-hidden group ${
                  isLoading 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500'
                }`}
              >
                {/* Button shine effect */}
                <span className="absolute w-40 h-40 -mt-12 -translate-x-32 rotate-45 bg-white opacity-10 group-hover:translate-x-96 duration-1000 ease-in-out transition-all"></span>
                <span className="absolute w-40 h-40 -mt-12 -translate-x-32 rotate-45 bg-white opacity-10 group-hover:translate-x-96 duration-1000 delay-100 ease-in-out transition-all"></span>
                
                {/* Loading or normal state */}
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating Your Space...</span>
                    </>
                  ) : (
                    <>
                      <span>BEGIN YOUR CREATOR JOURNEY</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
          
          {/* Login link with hover animation */}
          <div 
            className={`mt-8 text-center transition-all duration-700 delay-800 ${
              showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-gray-300">
              Already have an account?{" "}
              <a href="/creator-login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300 relative inline-block group">
                <span>Sign In</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </p>
          </div>
          
         
        </div>
        
       
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
        
        @keyframes success-animation {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.03);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        .success-animation {
          animation: success-animation 1s ease-in-out;
        }
        
        .drop-shadow-glow {
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5));
        }
        
        .bg-gradient-conic {
          background-image: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default CreatorRegister;