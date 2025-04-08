import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
from fastapi import HTTPException

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure Google Generative AI
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

async def analyze_food_image(file_data):
    """
    Analyze food image using Google Generative AI.
    
    Args:
        file_data: The uploaded file data from FastAPI
        
    Returns:
        dict: Analysis result as JSON
    """
    prompt = """
    You are a nutritionist AI assistant. Analyze the food in this image and return a JSON response with the following structure:
    
    {
        "foods": [
            {
                "name": "Food Item Name",
                "quantity": 1,  # Count how many of this item appear in the image (e.g., "3 eggs" would be quantity: 3)
                "calories": 123, # Total calories for the quantity shown
                "protein": 10,   # Total protein in grams for the quantity shown
                "carbs": 20,     # Total carbs in grams for the quantity shown
                "fats": 5,       # Total fats in grams for the quantity shown
                "fiber": 3,      # Total fiber in grams for the quantity shown
                "sugar": 2,      # Total sugar in grams for the quantity shown
                "isHealthy": true,
                "healthReason": "Brief explanation of health assessment"
            }
        ],
        "overallAssessment": "Brief overall assessment of the meal"
    }
    
    IMPORTANT: 
    1. Count the quantity of each distinct food item (e.g., "3 eggs", "2 slices of bread")
    2. Calculate nutritional values for the TOTAL quantity shown (e.g., calories for all 3 eggs)
    3. Return ONLY valid JSON without any markdown, explanations or other text.
    """
    
    try:
        # Read file content
        contents = await file_data.read()
        
        # Generate content using Google Generative AI
        response = model.generate_content([prompt, {"mime_type": "image/jpeg", "data": contents}])
        
        # Process the response
        text_result = response.text
        
        # Try to parse as JSON
        try:
            # Remove any markdown code blocks if present
            if "```json" in text_result:
                text_result = text_result.split("```json")[1].split("```")[0].strip()
            elif "```" in text_result:
                text_result = text_result.split("```")[1].split("```")[0].strip()
                
            json_result = json.loads(text_result)
            return {"result": json_result}
        except json.JSONDecodeError:
            # Return as text if JSON parsing fails
            return {"result": {"textResult": text_result}}
            
    except Exception as e:
        print(f"❌ Error analyzing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze image: {str(e)}")