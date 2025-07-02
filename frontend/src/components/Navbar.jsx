import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoverItem, setHoverItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navRef = useRef(null);

 

  
  const navItems = [
    { name: "Services", path: "/services", icon: "⚡" },
    { name: "About", path: "/about", icon: "🚀" },
    { name: "Contact", path: "/contact", icon: "💬" },
    { name: "Get Started", path: "/select-role", isButton: true, icon: "✨" }
  ];

  return (
    <>
      {/* Floating Navigation Container */}
      <motion.div
        ref={navRef}
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: scrolled ? 15 : 25, 
          scale: scrolled ? 0.98 : 1 
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.25, 0.46, 0.45, 0.94],
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
        className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl"
      >
        {/* Main Navbar */}
        <motion.nav
          className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl transition-all duration-700 ${
            scrolled 
              ? "bg-gradient-to-r from-gray-900/95 via-black/90 to-gray-900/95 shadow-2xl shadow-purple-500/25 border border-white/10" 
              : "bg-gradient-to-br from-slate-900/80 via-gray-900/85 to-black/90 shadow-xl shadow-blue-500/20 border border-white/5"
          }`}
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary gradient overlay */}
            <motion.div 
              className="absolute inset-0"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.1) 50%, rgba(236,72,153,0.1) 100%)",
                  "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(236,72,153,0.1) 50%, rgba(168,85,247,0.1) 100%)",
                  "linear-gradient(225deg, rgba(236,72,153,0.1) 0%, rgba(168,85,247,0.1) 50%, rgba(59,130,246,0.1) 100%)",
                  "linear-gradient(315deg, rgba(168,85,247,0.1) 0%, rgba(59,130,246,0.1) 50%, rgba(236,72,153,0.1) 100%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Interactive cursor glow */}
            <motion.div
              className="absolute w-96 h-96 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)",
                left: `${mousePosition.x - 192}px`,
                top: `${mousePosition.y - 192}px`,
                filter: "blur(40px)"
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating orbs */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 6 + 4,
                  height: Math.random() * 6 + 4,
                  background: `linear-gradient(45deg, rgb(168,85,247), rgb(59,130,246), rgb(236,72,153))`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 50 - 25],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: Math.random() * 8 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3
                }}
              />
            ))}
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex justify-between items-center px-8 py-4">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {/* Animated Logo Icon */}
              <motion.div
                className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 p-0.5"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.span>
                </div>
                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 -z-10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ filter: "blur(8px)" }}
                />
              </motion.div>

              {/* Brand Name */}
              <div>
                <motion.h1 
                  className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  FitSync
                </motion.h1>
                <motion.div
                  className="h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Navigation Menu */}
            <div className="flex items-center space-x-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  onHoverStart={() => setHoverItem(index)}
                  onHoverEnd={() => setHoverItem(null)}
                  className="relative"
                >
                  {item.isButton ? (
                    // CTA Button
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={item.path}
                        className="relative group overflow-hidden rounded-xl block"
                      >
                        {/* Button background with morphing gradient */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600"
                          animate={{
                            background: [
                              "linear-gradient(90deg, rgb(147,51,234) 0%, rgb(37,99,235) 50%, rgb(219,39,119) 100%)",
                              "linear-gradient(180deg, rgb(37,99,235) 0%, rgb(219,39,119) 50%, rgb(147,51,234) 100%)",
                              "linear-gradient(270deg, rgb(219,39,119) 0%, rgb(147,51,234) 50%, rgb(37,99,235) 100%)"
                            ]
                          }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                        
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                          initial={{ x: "-100%" }}
                          animate={{ x: "200%" }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity, 
                            repeatDelay: 2,
                            ease: "easeInOut" 
                          }}
                        />
                        
                        <div className="relative z-10 flex items-center space-x-2 px-6 py-3">
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-semibold text-white">{item.name}</span>
                        </div>
                        
                        {/* Glow effect */}
                        <motion.div
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 -z-10"
                          style={{
                            background: "linear-gradient(90deg, rgb(147,51,234), rgb(37,99,235), rgb(219,39,119))",
                            filter: "blur(20px)"
                          }}
                          animate={{ 
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </Link>
                    </motion.div>
                  ) : (
                    // Regular nav items
                    <Link
                      to={item.path}
                      className="relative group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all"
                    >
                      {/* Hover background */}
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 to-white/10 opacity-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                          hoverItem === index 
                            ? { opacity: 1, scale: 1 } 
                            : { opacity: 0, scale: 0.8 }
                        }
                        transition={{ duration: 0.2 }}
                      />
                      
                      <span className="text-lg relative z-10">{item.icon}</span>
                      <span className="font-medium text-gray-200 group-hover:text-white relative z-10 transition-colors">
                        {item.name}
                      </span>
                      
                      {/* Active indicator */}
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        initial={{ width: 0, x: "-50%" }}
                        animate={
                          hoverItem === index 
                            ? { width: "80%" } 
                            : { width: 0 }
                        }
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.nav>

        {/* Subtle bottom glow */}
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent rounded-full blur-sm"
          animate={{ 
            opacity: scrolled ? 0.6 : 0.3,
            scale: scrolled ? 1.1 : 1
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </>
  );
};

export default Navbar;