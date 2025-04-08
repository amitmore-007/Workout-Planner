import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_food_image(image_bytes):
    prompt = """
    You are a nutritionist AI assistant. Analyze the food in this image and return a JSON response with the following structure:
    
    {
        "foods": [
            {
                "name": "Food Item Name",
                "quantity": 1,  # Count how many of this item appear in the image (e.g., "3 eggs" would be quantity: 3)
                "calories": 123, # Total calories for the quantity shown
                "protein": 10,   # Total protein for the quantity shown
                "carbs": 20,     # Total carbs for the quantity shown
                "fats": 5,       # Total fats for the quantity shown
                "fiber": 3,      # Total fiber for the quantity shown
                "sugar": 2,      # Total sugar for the quantity shown
                "isHealthy": true,
                "healthReason": "Brief explanation of health assessment"
            },
            # more food items if multiple types of items in image
        ],
        "overallAssessment": "Brief overall assessment of the meal"
    }
    
    IMPORTANT: 
    1. Count the quantity of each distinct food item (e.g., "3 eggs", "2 slices of bread")
    2. Calculate nutritional values for the TOTAL quantity shown (e.g., calories for all 3 eggs)
    3. Return ONLY valid JSON without any markdown, explanations or other text.
    """
    
    try:
        response = model.generate_content([prompt, image_bytes[0]])
        return {"result": response.text}
    except Exception as e:
        print("❌ Gemini error:", str(e))
        return {"error": "Failed to analyze image. Please try again."}