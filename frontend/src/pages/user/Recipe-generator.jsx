import { useState, useEffect, useRef } from "react";
import { Mic, Image as ImageIcon, Globe, Download, Sparkles, X, ChefHat, Clock, Users, Flame, Star, Zap, Brain, MagnetIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

const TRANSLATIONS = {
  appTitle: {
    en: 'Culinary AI',
    mr: 'पाककृती AI'
  },
  ingredients: { 
    en: 'Ingredients', 
    es: 'Ingredientes', 
    fr: 'Ingrédients', 
    de: 'Zutaten', 
    it: 'Ingredienti', 
    pt: 'Ingredientes', 
    hi: 'सामग्री', 
    ja: '材料', 
    zh: '成分', 
    ar: 'मकनत', 
    ru: 'Ингредиенты', 
    ko: '재료',
    mr: 'साहित्य' 
  },
  uploadImage: { 
    en: 'Upload Image', 
    es: 'Subir imagen', 
    fr: 'Télécharger image', 
    de: 'Bild hochladen', 
    it: 'Carica immagine', 
    pt: 'Enviar imagem', 
    hi: 'छवि अपलोड करें', 
    ja: '画像をアップロード', 
    zh: '上传图片', 
    ar: 'تحميل صورة', 
    ru: 'Загрузить изображение', 
    ko: '이미지 업로드',
    mr: 'प्रतिमा अपलोड करा' 
  },
  recipe: { 
    en: 'Recipe', 
    es: 'Receta', 
    fr: 'Recette', 
    de: 'Rezept', 
    it: 'Ricetta', 
    pt: 'Receita', 
    hi: 'विधि', 
    ja: 'レシピ', 
    zh: '食谱', 
    ar: 'وصفة', 
    ru: 'Рецепт', 
    ko: '레시피',
    mr: 'पाककृती' 
  },
  whatInKitchen: { 
    en: 'What\'s in your kitchen?', 
    es: '¿Qué tienes en tu cocina?', 
    fr: 'Qu\'avez-vous dans votre cuisine ?', 
    de: 'Was hast du in deiner Küche?', 
    it: 'Cosa hai in cucina?', 
    pt: 'O que você tem na sua cozinha?', 
    hi: 'आपकी रसोई में क्या है?', 
    ja: 'キッチンにあるものは？', 
    zh: '你的厨房里有什么？', 
    ar: 'ماذا لديك في مطبخك؟', 
    ru: 'Что есть на вашей кухне?', 
    ko: '주방에 어떤 재료가 있나요?',
    mr: 'तुमच्या स्वयंपाकघरात काय आहे?' 
  },
  voicePlaceholder: { 
    en: 'Enter ingredients separated by commas, or speak them', 
    es: 'Ingrese ingredientes separados por comas, o háblelos', 
    fr: 'Entrez les ingrédients séparés par des virgules, ou dites-les', 
    de: 'Zutaten durch Kommas getrennt eingeben oder sprechen', 
    it: 'Inserisci gli ingredienti separati da virgole, o parlali', 
    pt: 'Digite ingredientes separados por vírgulas ou fale-os', 
    hi: 'सामग्री को अल्पविराम से अलग करके दर्ज करें, या उन्हें बोलें', 
    ja: '材料をカンマで区切って入力するか、話してください', 
    zh: '输入用逗号分隔的成分，或者说出来', 
    ar: 'أدخل المكونات مفصولة بفواصل، أو قلها', 
    ru: 'Введите ингредиенты через запятую или продиктуйте их', 
    ko: '재료를 쉼표로 구분하여 입력하거나 말하세요',
    mr: 'साहित्य स्वल्पविरामाने विभक्त करून प्रविष्ट करा किंवा ते बोला' 
  },
  speakIngredients: { 
    en: 'Speak ingredients', 
    es: 'Hablar ingredientes', 
    fr: 'Dicter les ingrédients', 
    de: 'Zutaten diktieren', 
    it: 'Dettare ingredienti', 
    pt: 'Ditar ingredientes', 
    hi: 'सामग्री बोलें', 
    ja: '材料を話す', 
    zh: '说出成分', 
    ar: 'تحدث المكونات', 
    ru: 'Продиктовать ингредиенты', 
    ko: '재료 말하기',
    mr: 'साहित्य बोला' 
  },
  stopListening: { 
    en: 'Stop listening', 
    es: 'Dejar de escuchar', 
    fr: 'Arrêter d\'écouter', 
    de: 'Aufhören zuzuhören', 
    it: 'Smetti di ascoltare', 
    pt: 'Parar de ouvir', 
    hi: 'सुनना बंद करें', 
    ja: '聞くのをやめる', 
    zh: '停止聆听', 
    ar: 'توقف عن الاستماع', 
    ru: 'Прекратить слушать', 
    ko: '듣기 중지',
    mr: 'ऐकणे थांबवा' 
  },
  creatingRecipe: { 
    en: 'Creating recipe...', 
    es: 'Creando receta...', 
    fr: 'Création de recette...', 
    de: 'Rezept wird erstellt...', 
    it: 'Creando ricetta...', 
    pt: 'Criando receita...', 
    hi: 'रेसिपी बना रहे हैं...', 
    ja: 'レシピを作成中...', 
    zh: '正在创建食谱...', 
    ar: 'جارٍ إنشاء الوصفة...', 
    ru: 'Создание рецепта...', 
    ko: '레시피 생성 중...',
    mr: 'पाककृती तयार करत आहे...' 
  },
  createRecipe: { 
    en: 'Create Recipe', 
    es: 'Crear Receta', 
    fr: 'Créer Recette', 
    de: 'Rezept Erstellen', 
    it: 'Crea Ricetta', 
    pt: 'Criar Receita', 
    hi: 'रेसिपी बनाएं', 
    ja: 'レシピを作成', 
    zh: '创建食谱', 
    ar: 'إنشاء وصفة', 
    ru: 'Создать Рецепт', 
    ko: '레시피 만들기',
    mr: 'पाककृती तयार करा' 
  },
  downloadPDF: { 
    en: 'Download PDF', 
    es: 'Descargar PDF', 
    fr: 'Télécharger PDF', 
    de: 'PDF herunterladen', 
    it: 'Scarica PDF', 
    pt: 'Baixar PDF', 
    hi: 'PDF डाउनलोड करें', 
    ja: 'PDFをダウンロード', 
    zh: '下载PDF', 
    ar: 'تحميل PDF', 
    ru: 'Скачать PDF', 
    ko: 'PDF 다운로드',
    mr: 'PDF डाउनलोड करा' 
  },
  newRecipe: { 
    en: 'New Recipe', 
    es: 'Nueva Receta', 
    fr: 'Nouvelle Recette', 
    de: 'Neues Rezept', 
    it: 'Nuova Ricetta', 
    pt: 'Nova Receita', 
    hi: 'नई रेसिपी', 
    ja: '新しいレシピ', 
    zh: '新食谱', 
    ar: 'وصفة جديدة', 
    ru: 'Новый Рецепт', 
    ko: '새로운 레시피',
    mr: 'नवीन पाककृती' 
  },
  chooseImage: { 
    en: 'Choose image', 
    es: 'Elegir imagen', 
    fr: 'Choisir image', 
    de: 'Bild auswählen', 
    it: 'Scegli immagine', 
    pt: 'Escolher imagem', 
    hi: 'छवि चुनें', 
    ja: '画像を選択', 
    zh: '选择图片', 
    ar: 'اختر صورة', 
    ru: 'Выбрать изображение', 
    ko: '이미지 선택',
    mr: 'प्रतिमा निवडा' 
  },
  imageUploadHint: { 
    en: 'Upload a clear photo of your ingredients or dish', 
    es: 'Sube una foto clara de tus ingredientes o plato', 
    fr: 'Téléchargez une foto claire de vos ingrédients ou plat', 
    de: 'Laden Sie ein klares Foto Ihrer Zutaten oder Gerichts hoch', 
    it: 'Carica una foto chiara dei tuoi ingredienti o piatto', 
    pt: 'Envie uma foto clara dos seus ingredientes ou prato', 
    hi: 'अपने सामग्री या डिश की एक स्पष्ट तस्वीर अपलोड करें', 
    ja: '材料や料理の鮮明な写真をアップロードしてください', 
    zh: '上传您的食材或菜肴的清晰照片', 
    ar: 'قم بتحميل صورة واضحة للمكونات أو الطبق', 
    ru: 'Загрузите четкое фото ваших ингредиентов или блюда', 
    ko: '재료 또는 요리의 선명한 사진을 업로드하세요',
    mr: 'तुमच्या साहित्य किंवा डिशची स्पष्ट फोटो अपलोड करा' 
  },
  noSpeechError: { 
    en: 'No speech detected', 
    es: 'No se detectó voz', 
    fr: 'Aucune voix détectée', 
    de: 'Keine Sprache erkannt', 
    it: 'Nessun parlato rilevato', 
    pt: 'Nenhuma fala detectada', 
    hi: 'कोई भाषण का पता नहीं चला', 
    ja: '音声が検出されませんでした', 
    zh: '未检测到语音', 
    ar: 'لم يتم الكشف عن كلام', 
    ru: 'Речь не обнаружена', 
    ko: '음성이 감지되지 않음',
    mr: 'भाषण आढळले नाही' 
  },
  micError: { 
    en: 'Microphone access denied', 
    es: 'Acceso al micrófono denegado', 
    fr: 'Accès au microphone refusé', 
    de: 'Mikrofonzugriff verweigert', 
    it: 'Accesso al microfono negato', 
    pt: 'Acesso ao microfone negado', 
    hi: 'माइक्रोफ़ोन एक्सेस अस्वीकृत', 
    ja: 'マイクへのアクセスが拒否されました', 
    zh: '麦克风访问被拒绝', 
    ar: 'تم رفض الوصول إلى الميكروفون', 
    ru: 'Доступ к микрофону запрещен', 
    ko: '마이크 액세스 거부됨',
    mr: 'मायक्रोफोन प्रवेश नाकारला' 
  },
  speechNotSupported: { 
    en: 'Speech recognition not supported in your browser', 
    es: 'Reconocimiento de voz no compatible en tu navegador', 
    fr: 'Reconnaissance vocale non prise en charge dans votre navigateur', 
    de: 'Spracherkennung wird in Ihrem Browser nicht unterstützt', 
    it: 'Riconoscimento vocale non supportato nel tuo browser', 
    pt: 'Reconhecimento de fala não suportado no seu navegador', 
    hi: 'आपके ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है', 
    ja: 'お使いのブラウザでは音声認識がサポートされていません', 
    zh: '您的浏览器不支持语音识别', 
    ar: 'التعرف على الكلام غير مدعوم في متصفحك', 
    ru: 'Распознавание речи не поддерживается в вашем браузере', 
    ko: '브라우저에서 음성 인식을 지원하지 않습니다',
    mr: 'तुमच्या ब्राउझरमध्ये भाषण ओळख समर्थित नाही' 
  }
};

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
];
function getTranslatedText(key, language) {
  return TRANSLATIONS[key]?.[language] || TRANSLATIONS[key]?.en || key;
}

// Floating Particles Component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div className="w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 animate-ping"></div>
        </div>
      ))}
    </div>
  );
};

// AI Response Typewriter Component
const TypewriterText = ({ text, isVisible }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isVisible && text) {
      setIsTyping(true);
      setDisplayedText('');
      let index = 0;
      
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1));
          index++;
        } else {
          setIsTyping(false);
          clearInterval(timer);
        }
      }, 30);

      return () => clearInterval(timer);
    }
  }, [text, isVisible]);

  return (
    <div className="relative">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown 
          components={{
            h1: ({children}) => <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">{children}</h1>,
            h2: ({children}) => <h2 className="text-xl font-semibold text-purple-300 mb-3 flex items-center gap-2"><ChefHat size={20} />{children}</h2>,
            h3: ({children}) => <h3 className="text-lg font-medium text-blue-300 mb-2 flex items-center gap-2"><Star size={16} />{children}</h3>,
            li: ({children}) => <li className="text-gray-300 mb-1 hover:text-white transition-colors duration-200">{children}</li>,
            p: ({children}) => <p className="text-gray-300 mb-3 leading-relaxed">{children}</p>,
            strong: ({children}) => <strong className="text-yellow-400 font-semibold">{children}</strong>
          }}
        >
          {displayedText}
        </ReactMarkdown>
      </div>
      {isTyping && (
        <span className="inline-block w-2 h-5 bg-purple-400 animate-pulse ml-1"></span>
      )}
    </div>
  );
};

// AI Thinking Animation Component
const AIThinkingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full animate-spin">
          <div className="absolute top-2 left-2 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
        </div>
        <Brain className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={32} />
      </div>
      
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
      </div>
      
      <div className="text-center">
        <p className="text-purple-300 font-medium">AI Chef is cooking up something delicious...</p>
        <div className="mt-2 flex items-center justify-center space-x-2">
          <MagnetIcon className="text-yellow-400 animate-spin" size={16} />
          <span className="text-sm text-gray-400">Analyzing ingredients & creating magic</span>
          <Sparkles className="text-pink-400 animate-pulse" size={16} />
        </div>
      </div>
    </div>
  );
};

function RecipeGenerator() {
  const [ingredients, setIngredients] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ingredients");
  const [language, setLanguage] = useState('en');
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Initialize voice recognition
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      setVoiceError(getTranslatedText('speechNotSupported', language));
      return;
    }

    setIsSpeechSupported(true);
    console.log('Speech recognition is supported');

    // Create and configure recognition
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Language mapping
    const langMap = {
      en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE',
      it: 'it-IT', pt: 'pt-PT', hi: 'hi-IN', ja: 'ja-JP',
      zh: 'zh-CN', ar: 'ar-SA', ru: 'ru-RU', ko: 'ko-KR',
      mr: 'mr-IN'
    };

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = langMap[language] || 'en-US';

    // Event handlers
    recognition.onstart = () => {
      console.log('Speech recognition started');
      setVoiceStatus('Listening...');
      setVoiceError(null);
    };

    recognition.onresult = (event) => {
      console.log('Speech recognition result:', event);
      
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update status to show what's being heard
      if (interimTranscript) {
        setVoiceStatus(`Hearing: "${interimTranscript}"`);
      }

      // Add final transcript to ingredients
      if (finalTranscript.trim()) {
        console.log('Final transcript:', finalTranscript);
        
        setIngredients(prev => {
          const cleaned = finalTranscript
            .replace(/\band\b/gi, ', ')
            .replace(/\s*,\s*/g, ', ')
            .replace(/\s+/g, ' ')
            .trim();
          
          const newValue = prev ? `${prev}, ${cleaned}` : cleaned;
          console.log('Updated ingredients:', newValue);
          return newValue;
        });

        setVoiceStatus('Added to ingredients!');
        
        // Clear status after 2 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setVoiceStatus('Listening...');
        }, 2000);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      switch(event.error) {
        case 'no-speech':
          setVoiceError('No speech detected. Try speaking louder.');
          setVoiceStatus('No speech detected');
          break;
        case 'not-allowed':
        case 'permission-denied':
          setVoiceError('Microphone permission denied. Please allow microphone access.');
          setIsListening(false);
          break;
        case 'network':
          setVoiceError('Network error. Please check your internet connection.');
          break;
        case 'audio-capture':
          setVoiceError('No microphone found. Please check your microphone.');
          break;
        case 'aborted':
          // Normal stopping, don't show error
          break;
        default:
          setVoiceError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      
      if (isListening) {
        // Restart if we're still supposed to be listening
        try {
          recognition.start();
        } catch (err) {
          console.log('Failed to restart recognition:', err);
          setIsListening(false);
          setVoiceStatus('');
        }
      } else {
        setVoiceStatus('');
      }
    };

    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [language, isListening]);

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      handleImageUpload({ target: { files } });
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size too large. Maximum size is 10MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const toggleListening = () => {
    if (!isSpeechSupported) {
      setVoiceError(getTranslatedText('speechNotSupported', language));
      return;
    }

    setVoiceError(null);

    if (isListening) {
      // Stop listening
      console.log('Stopping speech recognition');
      setIsListening(false);
      setVoiceStatus('');
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      // Start listening
      console.log('Starting speech recognition');
      setIsListening(true);
      setVoiceStatus('Starting...');
      
      // Request microphone permission first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.error('Failed to start recognition:', err);
              setVoiceError('Failed to start voice recognition. Please try again.');
              setIsListening(false);
              setVoiceStatus('');
            }
          })
          .catch(err => {
            console.error('Microphone permission denied:', err);
            setVoiceError('Microphone permission is required for voice input.');
            setIsListening(false);
            setVoiceStatus('');
          });
      } else {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error('Failed to start recognition:', err);
          setVoiceError('Failed to start voice recognition. Please try again.');
          setIsListening(false);
          setVoiceStatus('');
        }
      }
    }
  };

  // Generate recipe with better error handling
  const generateRecipe = async () => {
    if ((!ingredients.trim() && !imageFile) || loading) return;
    
    setLoading(true);
    setVoiceError(null);
    
    try {
      let response;
      
      if (imageFile) {
        console.log('Generating recipe from image:', imageFile.name);
        
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("language", language);
        
        response = await fetch("http://localhost:8000/generate-from-image", {
          method: "POST",
          body: formData,
        });
        
        console.log('Image upload response status:', response.status);
      } else {
        console.log('Generating recipe from ingredients:', ingredients);
        
        response = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients, language }),
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Recipe generation successful:', data);
      
      if (!data.recipe) {
        throw new Error('No recipe data received from server');
      }
      
      setRecipe(data.recipe);
      setActiveTab("recipe");
    } catch (err) {
      console.error("Recipe generation error:", err);
      alert(`Failed to generate recipe: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!recipe) {
      alert('No recipe available to download');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/download-recipe-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          recipe: recipe,
          language: language,
          ingredients: ingredients || "Various ingredients",
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        console.error('Server error:', errorData);
        throw new Error(`Server error (${res.status}): ${errorData}`);
      }
      
      // Check if response is PDF
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/pdf')) {
        const errorText = await res.text();
        console.error('Invalid response:', errorText);
        throw new Error('Server did not return a PDF file');
      }
      
      const blob = await res.blob();
      if (blob.size === 0) {
        throw new Error('Received empty PDF file');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recipe_${language}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        link.remove();
      }, 100);

      // Success notification
      alert('Recipe PDF downloaded successfully!');
    } catch (err) {
      console.error("PDF download error:", err);
      alert(`Failed to download PDF: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      <FloatingParticles />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm p-6 flex justify-between items-center border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                <ChefHat className="text-white animate-bounce" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {getTranslatedText('appTitle', language)}
                <Sparkles className="text-yellow-400 animate-pulse" size={20} />
              </h1>
            </div>
            
            <div className="relative">
              <button 
                className="flex items-center gap-3 px-4 py-2 bg-white/20 text-white rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
              >
                <Globe size={18} />
                <span className="text-lg">{LANGUAGES.find(l => l.code === language)?.flag}</span>
                <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === language)?.name}</span>
              </button>
              
              {showLangDropdown && (
                <div className="absolute right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-20 w-48 max-h-64 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-all duration-200 ${
                        language === lang.code ? 'bg-purple-500/20 text-purple-300' : 'text-white'
                      } first:rounded-t-2xl last:rounded-b-2xl`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {/* Tabs */}
            <div className="flex border-b border-white/20 mb-6">
              {['ingredients', 'image', recipe && 'recipe'].filter(Boolean).map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 font-medium transition-all duration-300 relative ${
                    activeTab === tab 
                      ? "text-purple-300 border-b-2 border-purple-400" 
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  <div className="flex items-center gap-2">
                    {tab === 'ingredients' && <Sparkles size={16} />}
                    {tab === 'image' && <ImageIcon size={16} />}
                    {tab === 'recipe' && <ChefHat size={16} />}
                    {getTranslatedText(tab, language)}
                  </div>
                  {activeTab === tab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg -z-10"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "ingredients" && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                    {getTranslatedText('whatInKitchen', language)}
                  </h2>
                  <p className="text-gray-400">Tell us what you have, and we'll create culinary magic ✨</p>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <textarea
                    className="relative w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 resize-none"
                    placeholder={getTranslatedText('voicePlaceholder', language)}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    rows={4}
                  />
                  
                  {isSpeechSupported ? (
                    <button
                      className={`absolute right-4 bottom-4 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
                        isListening 
                          ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                          : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      }`}
                      onClick={toggleListening}
                      title={isListening ? 
                        getTranslatedText('stopListening', language) : 
                        getTranslatedText('speakIngredients', language)}
                    >
                      <Mic size={18} />
                      {isListening && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ) : (
                    <button
                      className="absolute right-4 bottom-4 p-3 rounded-full bg-gray-600 cursor-not-allowed text-gray-400"
                      title={getTranslatedText('speechNotSupported', language)}
                      disabled
                    >
                      <Mic size={18} />
                    </button>
                  )}
                </div>

                {/* Voice status indicator */}
                {voiceStatus && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-sm">{voiceStatus}</span>
                    </div>
                  </div>
                )}
                
                {voiceError && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <X size={16} />
                      {voiceError}
                      <button 
                        onClick={() => setVoiceError(null)}
                        className="ml-auto text-red-300 hover:text-red-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "image" && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {getTranslatedText('uploadImage', language)}
                  </h2>
                  <p className="text-gray-400">Show us your ingredients and let AI work its magic 📸</p>
                </div>
                
                {!imagePreview ? (
                  <div 
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      isDragOver 
                        ? 'border-purple-400 bg-purple-500/10 scale-105' 
                        : 'border-white/30 hover:border-purple-400 hover:bg-white/5'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full backdrop-blur-sm">
                          <ImageIcon size={48} className="text-purple-400" />
                        </div>
                        <div>
                          <span className="text-white font-medium text-lg">
                            {getTranslatedText('chooseImage', language)}
                          </span>
                          <p className="text-gray-400 text-sm mt-2">
                            {getTranslatedText('imageUploadHint', language)}
                          </p>
                          <p className="text-purple-400 text-xs mt-1">
                            Drag & drop files here or click to browse
                          </p>
                        </div>
                      </div>
                    </label>
                    
                    {isDragOver && (
                      <div className="absolute inset-0 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                        <div className="text-purple-300 font-semibold">Drop your image here!</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded food" 
                        className="w-full h-64 object-cover rounded-xl"
                      />
                      <button
                        className="absolute top-6 right-6 bg-red-500/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-110"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "recipe" && recipe && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                    <ChefHat size={24} />
                    {getTranslatedText('recipe', language)}
                  </h2>
                  <div className="flex gap-3">
                    <button 
                      className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                      onClick={downloadPDF}
                      disabled={loading}
                    >
                      <Download size={16} />
                      {getTranslatedText('downloadPDF', language)}
                    </button>
                    <button 
                      className="px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                      onClick={() => {
                        setActiveTab("ingredients");
                        setIngredients("");
                        setRecipe("");
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                    >
                      <Sparkles size={16} />
                      {getTranslatedText('newRecipe', language)}
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-2xl"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <TypewriterText text={recipe} isVisible={activeTab === "recipe"} />
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-md w-full mx-4">
                  <AIThinkingAnimation />
                </div>
              </div>
            )}

            {/* Generate Button */}
            {(activeTab === "ingredients" || activeTab === "image") && (
              <div className="mt-8">
                <button
                  className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-300 transform ${
                    loading || (!ingredients.trim() && !imageFile)
                      ? 'bg-gray-600/50 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40'
                  }`}
                  onClick={generateRecipe}
                  disabled={loading || (!ingredients.trim() && !imageFile)}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {getTranslatedText('creatingRecipe', language)}
                    </>
                  ) : (
                    <>
                      <Zap size={20} />
                      {getTranslatedText('createRecipe', language)}
                      <Sparkles size={20} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default RecipeGenerator;