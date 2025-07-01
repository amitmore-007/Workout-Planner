import os
import google.generativeai as genai
from dotenv import load_dotenv
import json
from fastapi import HTTPException

load_dotenv()
print("API Key:", os.getenv("GEMINI_API_KEY"))  # Add this line
genai.configure(api_key="AIzaSyDUnxCu_FcMUmpSl4LO5j-gv4pAGTpe3cg")

model = genai.GenerativeModel("gemini-1.5-flash")

def generate_recipe(ingredients, language="en"):
    # Complete language-specific prompts
    prompts = {
        "en": f"""
        You are a professional chef. Create a full recipe using only: {ingredients}.
        Include in English:
        - Recipe Title
        - Description
        - Ingredients List
        - Detailed Step-by-step Instructions
        - Nutritional Info (calories, protein, carbs, fats)
        - Cooking Time
        Format as clean Markdown with ## headings for each section.
        """,
        "es": f"""
        Eres un chef profesional. Crea una receta usando solo: {ingredients}.
        Incluye en español:
        - Título de la receta
        - Descripción
        - Lista de ingredientes
        - Instrucciones paso a paso
        - Información nutricional (calorías, proteínas, carbohidratos, grasas)
        - Tiempo de cocción
        Formato Markdown con ## encabezados para cada sección.
        """,
        "fr": f"""
        Vous êtes un chef professionnel. Créez une recette complète en utilisant uniquement: {ingredients}.
        Incluez en français:
        - Titre de la recette
        - Description
        - Liste des ingrédients
        - Instructions détaillées étape par étape
        - Informations nutritionnelles (calories, protéines, glucides, lipides)
        - Temps de cuisson
        Format Markdown avec des en-têtes ## pour chaque section.
        """,
        "de": f"""
        Sie sind ein professioneller Koch. Erstellen Sie ein vollständiges Rezept mit nur: {ingredients}.
        Enthalten Sie auf Deutsch:
        - Rezepttitel
        - Beschreibung
        - Zutatenliste
        - Detaillierte Schritt-für-Schritt-Anleitung
        - Nährwertangaben (Kalorien, Eiweiß, Kohlenhydrate, Fette)
        - Kochzeit
        Formatieren Sie es als Markdown mit ## Überschriften für jeden Abschnitt.
        """,
        "it": f"""
        Sei uno chef professionista. Crea una ricetta completa usando solo: {ingredients}.
        Includi in italiano:
        - Titolo della ricetta
        - Descrizione
        - Lista degli ingredienti
        - Istruzioni dettagliate passo dopo passo
        - Informazioni nutrizionali (calorie, proteine, carboidrati, grassi)
        - Tempo di cottura
        Formattalo come Markdown con intestazioni ## per ogni sezione.
        """,
        "pt": f"""
        Você é um chef profissional. Crie uma receita completa usando apenas: {ingredients}.
        Inclua em português:
        - Título da receita
        - Descrição
        - Lista de ingredientes
        - Instruções detalhadas passo a passo
        - Informações nutricionais (calorias, proteínas, carboidratos, gorduras)
        - Tempo de cozimento
        Formate como Markdown com cabeçalhos ## para cada seção.
        """,
        "hi": f"""
        आप एक पेशेवर शेफ हैं। केवल इन सामग्रियों का उपयोग करके एक पूर्ण रेसिपी बनाएं: {ingredients}.
        हिंदी में शामिल करें:
        - रेसिपी का शीर्षक
        - विवरण
        - सामग्री सूची
        - विस्तृत चरण-दर-चरण निर्देश
        - पोषण संबंधी जानकारी (कैलोरी, प्रोटीन, कार्ब्स, वसा)
        - पकाने का समय
        प्रत्येक अनुभाग के लिए ## हेडिंग के साथ मार्कडाउन के रूप में प्रारूपित करें।
        """,
        "ja": f"""
        あなたはプロのシェフです。次の材料のみを使用して完全なレシピを作成してください: {ingredients}.
        日本語で含めるもの:
        - レシピタイトル
        - 説明
        - 材料リスト
        - 詳細なステップバイステップの手順
        - 栄養情報 (カロリー、タンパク質、炭水化物、脂肪)
        - 調理時間
        各セクションに##見出しを付けてMarkdown形式でフォーマットしてください。
        """,
        "zh": f"""
        你是一位专业厨师。仅使用以下材料创建完整食谱: {ingredients}.
        用中文包括:
        - 食谱标题
        - 描述
        - 配料表
        - 详细的分步说明
        - 营养信息(卡路里、蛋白质、碳水化合物、脂肪)
        - 烹饪时间
        使用Markdown格式，每个部分用##标题。
        """,
        "ar": f"""
        أنت طاهٍ محترف. أنشئ وصفة كاملة باستخدام: {ingredients} فقط.
        قم بتضمين باللغة العربية:
        - عنوان الوصفة
        - الوصف
        - قائمة المكونات
        - تعليمات مفصلة خطوة بخطوة
        - المعلومات الغذائية (السعرات الحرارية، البروتين، الكربوهيدرات، الدهون)
        - وقت الطهي
        قم بتنسيقه كـ Markdown مع عناوين ## لكل قسم.
        """,
        "ru": f"""
        Вы профессиональный шеф-повар. Создайте полный рецепт, используя только: {ingredients}.
        Включите на русском:
        - Название рецепта
        - Описание
        - Список ингредиентов
        - Подробные пошаговые инструкции
        - Пищевая ценность (калории, белки, углеводы, жиры)
        - Время приготовления
        Форматируйте как Markdown с заголовками ## для каждого раздела.
        """,
        "ko": f"""
        당신은 전문 셰프입니다. 다음 재료만 사용하여 완전한 레시피를 만드세요: {ingredients}.
        한국어로 포함할 내용:
        - 레시피 제목
        - 설명
        - 재료 목록
        - 상세한 단계별 지침
        - 영양 정보 (칼로리, 단백질, 탄수화물, 지방)
        - 조리 시간
        각 섹션에 ## 제목을 사용하여 Markdown 형식으로 작성하세요.
        """,
        "mr": f"""
तुम्ही एक व्यावसायिक स्वयंपाकी आहात. फक्त या साहित्याचा वापर करून एक पूर्ण पाककृती तयार करा: {ingredients}.
मराठीत समाविष्ट करा:
- पाककृतीचे शीर्षक
- वर्णन
- साहित्य यादी
- तपशीलवार चरण-दर-चरण सूचना
- पोषण माहिती (कॅलरी, प्रथिने, कर्बोदके, चरबी)
- स्वयंपाक करण्याची वेळ
प्रत्येक विभागासाठी ## शीर्षकांसह मार्कडाउन स्वरूपात लिहा.
""",

    }
    
    prompt = prompts.get(language, prompts["en"])
    response = model.generate_content(prompt)
    return {"recipe": response.text, "language": language}

async def analyze_and_generate_recipe_from_image(file_data, language="en"):
    try:
        # Reset file pointer to beginning
        await file_data.seek(0)
        
        # Read file content
        contents = await file_data.read()
        
        # Validate file content
        if not contents or len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        print(f"File size: {len(contents)} bytes")
        
        # Validate minimum file size (at least 1KB)
        if len(contents) < 1024:
            raise HTTPException(status_code=400, detail="File too small, might be corrupted")
        
        # Determine mime type based on file content and extension
        mime_type = "image/jpeg"  # Default
        if file_data.content_type:
            content_type = file_data.content_type.lower()
            if "png" in content_type:
                mime_type = "image/png"
            elif "webp" in content_type:
                mime_type = "image/webp"
            elif "gif" in content_type:
                mime_type = "image/gif"
            elif "bmp" in content_type:
                mime_type = "image/bmp"
        
        print(f"Processing image: mime_type={mime_type}, filename={file_data.filename}")
        
        # Enhanced prompts for better recipe generation
        recipe_prompts = {
            "en": """
            You are an expert chef analyzing this food image. Create a detailed recipe in English.
            
            Please provide:
            
            ## Recipe Title
            Create an appealing name for this dish based on what you see.
            
            ## Description
            Describe the dish, its appearance, and what makes it special.
            
            ## Ingredients
            List all visible ingredients with realistic measurements. If you can't see exact quantities, provide reasonable estimates for 2-4 servings.
            
            ## Instructions
            Provide clear, step-by-step cooking instructions that would recreate this dish.
            
            ## Cooking Time
            - Prep time: [estimate]
            - Cook time: [estimate]
            - Total time: [estimate]
            
            ## Nutrition Information
            Provide estimated nutritional values per serving (calories, protein, carbs, fat).
            
            ## Tips
            Add any cooking tips or variations.
            
            Be specific and detailed. If the image shows a finished dish, work backwards to determine the cooking process.
            """,
            "es": """
            Eres un chef experto analizando esta imagen de comida. Crea una receta detallada en español.
            
            Por favor proporciona:
            
            ## Título de la Receta
            Crea un nombre atractivo para este plato basado en lo que ves.
            
            ## Descripción
            Describe el plato, su apariencia y lo que lo hace especial.
            
            ## Ingredientes
            Lista todos los ingredientes visibles con medidas realistas. Si no puedes ver cantidades exactas, proporciona estimaciones razonables para 2-4 porciones.
            
            ## Instrucciones
            Proporciona instrucciones de cocina claras, paso a paso, que recrearían este plato.
            
            ## Tiempo de Cocción
            - Tiempo de preparación: [estimación]
            - Tiempo de cocción: [estimación]
            - Tiempo total: [estimación]
            
            ## Información Nutricional
            Proporciona valores nutricionales estimados por porción (calorías, proteína, carbohidratos, grasa).
            
            ## Consejos
            Agrega cualquier consejo de cocina o variaciones.
            
            Sé específico y detallado. Si la imagen muestra un plato terminado, trabaja hacia atrás para determinar el proceso de cocción.
            """,
            "mr": """
            तुम्ही या अन्नाच्या प्रतिमेचे विश्लेषण करणारे तज्ञ स्वयंपाकी आहात. मराठीत तपशीलवार पाककृती तयार करा.
            
            कृपया हे द्या:
            
            ## पाककृतीचे शीर्षक
            तुम्हाला जे दिसते त्यावर आधारित या डिशसाठी आकर्षक नाव तयार करा.
            
            ## वर्णन
            डिश, तिचे स्वरूप आणि काय विशेष बनवते याचे वर्णन करा.
            
            ## साहित्य
            वास्तववादी मापांसह सर्व दिसणारे साहित्य यादी करा. जर तुम्हाला नेमके प्रमाण दिसत नसेल तर 2-4 सर्व्हिंगसाठी वाजवी अंदाज द्या.
            
            ## सूचना
            या डिशची पुनर्निर्मिती करणाऱ्या स्पष्ट, चरण-दर-चरण स्वयंपाक सूचना द्या.
            
            ## स्वयंपाकाची वेळ
            - तयारीची वेळ: [अंदाज]
            - स्वयंपाकाची वेळ: [अंदाज]
            - एकूण वेळ: [अंदाज]
            
            ## पोषण माहिती
            प्रति सर्व्हिंग अंदाजे पोषणविषयक मूल्ये द्या (कॅलरी, प्रथिने, कर्बोदके, चरबी).
            
            ## टिप्स
            कोणत्याही स्वयंपाकाच्या टिप्स किंवा बदल जोडा.
            
            विशिष्ट आणि तपशीलवार असा. जर प्रतिमेत तयार डिश दिसत असेल तर स्वयंपाक प्रक्रिया ठरवण्यासाठी मागे काम करा.
            """
        }
        
        # Add more languages as needed
        prompt = recipe_prompts.get(language, recipe_prompts["en"])
        
        # Generate recipe directly from image
        try:
            response = model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": contents}
            ])
            
            if not response or not response.text:
                raise Exception("Empty response from AI model")
            
            # Check if response contains actual recipe content
            if len(response.text.strip()) < 100:
                raise Exception("Response too short, might indicate processing error")
            
            print(f"Successfully generated recipe of length: {len(response.text)}")
            
            return {
                "recipe": response.text,
                "language": language
            }
            
        except Exception as ai_error:
            print(f"AI generation error: {str(ai_error)}")
            raise HTTPException(
                status_code=500, 
                detail=f"Failed to generate recipe from image: {str(ai_error)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        error_msg = f"Error processing image: {str(e)}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)