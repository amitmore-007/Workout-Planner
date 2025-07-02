import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Star, Users, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DietPlanManagement = () => {
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const token = localStorage.getItem('creatorToken');
      
      // Debug: Check if token exists
      console.log('Creator token:', token);
      
      if (!token) {
        console.error('No creator token found, redirecting to login');
        navigate('/creator-login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/dietPlans/creator', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched diet plans:', data);
        setDietPlans(data);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch diet plans:', errorData);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem('creatorToken');
          navigate('/creator-login');
        }
      }
    } catch (error) {
      console.error('Error fetching diet plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (planId, currentStatus) => {
    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch(`http://localhost:5000/api/dietPlans/${planId}/publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDietPlans(prev =>
          prev.map(plan =>
            plan._id === planId ? { ...plan, isPublished: data.isPublished } : plan
          )
        );
      } else {
        console.error('Failed to toggle publish status');
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  const deletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this diet plan?')) {
      return;
    }

    try {
      const token = localStorage.getItem('creatorToken');
      const response = await fetch(`http://localhost:5000/api/dietPlans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setDietPlans(prev => prev.filter(plan => plan._id !== planId));
      } else {
        console.error('Failed to delete diet plan');
      }
    } catch (error) {
      console.error('Error deleting diet plan:', error);
    }
  };

  const filteredPlans = dietPlans.filter(plan => {
    if (filter === 'all') return true;
    if (filter === 'published') return plan.isPublished;
    if (filter === 'draft') return !plan.isPublished;
    if (filter === 'premium') return plan.planType === 'premium';
    if (filter === 'regular') return plan.planType === 'regular';
    return true;
  });

  const stats = {
    total: dietPlans.length,
    published: dietPlans.filter(p => p.isPublished).length,
    premium: dietPlans.filter(p => p.planType === 'premium').length,
    totalRevenue: dietPlans.reduce((sum, plan) => sum + (plan.totalPurchases * plan.price), 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading diet plans...</p>
          <p className="text-sm text-gray-500 mt-2">Token: {localStorage.getItem('creatorToken') ? 'Found' : 'Missing'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Diet Plans Management</h1>
              <p className="text-gray-600">Create and manage your nutrition plans</p>
            </div>
            <button
              onClick={() => navigate('/creator/create-diet')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              Create New Plan
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ToggleRight className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Premium Plans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.premium}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'published', 'draft', 'premium', 'regular'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => (
            <div key={plan._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Plan Image */}
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 relative overflow-hidden">
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
                  className={`w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center ${plan.image ? 'hidden' : 'flex'}`}
                >
                  <div className="text-center text-white">
                    <Eye className="w-12 h-12 mb-2 mx-auto" />
                    <p className="font-medium">{plan.category}</p>
                  </div>
                </div>
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.planType === 'premium'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {plan.planType}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {plan.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Plan Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.subtitle}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{plan.category}</span>
                  <span>{plan.duration}</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{plan.avgRating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({plan.ratings.length})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    {plan.totalPurchases}
                  </div>
                </div>

                {plan.planType === 'premium' && (
                  <div className="text-2xl font-bold text-green-600 mb-4">
                    ${plan.price}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/creator/diet-plans/${plan._id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/creator/diet-plans/${plan._id}/view`)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deletePlan(plan._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => togglePublish(plan._id, plan.isPublished)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      plan.isPublished
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {plan.isPublished ? (
                      <>
                        <ToggleRight size={14} />
                        Published
                      </>
                    ) : (
                      <>
                        <ToggleLeft size={14} />
                        Publish
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlans.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No diet plans found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't created any diet plans yet. Start by creating your first plan!"
                : `No diet plans match the ${filter} filter.`
              }
            </p>
            <button
              onClick={() => navigate('/creator/create-diet')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              Create Your First Diet Plan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlanManagement;
