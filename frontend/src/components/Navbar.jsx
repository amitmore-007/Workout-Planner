import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  const navRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mouse position tracker for glow effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Navigation items
  const navItems = [
    { name: "Our Services", path: "/services" },
    { name: "Contact Us", path: "/contact" },
    { name: "Login", path: "/select-role", isButton: true }
  ];

  return (
    <motion.nav
      ref={navRef}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full flex justify-between items-center p-5 z-50 transition-all duration-500 backdrop-blur-md ${
        scrolled 
          ? "bg-black/90 shadow-lg shadow-cyan-500/20 border-b border-cyan-500/30" 
          : "bg-gradient-to-r from-black/50 via-black/60 to-black/50"
      }`}
    >
      {/* Animated background glow */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: scrolled ? 0.9 : 0.5,
          transition: "opacity 0.5s ease"
        }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-black/5 to-cyan-800/20 animate-pulse-slow"></div>
        
        {/* Moving glow effect that follows cursor */}
        <div 
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(0,0,0,0) 70%)",
            left: `${mousePosition.x - 128}px`,
            top: `${mousePosition.y - 128}px`,
            transition: "left 0.3s ease-out, top 0.3s ease-out"
          }}
        ></div>
        
        {/* Subtle floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-500/20 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: Math.random() * 0.5 + 0.2 
            }}
            animate={{ 
              y: ["-10%", "110%"],
              opacity: [0.1, 0.6, 0.1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.random() * 10 + 15,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Logo with weightlifter icon and enhanced animations */}
      <div className="flex items-center relative z-10">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
          className="mr-3 relative"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute inset-0 text-cyan-400/30 -z-10 blur-sm"
          >
            {/* Weightlifter SVG Icon Background Glow */}
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm10-4v5h-2V4H4v2H2V1h2v2h16V1h2zm-7 10.26V23h-2v-5h-2v5H9V11.26C6.93 10.17 5.5 8 5.5 5.5V5h2v.5C7.5 8 9.5 10 12 10s4.5-2 4.5-4.5V5h2v.5c0 2.5-1.43 4.67-3.5 5.76z"/>
            </svg>
          </motion.div>
          {/* Weightlifter SVG Icon Main */}
          <svg className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm10-4v5h-2V4H4v2H2V1h2v2h16V1h2zm-7 10.26V23h-2v-5h-2v5H9V11.26C6.93 10.17 5.5 8 5.5 5.5V5h2v.5C7.5 8 9.5 10 12 10s4.5-2 4.5-4.5V5h2v.5c0 2.5-1.43 4.67-3.5 5.76z"/>
          </svg>
        </motion.div>
        <div className="relative">
          <motion.h1 
            className="text-white text-3xl font-bold tracking-wide relative z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="relative">
              Fit
              <motion.span 
                className="absolute -inset-1 rounded bg-gradient-to-r from-cyan-500/20 to-transparent blur-lg"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
            <span className="bg-gradient-to-br from-cyan-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]">Sync</span>
          </motion.h1>
          <motion.div 
            className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-cyan-400 to-transparent w-0"
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Menu Links with enhanced hover effects */}
      <ul className="flex items-center space-x-6 relative z-10">
        {navItems.map((item, index) => (
          <motion.li 
            key={index}
            onHoverStart={() => setHoverItem(index)}
            onHoverEnd={() => setHoverItem(null)}
            className="relative"
          >
            {item.isButton ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="relative overflow-hidden group flex items-center justify-center"
                >
                  {/* Button background with animated gradient */}
                  <motion.div 
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                    animate={{ 
                      background: [
                        "linear-gradient(90deg, rgb(8, 145, 178) 0%, rgb(6, 182, 212) 100%)",
                        "linear-gradient(180deg, rgb(8, 145, 178) 0%, rgb(6, 182, 212) 100%)",
                        "linear-gradient(270deg, rgb(8, 145, 178) 0%, rgb(6, 182, 212) 100%)",
                        "linear-gradient(360deg, rgb(8, 145, 178) 0%, rgb(6, 182, 212) 100%)",
                      ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "100%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
                  />
                  
                  {/* Button text */}
                  <span className="relative z-10 px-6 py-2 text-white font-medium">
                    {item.name}
                  </span>
                  
                  {/* Subtle glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 -z-10"
                    initial={{ boxShadow: "0 0 0 rgba(6, 182, 212, 0)" }}
                    animate={{ boxShadow: "0 0 20px rgba(6, 182, 212, 0.7)" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </Link>
              </motion.div>
            ) : (
              <Link
                to={item.path}
                className="relative text-white hover:text-cyan-300 transition-all group"
              >
                <span className="relative">{item.name}</span>
                
                {/* Animated underline */}
                <motion.div
                  className="absolute left-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-cyan-500 to-cyan-300"
                  initial={{ width: 0 }}
                  animate={hoverItem === index ? { width: "100%" } : { width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                
                {/* Subtle text glow on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 blur-sm text-cyan-400 -z-10"
                  initial={{ opacity: 0 }}
                  animate={hoverItem === index ? { opacity: 0.7 } : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.name}
                </motion.div>
              </Link>
            )}
          </motion.li>
        ))}
      </ul>
      
      {/* Extra glow for navbar when scrolled to ensure visibility */}
      {scrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent -z-20"></div>
      )}
    </motion.nav>
  );
};

// Add this to your global CSS or tailwind.config.js
// @keyframes pulse-slow {
//   0%, 100% { opacity: 1; }
//   50% { opacity: 0.7; }
// }
// .animate-pulse-slow {
//   animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
// }

export default Navbar;