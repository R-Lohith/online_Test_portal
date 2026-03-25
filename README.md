# 🎓 BIT Test Portal

A full-stack **online examination and learning management platform** built for BIT (Bangalore Institute of Technology) students and administrators. It allows students to take MCQ topic-based tests and coding challenges, while admins can manage the entire question bank — manually or using AI.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | https://online-test-portal-topaz.vercel.app |
| **Backend API (Render)** | https://online-test-portal-1.onrender.com |

---

## ✨ Features

### 👩‍🎓 Student Side
- **Secure Registration & Login** — Username/password auth stored in MongoDB
- **Google Sign-In** — One-click login via Firebase Authentication
- **MCQ Practice Tests** — Topic-wise tests with Easy / Medium / Hard difficulty levels
- **Real-time Timer** — Countdown timer during every test
- **Instant Score & Review** — Correct/wrong answers shown after submission
- **Code Editor** — LeetCode-style coding problems with Python test runner
- **Dashboard** — Progress charts, skill radar, recent activity, upcoming test schedule

### 🛡️ Admin Side
- **Secure Admin Login** — Separate login portal for administrators
- **Manual Question Entry** — Add MCQ questions with 4 options and mark the correct answer
- **AI Question Generation** — Auto-generate MCQs for any topic using **Gemini 2.5 Flash** AI
- **Browse Question Bank** — View, filter by level, and delete questions per topic
- **Override Dark Mode** — Admin UI supports light/dark theme

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, TailwindCSS |
| **UI Components** | Lucide React, Recharts, React Icons |
| **Auth** | Firebase Authentication (Google), JWT (MongoDB users) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **AI** | Google Gemini API (2.5 Flash / 2.0 Flash) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 📁 Project Structure

```
bit-test-portal/
├── client/                      # React frontend (Vite)
│   ├── components/
│   │   ├── Layout.jsx           # Student sidebar layout
│   │   ├── AdminLayout.jsx      # Admin sidebar layout
│   │   └── ProtectedRoute.jsx   # Route guard (role-based)
│   ├── config/
│   │   └── firebase.js          # Firebase app + Google auth
│   ├── hooks/
│   │   └── useAuth.js           # Auth state hook
│   ├── pages/
│   │   ├── Login.jsx            # Student login + signup
│   │   ├── AdminLogin.jsx       # Admin login + register
│   │   ├── Dashboard.jsx        # Student dashboard (charts)
│   │   ├── MCQTests.jsx         # Topic listing page
│   │   ├── CodeEditor.jsx       # Coding challenge platform
│   │   ├── Results.jsx          # Test results history
│   │   ├── Admin.jsx            # Admin overview dashboard
│   │   ├── admin/
│   │   │   └── ManageQuestions.jsx  # Add/view/delete questions
│   │   └── student/
│   │       ├── TopicTestPage.jsx    # Test-taking interface
│   │       ├── StudentDashboard.jsx
│   │       ├── StudentMCQ.jsx
│   │       └── TestInterface.jsx
│   ├── App.jsx                  # Routes definition
│   └── main.jsx                 # Entry point
│
├── server/                      # Node.js + Express backend
│   ├── models/
│   │   ├── User.js              # User schema (student/admin)
│   │   ├── Student.js           # Student profile
│   │   ├── Admin.js             # Admin profile
│   │   ├── Login.js             # Login event log
│   │   ├── TopicQuestion.js     # Dynamic topic MCQ schema
│   │   ├── Question.js          # General question schema
│   │   ├── Result.js            # Test result schema
│   │   └── StudentResult.js     # Per-student result log
│   ├── routes/
│   │   ├── auth.js              # POST /api/auth/register, /api/auth/login
│   │   ├── mcq.js               # GET/POST/DELETE /api/mcq/*
│   │   ├── student.js           # Student-specific routes
│   │   └── questions.js         # General question routes
│   ├── middleware/              # Auth middleware (JWT verify)
│   ├── db.js                    # MongoDB connection
│   └── server.js                # Express app entry point
│
├── vercel.json                  # SPA routing fix for Vercel
├── vite.config.js               # Vite config with API proxy
└── .env.example                 # Template for environment variables
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Google Firebase project (for Google Sign-In)
- Google Gemini API key (for AI question generation)

---

### 1. Clone the repository

```bash
git clone https://github.com/R-Lohith/online_Test_portal.git
cd online_Test_portal
```

---

### 2. Set up the Backend

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/bit-portal
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGIN=http://localhost:3000
```

Start the backend:
```bash
npm start
```
> Backend runs at `http://localhost:5000`

---

### 3. Set up the Frontend

Go back to the project root:
```bash
cd ..
npm install
```

Create `.env` at the **project root** (same folder as `vite.config.js`):
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend dev server:
```bash
npm run dev
```
> Frontend runs at `http://localhost:3000`

---

## 🔑 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ username, email, password, role }` | Register a new user |
| `POST` | `/api/auth/login` | `{ username, password }` | Login (returns JWT token + role) |

> `role` must be `"student"` or `"admin"`. Defaults to `"student"` if not provided.

---

### MCQ Routes — `/api/mcq`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/mcq/topics` | List all topic collections with level breakdown |
| `GET` | `/api/mcq/questions?topic=React&level=easy` | Fetch questions for a topic + level |
| `POST` | `/api/mcq/manual` | Add a single question manually |
| `POST` | `/api/mcq/ai` | Generate MCQs using Gemini AI |
| `POST` | `/api/mcq/rag` | Generate MCQs from a PDF using Gemini |
| `DELETE` | `/api/mcq/questions/:topic/:id` | Delete a question by ID |

---

## 📦 Deployment

### Deploy Frontend to Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add **Environment Variable** in Vercel dashboard:
   ```
   VITE_API_URL = https://your-render-backend.onrender.com
   ```
6. Deploy → Done ✅

> `vercel.json` is already configured for SPA routing — all URLs redirect to `index.html`.

---

### Deploy Backend to Render

1. Go to [render.com](https://render.com) → New Web Service → Connect GitHub repo
2. Set **Root Directory**: `server`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add **Environment Variables**:
   ```
   MONGO_URI         = mongodb+srv://...
   JWT_SECRET        = your_secret
   GEMINI_API_KEY    = your_gemini_key
   ALLOWED_ORIGIN    = https://your-vercel-app.vercel.app
   PORT              = 5000
   ```
6. Deploy → Done ✅

---

## 🔐 Authentication Flow

```
Student:
  Register → /login (Sign Up tab) → POST /api/auth/register (role: student)
  Login    → /login (Sign In tab) → POST /api/auth/login → JWT stored in localStorage

Admin:
  Register → /admin/login (Register tab) → POST /api/auth/register (role: admin)
  Login    → /admin/login (Login tab)    → POST /api/auth/login → must return role: admin

Google Login:
  Student only → Firebase signInWithPopup → token stored in localStorage
```

> ⚠️ No hardcoded or backdoor credentials exist. All users must register first.

---

## 🤖 AI Question Generation

The admin panel uses **Google Gemini 2.5 Flash** to auto-generate MCQ questions:

1. Admin logs in → **Manage Questions** → **AI Generate** tab
2. Enter: Topic name, Subject (optional), Difficulty level, Number of questions
3. Click **Generate with Gemini AI**
4. Questions are saved to MongoDB and immediately available for students

Models tried in order (auto-fallback):
`gemini-2.5-flash` → `gemini-2.0-flash` → `gemini-2.0-flash-lite` → `gemini-1.5-flash`

---

## 🗺️ App Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Redirects to `/login` |
| `/login` | Public | Student login + signup |
| `/admin/login` | Public | Admin login + register |
| `/dashboard` | Student | Stats, charts, upcoming tests |
| `/mcq-tests` | Student | Browse topics and start tests |
| `/mcq-tests/:topic` | Student | Take a test for a specific topic |
| `/code-editor` | Student | Coding challenge platform |
| `/results` | Student | Past test results |
| `/admin` | Admin | Admin overview + question bank stats |
| `/admin/questions` | Admin | Add/view/delete MCQ questions |

---

## 🛠️ Environment Variables Reference

### Root `.env` (Frontend — Vite)
```env
VITE_API_URL=https://your-backend.onrender.com
```

### `server/.env` (Backend — Node.js)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=a_long_random_secret_string
GEMINI_API_KEY=AIzaSy...
ALLOWED_ORIGIN=https://your-app.vercel.app
```

> ⚠️ Never commit `.env` files. They are listed in `.gitignore`.

---

## 🧪 Running Tests

Currently no automated test suite. Manual testing checklist:

- [ ] Student can register and login
- [ ] Admin can register and login
- [ ] Admin can add manual questions
- [ ] Admin AI question generation works (requires Gemini API key)
- [ ] Student can view topics and take tests
- [ ] Score is calculated and displayed correctly
- [ ] Google Sign-In works (requires Firebase config)

---

## 📝 License

This project is for educational use at BIT (Bangalore Institute of Technology).

---

## 👨‍💻 Author

**R. Lohith** — [GitHub](https://github.com/R-Lohith)
