import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Home, Dumbbell, Utensils, Camera, Video, BarChart, Settings, LogOut, ChevronLeft } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear token and user info from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    // ✅ Redirect user to login page
    navigate("/user-login");
  };

    return (
      <div className={`fixed top-0 left-0 h-full bg-gray-800 p-5 shadow-xl transition-all ${isOpen ? "w-64" : "w-20"}`}>
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className="text-white mb-5 flex items-center">
          <ChevronLeft className={`w-6 h-6 transform ${isOpen ? "" : "rotate-180"}`} />
        </button>
  
        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-4">
          {[
            { name: "Dashboard", to: "/user-dashboard", icon: <Home className="w-6 h-6" /> },
            { name: "Workout Plan", to: "/user-workouts", icon: <Dumbbell className="w-6 h-6" /> },
            { name: "Diet Plan", to: "/user-diet", icon: <Utensils className="w-6 h-6" /> },
            { name: "Food Scanner", to: "/user-scanner", icon: <Camera className="w-6 h-6" /> },
            { name: "Video Meet", to: "/video-meet", icon: <Video className="w-6 h-6" /> },
            { name: "Progress", to: "/user-progress", icon: <BarChart className="w-6 h-6" /> },
            { name: "Settings", to: "/user-settings", icon: <Settings className="w-6 h-6" /> },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="flex items-center space-x-3 text-white hover:bg-gray-700 p-3 rounded-lg transition-all"
            >
              {item.icon}
              <span className={`transition-all ${isOpen ? "block" : "hidden"}`}>{item.name}</span>
            </Link>
          ))}
  
          {/* ✅ Logout Button */}
        <button className="flex items-center space-x-3 text-red-400 hover:text-red-300 mt-6" onClick={handleLogout}>
          <LogOut className="w-6 h-6" />
          <span className={`transition-all ${isOpen ? "block" : "hidden"}`}>Logout</span>
        </button>
        </nav>
      </div>
    );
  };
  
  export default Sidebar;
  