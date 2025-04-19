import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Brush, ShieldCheck, Sparkles, ChevronRight } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particlesVisible, setParticlesVisible] = useState(false);

  useEffect(() => {
    // Trigger initial animations after a small delay
    setTimeout(() => setIsLoaded(true), 300);
    setTimeout(() => setParticlesVisible(true), 1200);
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setTimeout(() => goToLogin(role), 1200);
  };

  const goToLogin = (role) => {
    if (role === "user") {
      navigate("/user-login");
    } else if (role === "creator") {
      navigate("/creator-login");
    } else if (role === "admin") {
      navigate("/admin-login");
    }
  };
  
  const roles = [
    {
      id: "user",
      title: "User",
      description: "Immerse yourself in content, connect with creators, and enjoy a personalized experience",
      icon: User,
      color: "emerald",
      gradient: "from-emerald-400 to-green-500",
      hoverGradient: "from-emerald-300 to-green-600",
      particleColor: "#10b981",
      highlight: "#4ade80"
    },
    {
      id: "creator",
      title: "Creator",
      description: "Showcase your talents, build your audience, and transform your passion into opportunity",
      icon: Brush,
      color: "blue",
      gradient: "from-blue-400 to-indigo-500",
      hoverGradient: "from-blue-300 to-indigo-600",
      particleColor: "#3b82f6",
      highlight: "#60a5fa"
    },
    {
      id: "admin",
      title: "Administrator",
      description: "Oversee platform operations, ensure quality, and shape the future of our community",
      icon: ShieldCheck,
      color: "purple",
      gradient: "from-purple-400 to-violet-500",
      hoverGradient: "from-purple-300 to-violet-600",
      particleColor: "#8b5cf6",
      highlight: "#a78bfa"
    }
  ];

  // Generate an array of 60 particles with randomized properties
  const particles = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1, // Size between 1-3px
    x: Math.random() * 100, // Random X position (percentage)
    y: Math.random() * 100, // Random Y position (percentage)
    speed: Math.random() * 30 + 50, // Animation duration between 50-80s
    delay: Math.random() * 30, // Random delay up to 30s
    opacity: Math.random() * 0.5 + 0.3 // Opacity between 0.3-0.8
  }));

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-black"
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.15), transparent 70%), 
                   radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.15), transparent 70%), 
                   radial-gradient(ellipse at 50% 50%, rgba(17, 24, 39, 1), rgba(0, 0, 0, 1))`
      }}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className={`absolute inset-0 bg-grid-pattern opacity-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-20' : ''}`}></div>
        
        {/* Glowing orbs */}
        <div className={`absolute -top-40 -left-20 w-96 h-96 rounded-full transition-all duration-2000 ease-in-out ${isLoaded ? 'animate-float-slow opacity-10' : 'opacity-0'}`} 
          style={{background: "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0) 70%)"}}></div>
        <div className={`absolute top-1/4 right-1/4 w-64 h-64 rounded-full transition-all duration-2000 delay-300 ease-in-out ${isLoaded ? 'animate-float-slow-reverse opacity-10' : 'opacity-0'}`}
          style={{background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0) 70%)", animationDelay: "2s"}}></div>
        <div className={`absolute bottom-0 right-1/3 w-80 h-80 rounded-full transition-all duration-2000 delay-500 ease-in-out ${isLoaded ? 'animate-float-slow opacity-10' : 'opacity-0'}`}
          style={{background: "radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, rgba(16, 185, 129, 0) 70%)", animationDelay: "1s"}}></div>
      </div>

      {/* Constant slow-moving particles */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${particlesVisible ? 'opacity-100' : 'opacity-0'}`} id="particles-container">
        {particles.map(particle => (
          <div 
            key={particle.id} 
            className="absolute w-1 h-1 rounded-full bg-white animate-particle-rise"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity,
              animation: `particle-rise ${particle.speed}s linear infinite`,
              animationDelay: `${particle.delay}s`
            }}
          ></div>
        ))}
      </div>

      {/* Main content */}
      <div className={`relative z-10 w-full max-w-5xl transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="mb-12 text-center">
          {/* Main heading with animated text reveal */}
          <div className="overflow-hidden mb-2">
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold transition-transform duration-1000 ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-white inline-block">Choose Your</span>
              <span className="relative mx-2 inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 animate-pulse-slow">Journey</span>
                <Sparkles className="absolute -top-5 -right-8 text-yellow-300 animate-sparkle w-6 h-6" />
              </span>
            </h1>
          </div>
          
          {/* Subtitle with staggered animation */}
          <div className="overflow-hidden">
            <p className={`text-lg sm:text-xl text-indigo-100 opacity-80 max-w-2xl mx-auto transition-transform duration-1000 delay-300 ${isLoaded ? 'translate-y-0' : 'translate-y-full'}`}>
              Select your perfect role and unlock a uniquely tailored experience designed for your needs.
            </p>
          </div>
        </div>

        {/* Role selection cards - Fixed hover issue */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <div 
              key={role.id}
              className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ transitionDelay: `${500 + index * 200}ms` }}
            >
              <button
                onClick={() => handleRoleSelect(role.id)}
                className={`group relative flex flex-col items-start w-full h-full px-6 py-8 overflow-hidden rounded-2xl transition-all duration-500 ${
                  selectedRole === role.id 
                    ? `scale-105 shadow-2xl shadow-${role.color}-900/30 border-${role.color}-500/50` 
                    : 'hover:scale-[1.03] border-white/5'
                } border bg-black/40 backdrop-blur-md`}
              >
                {/* Card background elements */}
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className={`absolute inset-0 bg-grid-overlay opacity-20`}></div>
                
                {/* Animated border gradient - Fixed z-index to prevent content disappearing */}
                <div className={`absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100 ${selectedRole === role.id ? 'opacity-100' : ''} transition-opacity duration-500 z-0`}>
                  <div className="absolute inset-0 rounded-2xl bg-black/90"></div>
                </div>

                {/* Top highlight line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${role.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 ${selectedRole === role.id ? 'scale-x-100' : ''} transition-transform duration-700 ease-out`}></div>
                
                {/* Animated icon */}
                <div className={`relative mb-6 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${role.gradient} group-hover:${role.hoverGradient} transition-all duration-500 z-10`}>
                  <role.icon size={28} className={`text-white transform group-hover:scale-110 ${selectedRole === role.id ? 'scale-110 animate-pulse-slow' : ''} transition-transform duration-500`} />
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-100 ${selectedRole === role.id ? 'opacity-100' : ''} filter blur-xl transition-opacity duration-500 -z-10`} style={{transform: 'scale(0.8)'}}></div>
                </div>
                
                {/* Role title - Ensured content is above background layers */}
                <h3 className={`text-2xl font-bold mb-3 text-white group-hover:text-${role.color}-300 ${selectedRole === role.id ? `text-${role.color}-300` : ''} transition-colors duration-300 relative z-10`}>
                  {role.title}
                </h3>
                
                {/* Role description - Ensured content is above background layers */}
                <p className="text-indigo-100/70 mb-8 transition-opacity duration-300 group-hover:opacity-90 relative z-10">
                  {role.description}
                </p>
                
                {/* Continue button - Ensured content is above background layers */}
                <div className="mt-auto w-full relative z-10">
                  <div className={`flex items-center justify-between rounded-xl py-3 px-5 bg-gradient-to-r ${role.gradient} group-hover:${role.hoverGradient} transition-all duration-500 overflow-hidden relative`}>
                    <span className="font-medium text-white">Continue as {role.title}</span>
                    <ChevronRight className="text-white transition-transform duration-300 group-hover:translate-x-1" />
                    
                    {/* Button shine effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                  </div>
                </div>
                
                {/* Selection state animation */}
                {selectedRole === role.id && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/90 z-20 animate-fade-in"></div>
                    <div className="absolute inset-0 flex items-center justify-center z-30 animate-fade-in">
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full bg-${role.color}-500/20 flex items-center justify-center animate-pulse-fast`}>
                          <div className={`w-10 h-10 rounded-full bg-${role.color}-500/50 flex items-center justify-center`}>
                            <role.icon size={20} className="text-white" />
                          </div>
                        </div>
                        <p className="text-white mt-4 text-lg font-medium">Redirecting...</p>
                      </div>
                    </div>
                    
                    {/* Particle explosion on selection */}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-2 h-2 rounded-full z-20 animate-particle-explosion"
                        style={{
                          backgroundColor: role.highlight,
                          top: '50%',
                          left: '50%',
                          animationDelay: `${i * 0.05}s`,
                          opacity: 0.8
                        }}
                      ></div>
                    ))}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stylized decorative corner elements */}
      <div className={`absolute top-0 left-0 w-64 h-64 pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-20' : 'opacity-0'}`}>
        <div className="absolute top-8 left-8 w-40 h-[1px] bg-gradient-to-r from-transparent to-indigo-500/50"></div>
        <div className="absolute top-8 left-8 w-[1px] h-40 bg-gradient-to-b from-transparent to-indigo-500/50"></div>
      </div>
      
      <div className={`absolute bottom-0 right-0 w-64 h-64 pointer-events-none transition-opacity duration-1000 ${isLoaded ? 'opacity-20' : 'opacity-0'}`}>
        <div className="absolute bottom-8 right-8 w-40 h-[1px] bg-gradient-to-l from-transparent to-indigo-500/50"></div>
        <div className="absolute bottom-8 right-8 w-[1px] h-40 bg-gradient-to-t from-transparent to-indigo-500/50"></div>
      </div>

      {/* Custom animation keyframes */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(-25px) translateX(15px); }
          66% { transform: translateY(25px) translateX(-15px); }
        }
        
        @keyframes float-slow-reverse {
          0%, 100% { transform: translateY(0) translateX(0); }
          33% { transform: translateY(25px) translateX(-15px); }
          66% { transform: translateY(-25px) translateX(15px); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.95); }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        /* Simple constant rising particle animation */
        @keyframes particle-rise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: var(--opacity, 0.6); }
          90% { opacity: var(--opacity, 0.6); }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        
        @keyframes particle-explosion {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(var(--random-x) * 150px), calc(var(--random-y) * 150px)) scale(1); opacity: 0; }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes shine {
          100% { left: 125%; }
        }
        
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
        }
        
        .animate-float-slow-reverse {
          animation: float-slow-reverse 5s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 1.5s ease-in-out infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
        
        .animate-particle-explosion {
          animation: particle-explosion 1s ease-out forwards;
          --random-x: ${Math.random() * 2 - 1};
          --random-y: ${Math.random() * 2 - 1};
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-shine {
          animation: shine 1.5s forwards linear;
        }
        
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        
        .bg-grid-overlay {
          background-size: 15px 15px;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default SelectRole;