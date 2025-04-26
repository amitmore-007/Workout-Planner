import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UserDashboard from "./pages/user/UserDashboard";
import UserWorkoutDashboard from "./pages/user/UserWorkoutPlan";
import UserDietPlan from "./pages/user/UserDietPlan";
import FoodScanner from "./pages/user/FoodScanner";
// import UserVideoMeet from "./pages/user/UserVideoMeet";
import Progress from "./pages/user/Progress";
import Settings from "./pages/user/Settings";
import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import LandingPage from "./pages/LandingPage";
import CreatorLogin from "./pages/creator/CreatorLogin";
import CreatorRegister from "./pages/creator/CreatorRegister";
import SelectRole from "./components/SelectRole";
import CreatorDashboard from "./pages/creator/CreatorDashboard";
import CreateWorkoutPlan from "./pages/creator/CreatePlanForm";

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
  
      {/* Protected Routes (With Sidebar) */}
      <Route path="/" element={<Layout />}>
        <Route path="user-dashboard" element={<UserDashboard />} />
        <Route path="user-workouts" element={<UserWorkoutDashboard />} />
        <Route path="user-diet" element={<UserDietPlan />} />
        <Route path="user-scanner" element={<FoodScanner />} />
        <Route path="user-progress" element={<Progress />} />
        <Route path="user-settings" element={<Settings />} />
      </Route>
    </Routes>
  </Router>
  
  );
};

export default App;
