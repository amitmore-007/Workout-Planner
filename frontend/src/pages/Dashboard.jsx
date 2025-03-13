// import { useState, useEffect } from "react";
// import { getUserProfile } from "../services/authService";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userData = await getUserProfile();
//         setUser(userData);
//       } catch (error) {
//         console.error(error);
//         navigate("/");
//       }
//     };

//     fetchUserProfile();
//   }, [navigate]);

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6">
//       <h2 className="text-3xl font-bold text-green-400 text-center">Dashboard</h2>
      
//       {user ? (
//         <div className="max-w-md mx-auto mt-6 p-6 bg-gray-800 rounded-lg shadow-lg">
//           <h3 className="text-xl font-semibold text-green-400">Welcome, {user.name}!</h3>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Goal:</strong> {user.goal}</p>
//           <p><strong>Activity Level:</strong> {user.activityLevel}</p>
//           <p><strong>Diet Preference:</strong> {user.dietPreference}</p>
//         </div>
//       ) : (
//         <p className="text-center text-gray-400">Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
