

## 🏋️‍♂️ AI-Powered Fitness Platform – Project Overview

---

### 🌟  Project Summary 

An intelligent fitness ecosystem that empowers users to achieve health goals through  personalized workout and diet plans ,  AI-powered food analysis , and  interactive support tools . The platform accommodates three distinct roles —  User ,  Creator , and  Admin  — and uses cutting-edge technology like  Gemini API  for nutritional analysis and chatbot functionality.

---

### 👥  Roles & Functionalities 

#### 🔹  User 

* ✅ Login and access  personal dashboard 
* ✅ View and choose  Workout Plans  based on fitness goals
* ✅ View and choose  Diet Plans  based on dietary preferences
* ✅ Upload food images to  Nutrient Scanner  (Gemini API)
* ✅ Chat with a  Fitness Chatbot  for guidance (Gemini API)
* ✅ Generate healthy recipes using  Recipe Generator 
* ✅ Track personal activity and plan selection

#### 🔹  Creator 

* ✅ Create and publish  Workout Plans 
* ✅ Create and publish  Diet Plans 
* ✅ Manage created plans via Creator Dashboard

#### 🔹  Admin 

* ✅ Manage  users ,  creators , and  plans 
* ✅ Oversee platform integrity and content quality

---

### 🧠  Key Features & Tech Stack 

| Feature                   | Description                                           |
| ------------------------- | ----------------------------------------------------- |
| 🧠 Gemini API Integration | Powers Chatbot and Nutrient Scanner                   |
| 📸 Nutrient Scanner       | Users upload food photos → receive nutrient breakdown |
| 💬 Fitness Chatbot        | Offers AI responses on workouts, diet, etc.           |
| 🍽️ Recipe Generator      | Converts ingredients into recipes using LLM           |
| 🗂️ Personalized Plans    | Users select diet/workout based on goals              |
| 🎨 User Dashboard         | Central hub for navigating features                   |

---

### 🏗️  System Architecture 

*  Frontend : React + TailwindCSS
*  Backend : Node.js (Express), with FastAPI microservices for AI tools
*  Database : MongoDB
*  APIs : Gemini API (Google), Custom REST APIs

---

### 🗃️  Database Structure (Key Collections) 

* `Users`: Stores profile, selected plans, scan/chat history
* `Creators`: Profile + created workout/diet plans
* `Admins`: Platform-level access control
* `Workouts`: Structured plans with goal tags
* `Diets`: Meals, calories, tags


---

### 🔁  User Journey Flow 

1. 🛂 User logs in
2. 🧭 Lands on dashboard
3. 🏋️ Accesses workout/diet plans
4. 🧃 Uses scanner or chatbot for guidance
5. 🍜 Inputs ingredients to generate recipes




---

### 📸  AI Tools Used 

| Tool                      | Purpose                               |
| ------------------------- | ------------------------------------- |
| 🔍  Gemini for Vision   | Nutrient detection from images        |
| 💬  Gemini for Chat     | Contextual chatbot for fitness & diet |
| 🧠  LLM (Local/Hosted)  | Recipe generation, AI assistants      |

---

### 📈  Future Enhancements 

* 🧭 Progress tracker for workouts/diets
* 🧑‍🤝‍🧑 Social workout rooms with live meet
* 📲 Mobile app integration
* 🧠 Personalized AI coach
* 🏅 Gamification and rewards system



