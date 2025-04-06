import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")

def analyze_food_image(image_bytes):
    prompt = """
    You are a nutritionist and are well versed with the nutritional aspects of various food types.
    Given the image below, tell me:
    - What all food items are in the image?
    - Calories per item
    - % of protein, carbs, fibers, sugar, and other macros
    - give nutritional information in a well bullet points format
    - Whether the food is healthy or not, and why.
    """
    try:
        response = model.generate_content([prompt, image_bytes[0]])
        return response.text
    except Exception as e:
        print("❌ Gemini error:", str(e))
        raise
