# 📄 API Documentation - FitSync

## 🏗️ Overview
FitSync is an AI-powered fitness platform that helps users plan workouts, track nutrition, and engage in video workouts. Below is a detailed API documentation covering authentication, workout plans, nutrition tracking, and video meet features.

---

## 🔑 Authentication APIs
### 1️⃣ Register User
- **Endpoint:** `POST /api/users/register`
- **Description:** Creates a new user account.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "weight": 75,
    "height": 180,
    "goal": "weight loss",
    "activityLevel": "moderately active",
    "dietPreference": "veg",
    "fitnessExperience": "beginner"
  }
  ```
- **Response:**
  ```json
  {
    "_id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
  ```

### 2️⃣ Login User
- **Endpoint:** `POST /api/users/login`
- **Description:** Logs in a user and returns a JWT token.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "_id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
  }
  ```

### 3️⃣ Get User Profile (Protected)
- **Endpoint:** `GET /api/users/profile`
- **Headers:** `{ Authorization: Bearer <token> }`
- **Response:**
  ```json
  {
    "_id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "weight": 75,
    "height": 180,
    "goal": "weight loss"
  }
  ```

---

## 🏋️‍♂️ Workout APIs
### 4️⃣ Get Workout Plan (Protected)
- **Endpoint:** `GET /api/exercises/workout-plan`
- **Headers:** `{ Authorization: Bearer <token> }`
- **Response:**
  ```json
  {
    "workoutPlan": [
      { "bodyPart": "chest", "exercises": [ { "name": "Push-up", "equipment": "body weight", "gifUrl": "example.com/pushup.gif" } ] }
    ]
  }
  ```

### 5️⃣ Get Exercises by Body Part
- **Endpoint:** `GET /api/exercises/:bodyPart`
- **Response:**
  ```json
  [
    { "name": "Push-up", "equipment": "body weight", "gifUrl": "example.com/pushup.gif" }
  ]
  ```

---

## 🍎 Nutrition APIs
### 6️⃣ Analyze Food Text
- **Endpoint:** `POST /api/nutrition`
- **Request Body:**
  ```json
  {
    "foodText": "1 apple"
  }
  ```
- **Response:**
  ```json
  {
    "food": "apple",
    "calories": 52,
    "protein": 0.3,
    "carbs": 14,
    "fats": 0.2
  }
  ```

### 7️⃣ Analyze Food Image
- **Endpoint:** `POST /api/nutrition/image`
- **Request Type:** `multipart/form-data`
- **Response:**
  ```json
  {
    "food": "apple",
    "nutrition": { "calories": 52, "protein": 0.3, "carbs": 14, "fats": 0.2 }
  }
  ```

---

## 🎥 Video Meet APIs
### 8️⃣ Start a Video Meeting
- **Endpoint:** `POST /api/video-meet/start`
- **Request Body:**
  ```json
  {
    "host_id": "12345",
    "participants": ["user1", "user2"]
  }
  ```
- **Response:**
  ```json
  {
    "meeting_url": "https://video-meet.com/meeting123"
  }
  ```

---

## 🛠️ Admin APIs
### 9️⃣ Manage Users (Admin Only)
- **Endpoint:** `GET /api/admin/users`
- **Headers:** `{ Authorization: Bearer <admin_token> }`
- **Response:**
  ```json
  [
    { "_id": "12345", "name": "John Doe", "email": "john@example.com" }
  ]
  ```

### 🔟 Manage Workouts (Admin Only)
- **Endpoint:** `POST /api/admin/workouts`
- **Headers:** `{ Authorization: Bearer <admin_token> }`
- **Request Body:**
  ```json
  {
    "title": "Full Body Workout",
    "category": "strength",
    "exercises": [ "push-up", "squat" ],
    "difficulty": "intermediate",
    "duration": 45
  }
  ```

---

## 🔒 Security & Access
- **All protected routes require:** `{ Authorization: Bearer <token> }`
- **Admin routes require:** `{ Authorization: Bearer <admin_token> }`
- **Authentication is managed using JWT tokens.**

---

## 📌 Notes
- **Error Handling:** API returns error messages in JSON format.
- **Pagination & Filtering:** Some endpoints may support pagination (to be implemented in future versions).

📌 **Last Updated:** `2025-03-08`

