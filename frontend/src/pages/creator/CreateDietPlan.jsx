import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Upload, Save, Eye, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateDietPlan = () => {
  const navigate = useNavigate();
  
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

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Keto', 'Mediterranean', 'Vegan', 'Intermittent Fasting', 
    'Weight Loss', 'Muscle Gain', 'General Health'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  const handleInputChange = (field, value) => {
    // Add file size validation for image uploads
    if (field === 'image' && value) {
      const maxSize = 8 * 1024 * 1024; // 8MB limit (less than server limit for safety)
      if (value.size > maxSize) {
        alert('Image file size must be less than 8MB. Please choose a smaller image or compress it.');
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(value.type)) {
        alert('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
        // Reset the file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        return;
      }
      
      console.log(`Selected image: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB)`);
    }
    
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

  const handleDetailedContentChange = (field, value) => {
    setDetailedContent(prev => ({ ...prev, [field]: value }));
  };

  const addWeeklyBreakdown = () => {
    setDetailedContent(prev => ({
      ...prev,
      weeklyBreakdown: [
        ...prev.weeklyBreakdown,
        {
          week: `Week ${prev.weeklyBreakdown.length * 2 + 1}-${prev.weeklyBreakdown.length * 2 + 2}`,
          focus: '',
          schedule: '',
          meals: [
            { meal: 'Breakfast', item: '', macros: '', calories: '', instructions: '' }
          ]
        }
      ]
    }));
  };

  const addMealToWeek = (weekIndex) => {
    setDetailedContent(prev => ({
      ...prev,
      weeklyBreakdown: prev.weeklyBreakdown.map((week, index) =>
        index === weekIndex
          ? {
              ...week,
              meals: [...week.meals, { meal: '', item: '', macros: '', calories: '', instructions: '' }]
            }
          : week
      )
    }));
  };

  const handleWeekChange = (weekIndex, field, value) => {
    setDetailedContent(prev => ({
      ...prev,
      weeklyBreakdown: prev.weeklyBreakdown.map((week, index) =>
        index === weekIndex ? { ...week, [field]: value } : week
      )
    }));
  };

  const handleMealChange = (weekIndex, mealIndex, field, value) => {
    setDetailedContent(prev => ({
      ...prev,
      weeklyBreakdown: prev.weeklyBreakdown.map((week, wIndex) =>
        wIndex === weekIndex
          ? {
              ...week,
              meals: week.meals.map((meal, mIndex) =>
                mIndex === mealIndex ? { ...meal, [field]: value } : meal
              )
            }
          : week
      )
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

      // Validate required fields before submission
      if (!formData.name || !formData.subtitle || !formData.category || 
          !formData.difficulty || !formData.duration || !formData.description || 
          !formData.preview || !detailedContent.overview) {
        alert('Please fill in all required fields before submitting.');
        setIsSubmitting(false);
        return;
      }

      // Additional file validation before submission
      if (formData.image) {
        const maxSize = 8 * 1024 * 1024; // 8MB
        if (formData.image.size > maxSize) {
          alert('Image file is too large. Please select an image smaller than 8MB.');
          setIsSubmitting(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      
      // Add basic form data
      Object.keys(formData).forEach(key => {
        if (key === 'features' || key === 'tags') {
          const arrayValue = formData[key].filter(item => item.trim());
          if (arrayValue.length > 0) {
            formDataToSend.append(key, arrayValue.join(','));
          }
        } else if (key === 'image' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'image') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add detailed content
      formDataToSend.append('detailedContent', JSON.stringify(detailedContent));

      console.log('Submitting to API...');
      console.log('Form data summary:');
      for (let [key, value] of formDataToSend.entries()) {
        if (key === 'image') {
          console.log(`${key}: File - ${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB)`);
        } else {
          console.log(`${key}:`, typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value);
        }
      }

      const response = await fetch('http://localhost:5000/api/dietPlans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      
      if (response.ok) {
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('Created diet plan:', result);
          alert('Diet plan created successfully!');
          navigate('/creator/diet-plans');
        } else {
          console.error('Expected JSON response but got:', contentType);
          alert('Diet plan created but received unexpected response format');
          navigate('/creator/diet-plans');
        }
      } else {
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          console.error('Error response:', error);
          alert(error.message || 'Failed to create diet plan');
        } else {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText.substring(0, 300));
          
          // Handle specific error cases
          if (errorText.includes('MulterError: File too large')) {
            alert('The uploaded image is too large. Please choose an image smaller than 8MB or compress your current image.');
          } else if (errorText.includes('MulterError')) {
            alert('File upload error. Please check your image file and try again.');
          } else if (response.status === 413) {
            alert('Request too large. Please reduce the image size or remove some content.');
          } else if (response.status === 404) {
            alert('API endpoint not found. Please check if the backend server is running.');
          } else if (response.status === 401) {
            alert('Authentication failed. Please login again.');
            localStorage.removeItem('creatorToken');
            navigate('/creator-login');
          } else if (response.status === 500) {
            alert('Server error occurred. Please try again or contact support.');
          } else {
            alert(`Failed to create diet plan. Server returned status: ${response.status}`);
          }
        }
      }
    } catch (error) {
      console.error('Error creating diet plan:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert('Cannot connect to server. Please check if the backend is running on http://localhost:5000');
      } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
        alert('Server returned invalid response format. Please check server logs.');
      } else {
        alert('Failed to create diet plan: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasicInfo = () => (
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
            placeholder="e.g., Keto Transformation"
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
            placeholder="e.g., High-Fat, Low-Carb Revolution"
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
            placeholder="e.g., 12 weeks"
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
          placeholder="Detailed description of your diet plan..."
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
          placeholder="Short preview text that users will see before purchasing..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Plan Image</label>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleInputChange('image', e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500">
            Maximum file size: 8MB. Supported formats: JPEG, PNG, GIF, WebP
          </p>
          {formData.image && (
            <p className="text-sm text-green-600">
              Selected: {formData.image.name} ({(formData.image.size / 1024 / 1024).toFixed(2)}MB)
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={feature}
              onChange={(e) => handleArrayChange('features', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Rapid Fat Loss"
            />
            {formData.features.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('features', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('features')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <Plus size={16} />
          Add Feature
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        {formData.tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={tag}
              onChange={(e) => handleArrayChange('tags', index, e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., low-carb"
            />
            {formData.tags.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem('tags', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem('tags')}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <Plus size={16} />
          Add Tag
        </button>
      </div>
    </div>
  );

  const renderDetailedContent = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Detailed Content</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Overview *</label>
        <textarea
          value={detailedContent.overview}
          onChange={(e) => handleDetailedContentChange('overview', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows="4"
          placeholder="Comprehensive overview of your diet plan approach..."
          required
        />
      </div>

      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Weekly Meal Plans</h4>
        {detailedContent.weeklyBreakdown.map((week, weekIndex) => (
          <div key={weekIndex} className="border border-gray-200 rounded-lg p-6 mb-4">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
                <input
                  type="text"
                  value={week.week}
                  onChange={(e) => handleWeekChange(weekIndex, 'week', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Week 1-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus</label>
                <input
                  type="text"
                  value={week.focus}
                  onChange={(e) => handleWeekChange(weekIndex, 'focus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Adaptation phase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Schedule (Optional)</label>
                <input
                  type="text"
                  value={week.schedule}
                  onChange={(e) => handleWeekChange(weekIndex, 'schedule', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., 12PM - 8PM"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-gray-700">Meals</h5>
              {week.meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="grid md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-md">
                  <input
                    type="text"
                    value={meal.meal}
                    onChange={(e) => handleMealChange(weekIndex, mealIndex, 'meal', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Meal type"
                  />
                  <input
                    type="text"
                    value={meal.item}
                    onChange={(e) => handleMealChange(weekIndex, mealIndex, 'item', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Food item"
                  />
                  <input
                    type="text"
                    value={meal.macros}
                    onChange={(e) => handleMealChange(weekIndex, mealIndex, 'macros', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Macros"
                  />
                  <input
                    type="number"
                    value={meal.calories}
                    onChange={(e) => handleMealChange(weekIndex, mealIndex, 'calories', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Calories"
                  />
                  <input
                    type="text"
                    value={meal.instructions}
                    onChange={(e) => handleMealChange(weekIndex, mealIndex, 'instructions', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Instructions"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addMealToWeek(weekIndex)}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                + Add Meal
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addWeeklyBreakdown}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
        >
          <Plus size={16} />
          Add Week
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Results</label>
        <textarea
          value={detailedContent.expectedResults}
          onChange={(e) => handleDetailedContentChange('expectedResults', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows="3"
          placeholder="What results can users expect from this plan..."
        />
      </div>

      {formData.planType === 'premium' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Premium Content</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Personalized Macros</label>
              <div className="grid grid-cols-4 gap-3">
                <input
                  type="number"
                  value={detailedContent.personalizedMacros.calories}
                  onChange={(e) => setDetailedContent(prev => ({
                    ...prev,
                    personalizedMacros: { ...prev.personalizedMacros, calories: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Calories"
                />
                <input
                  type="number"
                  value={detailedContent.personalizedMacros.protein}
                  onChange={(e) => setDetailedContent(prev => ({
                    ...prev,
                    personalizedMacros: { ...prev.personalizedMacros, protein: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Protein (g)"
                />
                <input
                  type="number"
                  value={detailedContent.personalizedMacros.carbs}
                  onChange={(e) => setDetailedContent(prev => ({
                    ...prev,
                    personalizedMacros: { ...prev.personalizedMacros, carbs: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Carbs (g)"
                />
                <input
                  type="number"
                  value={detailedContent.personalizedMacros.fats}
                  onChange={(e) => setDetailedContent(prev => ({
                    ...prev,
                    personalizedMacros: { ...prev.personalizedMacros, fats: e.target.value }
                  }))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="Fats (g)"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/creator/diet-plans')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Diet Plan</h1>
                <p className="text-gray-600">Design a comprehensive nutrition plan for your users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-20 text-sm text-gray-600">
              <span>Basic Info</span>
              <span>Content</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {currentStep === 1 ? renderBasicInfo() : renderDetailedContent()}
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={16} />
                    {isSubmitting ? 'Creating...' : 'Create Diet Plan'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDietPlan;
