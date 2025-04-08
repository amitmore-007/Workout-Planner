from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from gemini_service import analyze_food_image

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