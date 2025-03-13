import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";


const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    goal: "weight loss",
    activityLevel: "sedentary",
    dietPreference: "veg",
    fitnessExperience: "beginner",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData
      );
  
      alert("Registration successful!");
      navigate("/"); // Ensure this matches your login route
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-green-400">Join the Fitness Revolution</h2>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-3 bg-gray-700 rounded" />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-3 bg-gray-700 rounded" />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required className="w-full p-3 bg-gray-700 rounded" />
          <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight (kg)" required className="w-full p-3 bg-gray-700 rounded" />
          <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Height (cm)" required className="w-full p-3 bg-gray-700 rounded" />

          <div>
            <label className="block text-sm text-gray-400 mb-1">Fitness Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} required className="w-full p-3 bg-gray-700 rounded">
              <option value="weight loss">Weight Loss</option>
              <option value="weight gain">Weight Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Activity Level</label>
            <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} required className="w-full p-3 bg-gray-700 rounded">
              <option value="sedentary">Sedentary</option>
              <option value="lightly active">Lightly Active</option>
              <option value="moderately active">Moderately Active</option>
              <option value="very active">Very Active</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Diet Preference</label>
            <select name="dietPreference" value={formData.dietPreference} onChange={handleChange} required className="w-full p-3 bg-gray-700 rounded">
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Fitness Experience</label>
            <select name="fitnessExperience" value={formData.fitnessExperience} onChange={handleChange} required className="w-full p-3 bg-gray-700 rounded">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <button type="submit" className="w-full p-3 bg-green-500 hover:bg-green-600 rounded text-white font-bold cursor-pointer" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
<p className="text-center">
  Already have an account?{" "}
  <Link to="/login" className="text-green-400">
    Login
  </Link>
</p>

      </div>
    </div>
  );
};

export default Register;
