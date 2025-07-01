import os
from dotenv import load_dotenv
import google.generativeai as genai
import textwrap
from typing import Optional, Dict, Any
import re

# Initialize Google Generative AI
def initialize_gemini():
    """Initialize Google Generative AI with environment variables"""
    load_dotenv()
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    genai.configure(api_key=google_api_key)

# Initialize when module loads
initialize_gemini()

def generate_ai_response(user_query: str) -> str:
    """Generate a response to user query using Gemini with enhanced formatting"""
    # Check if the query is nutrition-related
    nutrition_keywords = [
        'nutrition', 'calories', 'protein', 'carbs', 'diet', 
        'meal', 'food', 'eat', 'eating', 'nutrients',
        'fat', 'sugar', 'fiber', 'healthy', 'unhealthy'
    ]
    
    is_nutrition_query = any(keyword in user_query.lower() for keyword in nutrition_keywords)
    
    if is_nutrition_query:
        prompt = create_nutrition_prompt(user_query)
    else:
        prompt = create_general_health_prompt(user_query)
    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        if not response.text:
            return "I'm having trouble generating a response. Please try again later."
        
        return format_response(response.text, is_nutrition_query)
    except Exception as e:
        print(f"AI Error: {str(e)}")
        return "I'm currently unable to process your request. Please try again later."

def create_nutrition_prompt(user_query: str) -> str:
    """Create a specialized prompt for nutrition-related queries"""
    return f"""**Role**: You are HealthBot, an AI nutritionist and fitness expert with 10+ years of clinical experience. 
Provide detailed, accurate nutrition information in a visually appealing format.

**Response Requirements**:
1. **Structured Format**:
   - Start with a relevant emoji and title (e.g., "🥗 Nutrition Analysis")
   - Use clear sections with bold headings
   - Include bullet points for lists
   - Add horizontal rules between major sections

2. **Nutrition-Specific Formatting**:
   - For any food/nutrient mentioned, display in this exact format:
     ```
     🍎 [Food Item]
     • Calories: XX kcal
     • Protein: XXg
     • Carbs: XXg 
     • Fats: XXg
     • Fiber: XXg
     • Sugar: XXg
     ```
   - Include health assessment: ✅ Healthy/❌ Unhealthy with brief reason
   - Provide comparisons to common foods when helpful
   - Add practical serving suggestions

3. **Scientific Backing**:
   - Cite reputable sources (NIH, WHO, USDA) where applicable
   - Use percentages of daily values when possible
   - Note any significant vitamins/minerals

4. **Additional Elements**:
   - Include "💡 Pro Tip:" with practical advice
   - Add "🔍 Did You Know?" with interesting fact
   - Provide "📝 Action Steps" with clear recommendations

**Current Query**: {user_query}

**Response**:"""

def create_general_health_prompt(user_query: str) -> str:
    """Create prompt for general health/fitness queries"""
    return f"""**Role**: You are HealthBot, an AI health and fitness assistant with medical expertise.

**Response Requirements**:
1. **Format**:
   - Start with relevant emoji + title (e.g., "💤 Sleep Tips")
   - Use clear sections with bold headings
   - Bullet points for lists
   - Horizontal rules between sections
   - Bold important terms (**like this**)

2. **Content**:
   - Provide evidence-based information
   - Include actionable steps
   - Give practical examples
   - Note potential exceptions/warnings

3. **Enhancements**:
   - "📌 Key Points" box with summary
   - "⚠️ Warning/Caution" when needed
   - "🔬 Science Behind This" for explanations
   - "🔄 Alternatives" where applicable

**Current Query**: {user_query}

**Response**:"""

def format_response(text: str, is_nutrition: bool = False) -> str:
    """Enhance the formatting of the response with consistent styling"""
    # Standard formatting
    text = text.replace("**", "\n**")  # Ensure bold stands out
    text = text.replace("* ", "\n• ")  # Convert asterisks to bullets
    
    # Nutrition-specific enhancements
    if is_nutrition:
        # Ensure nutrient blocks are properly formatted
        text = re.sub(r'(\d+g|\d+ kcal)', r'**\1**', text)  # Bold nutrition numbers
        text = re.sub(r'(✅|❌)', r'\n\1 ', text)  # Space out health indicators
    
    # Add horizontal rules between major sections
    sections = text.split('\n\n')
    formatted_sections = []
    for i, section in enumerate(sections):
        if i > 0 and any(section.startswith(x) for x in ['**', '•', '🍎', '🥗', '💡']):
            formatted_sections.append('⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯')
        formatted_sections.append(section)
    
    text = '\n\n'.join(formatted_sections)
    
    # Remove excessive empty lines while preserving structure
    lines = []
    prev_empty = False
    for line in text.split('\n'):
        if line.strip() == '':
            if not prev_empty:
                lines.append(line)
                prev_empty = True
        else:
            lines.append(line)
            prev_empty = False
    
    return '\n'.join(lines)

def extract_nutrition_data(text: str) -> Optional[Dict[str, Any]]:
    """Attempt to extract structured nutrition data from the response"""
    # This pattern looks for the nutrition block format
    pattern = r'🍎 (.*?)\n• Calories: (\d+) kcal\n• Protein: (\d+)g\n• Carbs: (\d+)g\n• Fats: (\d+)g\n• Fiber: (\d+)g\n• Sugar: (\d+)g'
    matches = re.findall(pattern, text, re.DOTALL)
    
    if matches:
        nutrition_data = []
        for match in matches:
            nutrition_data.append({
                "food": match[0],
                "calories": int(match[1]),
                "protein": int(match[2]),
                "carbs": int(match[3]),
                "fats": int(match[4]),
                "fiber": int(match[5]),
                "sugar": int(match[6])
            })
        return {"nutrition": nutrition_data}
    return None