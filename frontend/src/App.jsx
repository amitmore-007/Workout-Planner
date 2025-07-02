import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UserDashboard from "./pages/user/UserDashboard";
import UserWorkoutDashboard from "./pages/user/UserWorkoutPlan";
import UserDietPlan from "./pages/user/UserDietPlan";
import FoodScanner from "./pages/user/FoodScanner";
// Add these imports and routes to your main App.js file
import VideoMeetSetup from './pages/creator/VideoMeetSetup';
import VideoTraining from './pages/user/VideoTraining';

// Add these routes:


import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import LandingPage from "./pages/LandingPage";
import CreatorLogin from "./pages/creator/CreatorLogin";
import CreatorRegister from "./pages/creator/CreatorRegister";
import SelectRole from "./components/SelectRole";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreateWorkoutPlan from "./pages/creator/CreatePlanForm";
import ChatBot from "./pages/user/Chatbot";
import RecipeGenerator from "./pages/user/Recipe-generator";
import DietPlanManagement from "./pages/creator/DietPlanManagement";
import CreateDietPlan from "./pages/creator/CreateDietPlan";
import EditDietPlan from './pages/creator/EditDietPlan';
import ViewDietPlan from './pages/creator/ViewDietPlan';


const App = () => {
  return (
    <Router>
    <Routes>
      {/* Public Routes (No Sidebar) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/user-register" element={<UserRegister />} />
      <Route path="/creator-login" element={<CreatorLogin />} />
      <Route path="/creator-register" element={<CreatorRegister />} />
      <Route path="/creator-dashboard" element={<CreatorDashboard />} />
      <Route path="/creator-dashboard/create-workout" element={<CreateWorkoutPlan />} />
      <Route path="/creator/video-meet" element={<VideoMeetSetup />} />

      
      {/* Creator Diet Plan Routes */}
      <Route path="/creator/diet-plans" element={<DietPlanManagement />} />
      <Route path="/creator/create-diet" element={<CreateDietPlan />} />
      <Route path="/creator/diet-plans/:id/edit" element={<EditDietPlan />} />
      <Route path="/creator/diet-plans/:id/view" element={<ViewDietPlan />} />
  
      {/* Protected Routes (With Sidebar) */}
      <Route path="/" element={<Layout />}>
        <Route path="user-dashboard" element={<UserDashboard />} />
        <Route path="user-workouts" element={<UserWorkoutDashboard />} />
        <Route path="user-diet" element={<UserDietPlan />} />
        <Route path="user-scanner" element={<FoodScanner />} />
        <Route path="user-chatbot" element={<ChatBot />} />
        <Route path="user-recipe-generator" element={<RecipeGenerator />} />
        <Route path="/user/video-training" element={<VideoTraining />} /> 
        {/* <Route path="user-video-meet" element={<UserVideoMeet />} /> */}
      </Route>
    </Routes>
  </Router>
  
  );
};

export default App;
