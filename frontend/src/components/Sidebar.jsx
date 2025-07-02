import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Home, Dumbbell, Utensils, Camera,Bot, ChefHat,MessageCircle, LogOut, ChevronLeft, User, Zap, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/user-login");
  };

  const menuItems = [
    { name: "Dashboard", to: "/user-dashboard", icon: <Home className="w-5 h-5" />, color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-500/10" },
    { name: "Workout Plan", to: "/user-workouts", icon: <Dumbbell className="w-5 h-5" />, color: "from-green-500 to-emerald-500", bgColor: "bg-green-500/10" },
    { name: "Diet Plan", to: "/user-diet", icon: <Utensils className="w-5 h-5" />, color: "from-orange-500 to-red-500", bgColor: "bg-orange-500/10" },
    { name: "Food Scanner", to: "/user-scanner", icon: <Camera className="w-5 h-5" />, color: "from-purple-500 to-violet-500", bgColor: "bg-purple-500/10" },
    { name: "Recipe-generator", to: "/user-recipe-generator", icon: <ChefHat className="w-5 h-5" />, color: "from-pink-500 to-rose-500", bgColor: "bg-pink-500/10" },
    { name: "Chatbot", to: "/user-chatbot", icon: <Bot className="w-5 h-5" />, color: "from-indigo-500 to-blue-500", bgColor: "bg-indigo-500/10" },
    
  ];

  return (
    <motion.div
      initial={{ width: "288px" }}
      animate={{ 
        width: isOpen ? "288px" : "80px",
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 40,
          duration: 0.6
        }
      }}
      className="fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl z-30 overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5" />
      
      {/* Header Section */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold text-lg">FitPro</h3>
                  <p className="text-gray-400 text-xs">Fitness Dashboard</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <motion.button
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/10 flex-shrink-0"
          >
            <motion.div
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.div>
          </motion.button>
        </div>

        {/* User Profile Section */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <User className="w-6 h-6 text-white" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">Welcome back!</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-gray-400 text-xs">Pro Member</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Menu */}
      <nav className="relative z-10 p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.to;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredItem(index)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Link to={item.to} className="block">
                <motion.div
                  whileHover={{ x: isOpen ? 8 : 0, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative flex items-center ${isOpen ? 'space-x-4' : 'justify-center'} p-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} shadow-lg` 
                      : `hover:${item.bgColor} hover:border-white/20 border border-transparent`
                  }`}
                >
                  {/* Icon Container */}
                  <motion.div
                    animate={{
                      rotate: hoveredItem === index ? 360 : 0,
                      scale: isActive ? 1.1 : 1
                    }}
                    transition={{ duration: 0.6 }}
                    className={`p-2 rounded-lg flex-shrink-0 ${
                      isActive 
                        ? 'bg-white/20 shadow-lg' 
                        : `${item.bgColor} group-hover:bg-white/20`
                    }`}
                  >
                    <div className={isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}>
                      {item.icon}
                    </div>
                  </motion.div>

                  {/* Text */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`font-medium transition-all whitespace-nowrap ${
                          isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active Indicator */}
                  {isActive && isOpen && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 w-2 h-2 bg-white rounded-full shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Tooltip for collapsed state */}
                  {!isOpen && hoveredItem === index && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 10 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg border border-white/10 whitespace-nowrap z-50"
                    >
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-t border-white/10"></div>
                    </motion.div>
                  )}

                  {/* Hover Effect */}
                  {hoveredItem === index && !isActive && (
                    <motion.div
                      layoutId="hoverIndicator"
                      className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="relative z-10 p-4 border-t border-white/10">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: isOpen ? 8 : 0, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setHoveredItem('logout')}
          onHoverEnd={() => setHoveredItem(null)}
          className={`w-full flex items-center ${isOpen ? 'space-x-4' : 'justify-center'} p-3 rounded-xl transition-all duration-300 group hover:bg-red-500/10 hover:border-red-500/30 border border-transparent relative`}
        >
          <motion.div
            animate={{
              rotate: hoveredItem === 'logout' ? 360 : 0
            }}
            transition={{ duration: 0.6 }}
            className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex-shrink-0"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
          </motion.div>

          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="font-medium text-red-400 group-hover:text-red-300 transition-all whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>

          {/* Tooltip for collapsed logout */}
          {!isOpen && hoveredItem === 'logout' && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 10 }}
              exit={{ opacity: 0, x: -10 }}
              className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg border border-white/10 whitespace-nowrap z-50"
            >
              Logout
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45 border-l border-t border-white/10"></div>
            </motion.div>
          )}
        </motion.button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
      
      {/* Floating particles */}
      {isOpen && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;
