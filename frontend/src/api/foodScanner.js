import axios from 'axios';

// src/api/foodScanner.js

export const analyzeFoodImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:8000/api/analyze-food', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze image');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw error;
  }
};
