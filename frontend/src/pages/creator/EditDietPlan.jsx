import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EditDietPlan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    subtitle: '',
    category: '',
    description: '',
    duration: '',
    difficulty: '',
    planType: 'regular',
    price: 0,
    features: [''],
    preview: '',
    tags: [''],
    image: null
  });

  const [detailedContent, setDetailedContent] = useState({
    overview: '',
    weeklyBreakdown: [
      {
        week: 'Week 1-2',
        focus: '',
        schedule: '',
        meals: [
          { meal: 'Breakfast', item: '', macros: '', calories: '', instructions: '' }
        ]
      }
    ],
    supplements: [''],
    expectedResults: '',
    shoppingLists: [''],
    mealPrepGuides: [''],
    videoContent: [''],
    personalizedMacros: {
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Keto', 'Mediterranean', 'Vegan', 'Intermittent Fasting', 
    'Weight Loss', 'Muscle Gain', 'General Health'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

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
        const plan = await response.json();
        
        setFormData({
          name: plan.name,
          subtitle: plan.subtitle,
          category: plan.category,
          description: plan.description,
          duration: plan.duration,
          difficulty: plan.difficulty,
          planType: plan.planType,
          price: plan.price,
          features: plan.features.length ? plan.features : [''],
          preview: plan.preview,
          tags: plan.tags.length ? plan.tags : [''],
          image: null
        });

        setDetailedContent(plan.detailedContent || detailedContent);
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('creatorToken');
      
      if (!token) {
        alert('Please login as a creator first');
        navigate('/creator-login');
        return;
      }

      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'features' || key === 'tags') {
          formDataToSend.append(key, formData[key].filter(item => item.trim()).join(','));
        } else if (key === 'image' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append('detailedContent', JSON.stringify(detailedContent));

      const response = await fetch(`http://localhost:5000/api/dietPlans/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Diet plan updated successfully!');
        navigate('/creator/diet-plans');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update diet plan');
      }
    } catch (error) {
      console.error('Error updating diet plan:', error);
      alert('Failed to update diet plan: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/creator/diet-plans')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Diet Plan</h1>
              <p className="text-gray-600">Update your nutrition plan</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {/* Basic Info Form - Similar to CreateDietPlan but with populated values */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Basic Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle *</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty *</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Difficulty</option>
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan Type *</label>
                  <select
                    value={formData.planType}
                    onChange={(e) => handleInputChange('planType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="regular">Regular (Free)</option>
                    <option value="premium">Premium (Paid)</option>
                  </select>
                </div>
              </div>

              {formData.planType === 'premium' && (
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview Text *</label>
                <textarea
                  value={formData.preview}
                  onChange={(e) => handleInputChange('preview', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Plan Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleInputChange('image', e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {isSubmitting ? 'Updating...' : 'Update Diet Plan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDietPlan;
