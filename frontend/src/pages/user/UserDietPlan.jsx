import React, { useState, useEffect } from 'react';
import { Star, Lock, CheckCircle, Clock, Users, Trophy, ArrowRight, X, CreditCard, Shield, Zap, Heart, Target, Flame } from 'lucide-react';

const UserDietPlan = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasedPlans, setPurchasedPlans] = useState(new Set());
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [planToPurchase, setPlanToPurchase] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    planType: ''
  });

  useEffect(() => {
    fetchPublishedPlans();
    fetchUserPurchases();
  }, []);

  const fetchPublishedPlans = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.planType) queryParams.append('planType', filters.planType);

      const response = await fetch(`http://localhost:5000/api/dietPlans/public?${queryParams}`, {
        headers: {
          'Authorization': localStorage.getItem('userToken') ? `Bearer ${localStorage.getItem('userToken')}` : ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDietPlans(data);
      } else {
        console.error('Failed to fetch diet plans');
      }
    } catch (error) {
      console.error('Error fetching diet plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPurchases = async () => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        const purchased = new Set(userData.purchasedDietPlans?.map(p => p.planId) || []);
        setPurchasedPlans(purchased);
      }
    } catch (error) {
      console.error('Error fetching user purchases:', error);
    }
  };

  const handlePurchaseClick = (plan) => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Please login to purchase diet plans');
      return;
    }
    setPlanToPurchase(plan);
    setShowPurchaseModal(true);
  };

  const handlePurchase = async () => {
    setPaymentProcessing(true);
    
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5000/api/dietPlans/${planToPurchase._id}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setPurchasedPlans(new Set([...purchasedPlans, planToPurchase._id]));
        setPaymentProcessing(false);
        setShowPurchaseModal(false);
        setSelectedPlan(planToPurchase);
        setShowModal(true);
        setPlanToPurchase(null);
        alert('Diet plan purchased successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to purchase diet plan');
        setPaymentProcessing(false);
      }
    } catch (error) {
      console.error('Error purchasing diet plan:', error);
      alert('Failed to purchase diet plan');
      setPaymentProcessing(false);
    }
  };

  const openPlanDetails = async (plan) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`http://localhost:5000/api/dietPlans/public/${plan._id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        const detailedPlan = await response.json();
        setSelectedPlan(detailedPlan);
        setShowModal(true);
      } else {
        console.error('Failed to fetch plan details');
      }
    } catch (error) {
      console.error('Error fetching plan details:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  useEffect(() => {
    fetchPublishedPlans();
  }, [filters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading diet plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Transform Your Life
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unlock premium diet plans crafted by nutrition experts. Science-backed, results-driven, life-changing.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {dietPlans.reduce((sum, plan) => sum + plan.totalPurchases, 0)}+ Members
              </div>
              <div className="flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                Expert Created
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Proven Results
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Filter Plans</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Categories</option>
                <option value="Keto">Keto</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Vegan">Vegan</option>
                <option value="Intermittent Fasting">Intermittent Fasting</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="General Health">General Health</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filters.planType}
                onChange={(e) => handleFilterChange('planType', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Types</option>
                <option value="regular">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Diet Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {dietPlans.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-4">No Diet Plans Available</h3>
            <p className="text-gray-400">Check back later for new plans from our expert creators.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {dietPlans.map((plan) => (
              <div
                key={plan._id}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Plan Image */}
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 relative rounded-xl mb-6 overflow-hidden">
                  {plan.image ? (
                    <img
                      src={plan.image}
                      alt={plan.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ${plan.image ? 'hidden' : 'flex'}`}
                  >
                    <div className="text-center">
                      <Heart className="w-12 h-12 text-white mb-2 mx-auto" />
                      <p className="text-white font-medium">{plan.category}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded-full">{plan.avgRating ? plan.avgRating.toFixed(1) : '0.0'}</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center text-sm text-white bg-black/50 px-2 py-1 rounded-full">
                      <Clock className="w-4 h-4 mr-1" />
                      {plan.duration}
                    </div>
                  </div>
                </div>

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">({plan.ratings?.length || 0} reviews)</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        plan.planType === 'premium'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {plan.planType === 'premium' ? 'Premium' : 'Free'}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-purple-300 font-medium mb-2">{plan.subtitle}</p>
                  <p className="text-sm text-gray-400 mb-4">by {plan.creatorName}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {plan.features?.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Plan Preview */}
                <div className="mb-6">
                  <p className="text-gray-300 text-sm leading-relaxed">{plan.preview}</p>
                  {plan.planType === 'premium' && !purchasedPlans.has(plan._id) && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                      <div className="flex items-center text-sm text-purple-300">
                        <Lock className="w-4 h-4 mr-2" />
                        Detailed meal plans, recipes, and shopping lists unlock after purchase
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Action */}
                <div className="flex items-center justify-between">
                  <div>
                    {plan.planType === 'premium' ? (
                      <>
                        <span className="text-3xl font-bold">${plan.price}</span>
                        <span className="text-gray-400 text-sm ml-2">one-time</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-green-400">FREE</span>
                    )}
                  </div>
                  
                  {purchasedPlans.has(plan._id) || plan.planType === 'regular' ? (
                    <button
                      onClick={() => openPlanDetails(plan)}
                      className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handlePurchaseClick(plan)}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Get Access
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>

                {(purchasedPlans.has(plan._id) || plan.planType === 'regular') && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {plan.planType === 'regular' ? 'Free' : 'Owned'}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && planToPurchase && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl max-w-md w-full border border-purple-500/30 shadow-2xl">
            {/* Modal Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Complete Purchase</h3>
                    <p className="text-gray-400 text-sm">Unlock your transformation</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPurchaseModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  disabled={paymentProcessing}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-bold text-white mb-2">{planToPurchase.name}</h4>
                <p className="text-purple-300 text-sm mb-4">{planToPurchase.subtitle}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {planToPurchase.duration}
                  </div>
                  <div className="text-2xl font-bold text-white">${planToPurchase.price}</div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-300 mb-3">What you'll get:</h5>
                <div className="space-y-2">
                  {planToPurchase.features?.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                  <div className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    Detailed meal plans & recipes
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    Shopping lists & prep guides
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center mb-6 p-3 bg-gray-800/50 rounded-lg">
                <Shield className="w-5 h-5 text-green-400 mr-2" />
                <span className="text-sm text-gray-300">Secure payment • 30-day money-back guarantee</span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={paymentProcessing}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {paymentProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Unlock Plan Now - ${planToPurchase.price}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Plan Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedPlan.name}</h2>
                  <p className="text-purple-300">{selectedPlan.subtitle}</p>
                  <p className="text-sm text-gray-400">by {selectedPlan.creatorName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedPlan.detailedContent?.overview && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-purple-300">Plan Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedPlan.detailedContent.overview}</p>
                </div>
              )}

              {selectedPlan.detailedContent?.weeklyBreakdown?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-purple-300">Weekly Meal Plans</h3>
                  <div className="space-y-6">
                    {selectedPlan.detailedContent.weeklyBreakdown.map((week, index) => (
                      <div key={index} className="bg-gray-800/50 rounded-lg p-6">
                        <h4 className="text-lg font-semibold mb-2 text-white">{week.week}</h4>
                        <p className="text-gray-400 mb-4">{week.focus}</p>
                        {week.schedule && (
                          <p className="text-sm text-purple-300 mb-4">Schedule: {week.schedule}</p>
                        )}
                        
                        {week.meals?.length > 0 && (
                          <div className="grid md:grid-cols-2 gap-4">
                            {week.meals.map((meal, mealIndex) => (
                              <div key={mealIndex} className="bg-gray-700/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-purple-200">{meal.meal}</span>
                                </div>
                                <h5 className="font-semibold text-white mb-1">{meal.item}</h5>
                                <p className="text-sm text-gray-400">{meal.macros}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlan.detailedContent?.supplements?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4 text-purple-300">Recommended Supplements</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlan.detailedContent.supplements.map((supplement, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm"
                      >
                        {supplement}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlan.detailedContent?.expectedResults && (
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-300">Expected Results</h3>
                  <p className="text-gray-300">{selectedPlan.detailedContent.expectedResults}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900/50 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Life?</h3>
          <p className="text-gray-400 mb-6">Join thousands who have already started their journey to better health.</p>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <span>© 2025 Diet Plans Pro</span>
            <span>•</span>
            <span>30-Day Money Back Guarantee</span>
            <span>•</span>
            <span>24/7 Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDietPlan;