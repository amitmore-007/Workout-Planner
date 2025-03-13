import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const footerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Track mouse position for hover effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Detect when footer enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    
    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  // Footer sections
  const footerSections = [
    {
      title: "Company",
      links: [
        { label: "About Us", url: "/about" },
        { label: "Our Team", url: "/team" },
        { label: "Careers", url: "/careers" },
        { label: "Press", url: "/press" }
      ]
    },
    {
      title: "Services",
      links: [
        { label: "Personal Training", url: "/services/training" },
        { label: "Nutrition Plans", url: "/services/nutrition" },
        { label: "Fitness Classes", url: "/services/classes" },
        { label: "Mobile App", url: "/app" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", url: "/blog" },
        { label: "Fitness Tips", url: "/tips" },
        { label: "Success Stories", url: "/stories" },
        { label: "FAQ", url: "/faq" }
      ]
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", url: "/privacy" },
        { label: "Terms of Use", url: "/terms" },
        { label: "Cookie Policy", url: "/cookies" },
        { label: "GDPR", url: "/gdpr" }
      ]
    }
  ];

  // Social media icons
  const socialIcons = [
    { name: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    { name: "Twitter", icon: "M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05 1.883 0 3.616-.636 5.001-1.721-1.771-.037-3.255-1.197-3.767-2.793.249.037.499.062.761.062.361 0 .724-.05 1.061-.137-1.847-.374-3.23-1.995-3.23-3.953v-.05c.537.299 1.16.486 1.82.511-1.086-.722-1.797-1.957-1.797-3.354 0-.748.199-1.434.548-2.032 1.983 2.443 4.964 4.04 8.306 4.215-.062-.3-.1-.611-.1-.923 0-2.22 1.796-4.028 4.028-4.028 1.16 0 2.207.486 2.943 1.272.91-.175 1.782-.512 2.556-.973-.299.935-.936 1.721-1.771 2.22.811-.088 1.597-.312 2.319-.624-.548.798-1.233 1.508-1.995 2.07z" },
    { name: "Facebook", icon: "M20.947 8.305a6.53 6.53 0 0 0-.419-2.216 4.61 4.61 0 0 0-2.633-2.633 6.606 6.606 0 0 0-2.186-.42c-.962-.043-1.267-.055-3.709-.055s-2.755 0-3.71.055a6.606 6.606 0 0 0-2.185.42 4.607 4.607 0 0 0-2.633 2.633 6.554 6.554 0 0 0-.419 2.185c-.043.963-.056 1.268-.056 3.71s0 2.754.056 3.71c.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.043 1.268.056 3.71.056s2.755 0 3.71-.056a6.59 6.59 0 0 0 2.186-.419 4.615 4.615 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.187.043-.962.056-1.267.056-3.71-.002-2.442-.002-2.752-.058-3.709zm-8.953 8.297c-2.554 0-4.623-2.069-4.623-4.623s2.069-4.623 4.623-4.623a4.623 4.623 0 0 1 0 9.246zm4.807-8.339a1.077 1.077 0 0 1-1.078-1.078 1.077 1.077 0 1 1 2.155 0c0 .596-.482 1.078-1.077 1.078z" },
    { name: "YouTube", icon: "M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766c-1.566-.43-7.831-.437-7.831-.437s-6.265-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const linkVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.footer
      ref={footerRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative w-full bg-gradient-to-b from-black/95 to-black overflow-hidden pt-16 pb-10 border-t border-cyan-500/30"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-black/5 to-black/80"></div>
        
        {/* Grid lines */}
        <motion.div 
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
        >
          <div className="h-full w-full border-l border-r border-cyan-500/30 mx-auto" style={{ maxWidth: "95%" }}></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        </motion.div>
        
        {/* Glowing orb following mouse */}
        <motion.div 
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(0,0,0,0) 70%)",
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
            transition: "left 0.5s ease-out, top 0.5s ease-out"
          }}
        ></motion.div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-500/30 rounded-full"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`, 
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: ["-10%", "110%"],
              opacity: [0.1, 0.7, 0.1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: Math.random() * 20 + 10,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Logo and about section */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-1"
          >
            <motion.div 
              className="flex items-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Logo with weightlifter icon */}
              <motion.div 
                className="mr-3 relative"
                animate={{ 
                  rotateY: [0, 360],
                  filter: ["drop-shadow(0 0 2px #06b6d4)", "drop-shadow(0 0 8px #06b6d4)", "drop-shadow(0 0 2px #06b6d4)"]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm10-4v5h-2V4H4v2H2V1h2v2h16V1h2zm-7 10.26V23h-2v-5h-2v5H9V11.26C6.93 10.17 5.5 8 5.5 5.5V5h2v.5C7.5 8 9.5 10 12 10s4.5-2 4.5-4.5V5h2v.5c0 2.5-1.43 4.67-3.5 5.76z"/>
                </svg>
              </motion.div>
              <div className="relative">
                <motion.h2 
                  className="text-white text-2xl font-bold tracking-wide"
                  animate={{ 
                    textShadow: ["0 0 4px rgba(6,182,212,0.5)", "0 0 8px rgba(6,182,212,0.8)", "0 0 4px rgba(6,182,212,0.5)"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span>Fit</span>
                  <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">Sync</span>
                </motion.h2>
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </motion.div>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-300 mb-6 leading-relaxed"
            >
              Transforming fitness through technology. We help you achieve your fitness goals with personalized workouts, nutrition plans, and progress tracking.
            </motion.p>
            
            {/* Newsletter signup */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <h3 className="text-white font-medium mb-3">Subscribe to our newsletter</h3>
              <div className="flex">
                <motion.input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-900 border border-cyan-700/50 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:border-cyan-500"
                  whileFocus={{ boxShadow: "0 0 0 2px rgba(6,182,212,0.3)" }}
                />
                <motion.button 
                  className="bg-gradient-to-r from-cyan-600 to-cyan-400 text-white px-4 py-2 rounded-r-md font-medium relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Join</span>
                  <motion.div
                    className="absolute inset-0 opacity-0 hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Footer link sections */}
          {footerSections.map((section, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <motion.h3 
                className="text-white font-semibold text-lg mb-6 relative inline-block"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {section.title}
                <motion.div 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                />
              </motion.h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li 
                    key={linkIndex}
                    variants={linkVariants}
                    custom={linkIndex}
                    whileHover={{ x: 3 }}
                  >
                    <Link 
                      to={link.url} 
                      className="text-gray-400 hover:text-cyan-300 transition-colors duration-300 flex items-center group"
                    >
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        whileHover={{ opacity: 1, width: 5 }}
                        className="bg-cyan-400 h-1 mr-2 rounded-full"
                      />
                      <span>{link.label}</span>
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-sm text-cyan-400 -z-10"
                        animate={{ opacity: [0, 0.1, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        {link.label}
                      </motion.div>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        
        {/* Divider with gradient animation */}
        <motion.div 
          className="w-full h-px my-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            variants={itemVariants}
            className="text-gray-400 text-sm mb-4 md:mb-0"
          >
            © {new Date().getFullYear()} FitSync. All rights reserved.
          </motion.div>
          
          {/* Social media icons */}
          <motion.div 
            variants={itemVariants}
            className="flex space-x-4"
          >
            {socialIcons.map((social, index) => (
              <motion.a
                key={index}
                href="#"
                aria-label={social.name}
                whileHover={{ 
                  scale: 1.2,
                  color: "#06b6d4",
                  boxShadow: "0 0 16px rgba(6, 182, 212, 0.6)" 
                }}
                className="text-gray-400 hover:text-cyan-400 transition-colors p-2 rounded-full bg-gray-900/50 backdrop-blur-sm relative"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={social.icon}/>
                </svg>
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0"
                  whileHover={{ 
                    opacity: 0.3,
                    boxShadow: "0 0 16px rgba(6, 182, 212, 0.8)"
                  }}
                />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.footer>
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

export default Footer;