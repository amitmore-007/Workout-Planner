import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      {/* Sidebar remains fixed and shared across all pages */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content with proper spacing */}
      <div className={`flex-1 transition-all ${isOpen ? "ml-64" : "ml-20"} p-6`}>
        <Outlet />  {/* This renders the page content */}
      </div>
    </div>
  );
};

export default Layout;
