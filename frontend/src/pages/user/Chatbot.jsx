import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSpeechRecognition } from "react-speech-recognition";
import SpeechRecognition from "react-speech-recognition";
import {
  FaMicrophone,
  FaStop,
  FaPaperPlane,
  FaPaperclip,
  FaTimes,
  FaSun,
  FaMoon,
  FaRunning,
  FaHeartbeat,
  FaAppleAlt,
  FaRegClock,
  FaThumbsUp,
  FaLink
} from "react-icons/fa";

const ChatBot = () => {
  // State management
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi there! 👋 I'm HealthBot, your personal health assistant. Ask me anything about nutrition, fitness, or general wellness!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [reactions, setReactions] = useState({});
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  // Speech recognition
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const quickReplies = [
    { icon: <FaRunning className="text-purple-400" />, text: "Best exercises for weight loss?" },
    { icon: <FaHeartbeat className="text-pink-400" />, text: "How much protein should I eat daily?" },
    { icon: <FaRegClock className="text-blue-400" />, text: "30-minute home workout routine?" },
    { icon: <FaAppleAlt className="text-green-400" />, text: "Best foods for post-workout recovery?" },
  ];

  // Format message content with proper styling
  const formatMessageContent = (content) => {
    if (!content) return "";
    
    // Handle bullet points
    let formattedContent = content.replace(/•\s?(.*?)(?=(\n•|\n\n|$))/gs, '<li>$1</li>');
    
    // Handle numbered lists (1. 2. 3.)
    formattedContent = formattedContent.replace(/(\d+)\.\s?(.*?)(?=(\n\d+\.|\n\n|$))/gs, '<li>$1. $2</li>');
    
    // Wrap bullet and numbered lists in ul/ol
    if (formattedContent.includes('<li>')) {
      // Check if it contains numbered list
      if (formattedContent.match(/\d+\.\s/)) {
        formattedContent = formattedContent.replace(/(<li>\d+\..*?<\/li>)+/gs, '<ol class="list-decimal ml-5 my-3">$&</ol>');
      } else {
        formattedContent = formattedContent.replace(/(<li>.*?<\/li>)+/gs, '<ul class="list-disc ml-5 my-3">$&</ul>');
      }
    }
    
    // Handle bold text (wrap with **)
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italics (wrap with *)
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle links [text](url)
    formattedContent = formattedContent.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-blue-400 hover:text-blue-300">$1</a>');
    
    // Handle headers
    formattedContent = formattedContent.replace(/#{3}\s?(.*?)(?=\n|$)/g, '<h3 class="text-lg font-bold mt-3 mb-2">$1</h3>');
    formattedContent = formattedContent.replace(/#{2}\s?(.*?)(?=\n|$)/g, '<h2 class="text-xl font-bold mt-3 mb-2">$1</h2>');
    formattedContent = formattedContent.replace(/#{1}\s?(.*?)(?=\n|$)/g, '<h1 class="text-2xl font-bold mt-3 mb-2">$1</h1>');
    
    // Handle paragraphs - wrap content separated by double newlines
    formattedContent = formattedContent.replace(/([^\n]+)(\n\n|$)/g, '<p class="mb-3">$1</p>');
    
    // Fix duplicated paragraph tags
    formattedContent = formattedContent.replace(/<p><(h[1-3]|ul|ol|li)>/g, '<$1>');
    formattedContent = formattedContent.replace(/<\/(h[1-3]|ul|ol|li)><\/p>/g, '</$1>');
    
    return formattedContent;
  };

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    
    // Add dark mode class to document if needed
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Core functions
  const handleSend = async () => {
    if (!input.trim() && !file) return;

    // Hide quick replies once user sends first message
    setShowQuickReplies(false);

    // Construct user message
    const userMessage = {
      sender: "user",
      text: input,
      file: file ? URL.createObjectURL(file) : null,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add user message to state
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFile(null);
    resetTranscript();
    setIsTyping(true);

    try {
      // Optional: simulate delay for realism
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await axios.post("http://localhost:8000/api/chat", {
        message: input,
      });

      const responseText = response.data.response;

      const newMessages = [];

      // Check for error-like phrases
      const isError = responseText.toLowerCase().includes("trouble") || 
                     responseText.toLowerCase().includes("unavailable");

      // Bot main response
      newMessages.push({
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // If no error and videos are available, show video suggestions
      if (!isError && response.data.videos?.length > 0) {
        newMessages.push({
          sender: "bot",
          text: "Here are some helpful video resources:",
          videos: response.data.videos,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Oops! I'm having trouble connecting. Please try again later.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsTyping(false);
      // Focus on input field after sending
      inputRef.current?.focus();
    }
  };

  const toggleMic = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
      if (transcript) {
        setInput(transcript);
        setTimeout(() => handleSend(), 100);
      }
    } else {
      resetTranscript();
      setIsListening(true);
      SpeechRecognition.startListening({ continuous: false });
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    
    // Toggle dark mode class on document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleReaction = (messageIndex, emoji) => {
    setReactions((prev) => {
      const newReactions = { ...prev };
      // Toggle reaction
      if (newReactions[messageIndex] === emoji) {
        delete newReactions[messageIndex];
      } else {
        newReactions[messageIndex] = emoji;
      }
      return newReactions;
    });
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-all duration-500 relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="flex flex-col w-full max-w-4xl h-5/6 bg-gradient-to-br from-gray-900/90 via-slate-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative z-10 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-900/50 via-slate-800/50 to-blue-900/50 backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-gradient-x"></div>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg animate-pulse-glow">
              <FaHeartbeat className="text-lg animate-heartbeat" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">HealthBot</h2>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 backdrop-blur-sm group"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="text-lg group-hover:animate-spin" />
            ) : (
              <FaMoon className="text-lg group-hover:animate-pulse" />
            )}
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-slate-900/20 to-gray-900/40 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
          <div className="flex flex-col space-y-6">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} w-full animate-slide-in`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`flex ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} max-w-3/4 space-x-3 ${msg.sender === 'user' ? 'space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${msg.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-avatar-bounce ${
                      msg.sender === 'bot' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-purple-400/50' 
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-400/50'
                    } text-white`}>
                      {msg.sender === 'bot' ? (
                        <FaHeartbeat className="text-sm animate-heartbeat" />
                      ) : (
                        <span className="text-xs font-bold">U</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex flex-col space-y-1 max-w-md">
                    <div 
                      className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                        msg.sender === 'bot' 
                          ? 'bg-gradient-to-br from-slate-800/80 to-gray-800/80 text-gray-100 border border-white/10 rounded-tl-none animate-message-glow' 
                          : 'bg-gradient-to-br from-blue-600/90 to-purple-600/90 text-white rounded-tr-none border border-blue-400/30'
                      }`}
                    >
                      {msg.text && (
                        <div 
                          className="text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ 
                            __html: msg.sender === "bot" 
                              ? formatMessageContent(msg.text) 
                              : msg.text 
                          }}
                        />
                      )}
                      
                      {msg.file && (
                        <div className="mt-3 rounded-xl overflow-hidden shadow-lg">
                          <img src={msg.file} alt="Uploaded content" className="max-w-full hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      
                      {msg.videos && msg.videos.length > 0 && (
                        <div className="mt-4 space-y-3">
                          {msg.videos.map((video, idx) => (
                            <a 
                              key={idx} 
                              href={video} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-400/30 text-purple-300 text-sm hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300 hover:scale-105 group"
                            >
                              <FaLink className="flex-shrink-0 group-hover:animate-pulse" />
                              <span>Exercise Video #{idx + 1}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between px-2">
                      <span className="text-xs text-gray-400">{msg.timestamp}</span>
                      
                      {msg.sender === "bot" && (
                        <button
                          onClick={() => handleReaction(i, "👍")}
                          className={`p-2 rounded-full transition-all duration-300 hover:scale-125 ${
                            reactions[i] === "👍" 
                              ? "text-purple-400 bg-purple-400/20 animate-pulse" 
                              : "text-gray-500 hover:text-purple-400 hover:bg-purple-400/10"
                          }`}
                          aria-label="Thumbs up"
                        >
                          <FaThumbsUp className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start w-full animate-slide-in">
                <div className="flex space-x-3 max-w-md">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-purple-400/50 text-white shadow-lg animate-pulse">
                      <FaHeartbeat className="text-sm" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1 max-w-md">
                    <div className="px-5 py-4 rounded-2xl bg-gradient-to-br from-slate-800/80 to-gray-800/80 border border-white/10 rounded-tl-none shadow-lg backdrop-blur-sm">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {showQuickReplies && messages.length === 1 && (
              <div className="flex flex-col items-center w-full mt-6 mb-4 animate-fade-in-up">
                <p className="text-sm text-gray-400 mb-4 text-center">Try asking about:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {quickReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(reply.text);
                        setTimeout(() => handleSend(), 0);
                      }}
                      className="flex items-center space-x-4 px-5 py-4 bg-gradient-to-r from-slate-800/60 to-gray-800/60 border border-white/10 rounded-xl hover:from-slate-700/80 hover:to-gray-700/80 transition-all duration-300 text-left group hover:scale-105 hover:shadow-lg backdrop-blur-sm"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{reply.icon}</div>
                      <span className="text-gray-200 text-sm group-hover:text-white transition-colors duration-300">{reply.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 bg-gradient-to-r from-slate-900/60 via-gray-900/60 to-slate-900/60 border-t border-white/10 backdrop-blur-sm">
          <div className="flex items-end space-x-3">
            {/* File Upload */}
            <div className="relative">
              <label htmlFor="file-input" className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/30 text-purple-400 hover:from-purple-600/30 hover:to-pink-600/30 cursor-pointer transition-all duration-300 hover:scale-110 group backdrop-blur-sm">
                <FaPaperclip className="text-lg group-hover:rotate-12 transition-transform duration-300" />
              </label>
              <input
                id="file-input"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Input Field Container */}
            <div className="flex-1 relative flex items-center bg-gradient-to-r from-slate-800/80 to-gray-800/80 border border-white/20 rounded-2xl px-5 py-3 min-h-12 backdrop-blur-sm focus-within:border-purple-400/50 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-purple-500/20">
              {file && (
                <div className="absolute -top-12 left-0 flex items-center space-x-2 bg-gradient-to-r from-slate-800/90 to-gray-800/90 py-2 px-4 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm animate-slide-down">
                  <span className="text-xs text-gray-300 truncate max-w-xs">{file.name}</span>
                  <button 
                    onClick={() => setFile(null)} 
                    className="text-gray-400 hover:text-red-400 transition-colors duration-200 hover:scale-125"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              )}

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Message HealthBot..."
                className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-100 placeholder-gray-400 resize-none max-h-32 py-2 text-sm"
                rows="1"
              />
            </div>

            {/* Voice Input */}
            {browserSupportsSpeechRecognition && (
              <button
                onClick={toggleMic}
                className={`flex items-center justify-center w-12 h-12 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm ${
                  isListening 
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white animate-pulse shadow-lg shadow-red-500/30 scale-110' 
                    : 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-400/30 text-blue-400 hover:from-blue-600/30 hover:to-cyan-600/30 hover:scale-110'
                }`}
                aria-label={isListening ? "Stop recording" : "Start recording"}
              >
                {isListening ? (
                  <FaStop className="text-lg animate-pulse" />
                ) : (
                  <FaMicrophone className="text-lg" />
                )}
              </button>
            )}

            {/* Send Button */}
            <button 
              onClick={handleSend} 
              disabled={!input.trim() && !file}
              className={`flex items-center justify-center w-12 h-12 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm ${
                !input.trim() && !file 
                  ? 'bg-gradient-to-r from-gray-600/50 to-slate-600/50 cursor-not-allowed border border-gray-500/30' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-110 shadow-lg shadow-purple-500/30 animate-pulse-glow'
              }`}
            >
              <FaPaperPlane className="text-lg" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.5); }
          50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.8); }
        }
        
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes slide-in {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes avatar-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes message-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(139, 92, 246, 0.2); }
          50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.4); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; background-size: 200% 200%; }
        .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in { animation: slide-in 0.4s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        .animate-avatar-bounce { animation: avatar-bounce 2s ease-in-out infinite; }
        .animate-message-glow { animation: message-glow 3s ease-in-out infinite; }
        
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thumb-purple-600::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #9333ea, #ec4899);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

export default ChatBot;