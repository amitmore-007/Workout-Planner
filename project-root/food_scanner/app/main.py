from fastapi import FastAPI, File, UploadFile,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from gemini_service import analyze_food_image
from pydantic import BaseModel
from ai_chatbot import generate_ai_response
import uuid
import os
from fastapi.responses import FileResponse
from pathlib import Path
from recipe import generate_recipe, analyze_and_generate_recipe_from_image
from pdf_generator import generate_recipe_pdf

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze-food")
async def analyze_food(file: UploadFile = File(...)):
    """
    Endpoint to analyze food images
    """
    # Check if the file is an image
    if not file.content_type.startswith("image/"):
        return {"error": "Uploaded file must be an image"}
    
    # Analyze the image
    try:
        result = await analyze_food_image(file)
        return result
    except Exception as e:
        return {"error": f"Failed to analyze image: {str(e)}"}

@app.get("/")
async def root():
    return {"message": "Food Analysis API is running"}

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "HealthBot API is running"}

@app.get("/health")
async def health_check():
    return {"status": "OK"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        user_msg = request.message
        ai_response = generate_ai_response(user_msg)

        # Include YouTube links only if the user asks
        keywords = ["video", "youtube", "tutorial", "watch"]
        if any(keyword in user_msg.lower() for keyword in keywords):
            youtube_links = search_youtube_videos(user_msg)
        else:
            youtube_links = []

        return {
            "response": ai_response,
            "videos": youtube_links
        }
    except Exception as e:
        print(f"Endpoint Error: {str(e)}")
        return {
            "response": "Sorry, we're facing an issue processing your request. Please try again later.",
            "videos": []
        }


class RecipeRequest(BaseModel):
    ingredients: str
    language: str = "en"

@app.post("/generate")
async def generate(request: RecipeRequest):
    return generate_recipe(request.ingredients, request.language)

@app.post("/generate-from-image")
async def generate_from_image(file: UploadFile = File(...), language: str = "en"):
    try:
        # Validate file upload
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Check file size (limit to 10MB)
        if file.size and file.size > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB")
        
        # Check file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        print(f"Received file: {file.filename}, type: {file.content_type}, size: {file.size}")
        
        # Generate recipe from image
        result = await analyze_and_generate_recipe_from_image(file, language)
        
        # Return consistent format
        return {
            "recipe": result["recipe"], 
            "language": result["language"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Image processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

@app.post("/download-recipe-pdf")
async def download_recipe_pdf(recipe_data: dict):
    try:
        # Validate input data
        if not recipe_data or not recipe_data.get('recipe'):
            raise HTTPException(status_code=400, detail="Recipe data is required")
        
        # Create a unique filename
        file_id = str(uuid.uuid4())[:8]  # Shorter ID
        language = recipe_data.get('language', 'en')
        filename = f"recipe_{language}_{file_id}.pdf"
        
        # Create output directory if it doesn't exist
        output_dir = Path("generated")
        output_dir.mkdir(exist_ok=True)
        output_path = output_dir / filename
        
        # Generate the PDF
        success = generate_recipe_pdf(recipe_data, str(output_path))
        if not success:
            raise HTTPException(status_code=500, detail="PDF generation failed")
        
        # Verify the file was created and has content
        if not output_path.exists() or output_path.stat().st_size == 0:
            raise HTTPException(status_code=500, detail="PDF file was not created properly")
        
        # Return the file response
        return FileResponse(
            path=str(output_path),
            filename=filename,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")