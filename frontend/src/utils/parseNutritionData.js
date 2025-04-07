// utils/parseNutritionData.js
export const parseNutritionData = (rawData) => {
    // If the data is already an object, return it directly
    if (typeof rawData === 'object' && rawData !== null) {
      return rawData;
    }
  
    // If it's a string with asterisks, clean it up
    if (typeof rawData === 'string') {
      // Remove asterisks and any markdown formatting
      let cleaned = rawData.replace(/\*/g, '').trim();
      
      try {
        // Try to parse as JSON if it's JSON-like
        return JSON.parse(cleaned);
      } catch (e) {
        // If not JSON, try to extract key-value pairs
        const lines = cleaned.split('\n').filter(line => line.trim() !== '');
        const result = {};
        
        lines.forEach(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            result[key] = value;
          }
        });
        
        return Object.keys(result).length > 0 ? result : { details: cleaned };
      }
    }
    
    return { details: 'Unable to parse nutrition data' };
  };