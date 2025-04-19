import { useState, useEffect} from 'react';
import { Mail, Lock, LogIn, Dumbbell, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/creator/login', form);
      localStorage.setItem('creatorToken', res.data.token);
      alert('Login success');
      navigate('/creator/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className={`flex items-center justify-center w-full min-h-screen bg-black overflow-hidden ${pageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600 via-purple-800 to-black opacity-80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-red-500 filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full bg-purple-600 filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-500 filter blur-3xl opacity-10 animate-pulse"></div>
      </div>

      {/* Content Container */}
      <div className={`relative z-10 w-full max-w-md p-8 mx-4 bg-gray-900 rounded-2xl shadow-2xl backdrop-filter backdrop-blur-lg bg-opacity-50 border border-gray-800 transform transition-all duration-700 ${pageLoaded ? 'translate-y-0' : 'translate-y-12'}`}>
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-10 relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110">
            <Dumbbell size={32} className="text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 mb-2">POWER LOGIN</h2>
          <p className="text-gray-400 text-center max-w-xs">Enter your credentials to access your fitness journey</p>
          
          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-purple-600 rounded-full mt-4"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Email Field */}
            <div className={`group relative transition-all duration-500 ${focusedField === 'email' ? 'scale-105' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute left-3 top-3 text-gray-400 group-hover:text-red-400 transition-colors duration-300">
                  <Mail size={20} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-10 py-3 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className={`group relative transition-all duration-500 ${focusedField === 'password' ? 'scale-105' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gray-800 rounded-lg overflow-hidden">
                <div className="absolute left-3 top-3 text-gray-400 group-hover:text-red-400 transition-colors duration-300">
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-10 py-3 bg-gray-800 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
          
          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="relative flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 opacity-0 absolute"
                />
                <div className="w-5 h-5 border-2 border-gray-400 rounded mr-2 flex items-center justify-center peer-checked:border-red-500">
                  <div className="w-3 h-3 bg-red-500 rounded hidden peer-checked:block"></div>
                </div>
                <label htmlFor="remember-me" className="block text-gray-400 hover:text-gray-300 transition-colors duration-300">
                  Remember me
                </label>
              </div>
            </div>
            
            <div>
              <a href="#" className="text-gray-400 hover:text-red-400 font-medium transition-colors duration-300">
                Forgot password?
              </a>
            </div>
          </div>
          
          {/* Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-md font-medium rounded-lg text-white overflow-hidden ${
                isLoading 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-105 transition-all duration-300'
              }`}
            >
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <LogIn size={20} className="group-hover:animate-pulse" />
                )}
              </span>
              <span className="mr-1">{isLoading ? 'POWERING UP...' : 'POWER UP'}</span>
              <ChevronRight size={16} className={isLoading ? '' : 'group-hover:animate-bounce'} />
            </button>
          </div>
        </form>
        
        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            New to the gym?{' '}
            <a href="/creator-register" className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-500 font-medium hover:from-red-500 hover:to-purple-600 transition-all duration-300">
              Start your fitness journey
            </a>
          </p>
        </div>

        {/* Motivational Quote */}
        <div className="mt-10 pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-sm italic text-center">
            "The pain you feel today will be the strength you feel tomorrow."
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorLogin;
