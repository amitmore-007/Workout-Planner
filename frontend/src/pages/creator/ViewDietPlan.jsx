import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Users, DollarSign, Calendar, Target } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const ViewDietPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlan();
  }, [id]);

  const fetchDietPlan = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      
      if (!token) {
        navigate('/creator-login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/dietPlans/creator/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPlan(data);
      } else {
        alert('Failed to fetch diet plan');
        navigate('/creator/diet-plans');
      }
    } catch (error) {
      console.error('Error fetching diet plan:', error);
      alert('Failed to fetch diet plan');
      navigate('/creator/diet-plans');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Plan Not Found</h2>
          <p className="text-gray-600 mb-4">The requested diet plan could not be found.</p>
          <button
            onClick={() => navigate('/creator/diet-plans')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Diet Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/creator/diet-plans')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{plan.name}</h1>
              <p className="text-gray-600">{plan.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                plan.planType === 'premium'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {plan.planType}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                plan.isPublished
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {plan.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{plan.avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-6 h-6 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{plan.ratings.length}</p>
              </div>
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Purchases</p>
                <p className="text-2xl font-bold text-gray-900">{plan.totalPurchases}</p>
              </div>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(plan.totalPurchases * plan.price).toFixed(2)}</p>
              </div>
              <Target className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Plan Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Category</h3>
              <p className="text-gray-900">{plan.category}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Difficulty</h3>
              <p className="text-gray-900">{plan.difficulty}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Duration</h3>
              <p className="text-gray-900">{plan.duration}</p>
            </div>
            {plan.planType === 'premium' && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Price</h3>
                <p className="text-gray-900">${plan.price}</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-900 leading-relaxed">{plan.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Preview</h3>
            <p className="text-gray-900 leading-relaxed">{plan.preview}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">Features</h3>
            <div className="flex flex-wrap gap-2">
              {plan.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {plan.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Content */}
        {plan.detailedContent && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Content</h2>
            
            {plan.detailedContent.overview && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Overview</h3>
                <p className="text-gray-900 leading-relaxed">{plan.detailedContent.overview}</p>
              </div>
            )}

            {plan.detailedContent.weeklyBreakdown && plan.detailedContent.weeklyBreakdown.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-4">Weekly Breakdown</h3>
                <div className="space-y-6">
                  {plan.detailedContent.weeklyBreakdown.map((week, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{week.week}</h4>
                      <p className="text-gray-600 mb-4">{week.focus}</p>
                      
                      {week.meals && week.meals.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-4">
                          {week.meals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="bg-gray-50 rounded-lg p-3">
                              <h5 className="font-medium text-gray-900">{meal.meal}</h5>
                              <p className="text-gray-700">{meal.item}</p>
                              <p className="text-sm text-gray-600">{meal.macros}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plan.detailedContent.supplements && plan.detailedContent.supplements.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Supplements</h3>
                <div className="flex flex-wrap gap-2">
                  {plan.detailedContent.supplements.map((supplement, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {supplement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {plan.detailedContent.expectedResults && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Expected Results</h3>
                <p className="text-gray-900 leading-relaxed">{plan.detailedContent.expectedResults}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDietPlan;
