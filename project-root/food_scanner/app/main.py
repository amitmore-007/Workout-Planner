from fastapi import FastAPI, File, UploadFile
from gemini_service import analyze_food_image
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with your frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze-image/")
async def analyze_image(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        print("✅ File read successfully")

        mime_type = file.content_type
        print(f"✅ MIME Type: {mime_type}")

        image_data = [{"mime_type": mime_type, "data": contents}]
        print("✅ Image converted for Gemini")

        result = analyze_food_image(image_data)
        print("✅ Gemini responded")

        return {"result": result}
    
    except Exception as e:
        print("❌ Error occurred:", str(e))
        return {"error": str(e)}
