# SayLoop 💬

SayLoop is a modern, real-time language learning and conversation platform. Built around the philosophy of real human interaction, it connects learners worldwide for practice, debates, and engaging discussions—no scripts, no bots, just people.

This repository is organized into a full-stack monorepo featuring a React/Vite frontend and a Node.js/Express backend, heavily relying on WebSockets for real-time functionality and Prisma for data management.

---

## 🛠 Tech Stack

### Frontend (`/sayloop-frontend`)
* **Core**: React 19, Vite, TypeScript
* **State Management**: Redux Toolkit & Redux Saga
* **Routing**: React Router DOM (v7)
* **Authentication**: Clerk React (`@clerk/clerk-react`, `@clerk/elements`)
* **Styling**: Tailwind CSS v4
* **Real-time**: Socket.IO Client
* **API Calls**: Axios

### Backend (`/sayloop-backend`)
* **Core**: Node.js, Express
* **Database & ORM**: PostgreSQL, Prisma (`@prisma/client`)
* **Real-time**: Socket.IO for live sessions and matchmaking
* **Authentication**: Clerk Node SDK for verifying JWTs and syncing user accounts
* **AI Integration**: Google Generative AI (`@google/generative-ai`) and OpenAI
* **Utilities**: Node-cron (scheduled tasks), Zod (validation), Express Rate Limit

---

## 🏗 Architecture & Data Flow

### 1. Authentication Lifecycle
Authentication is handled entirely by **Clerk**.
1. **Frontend**: The user logs in via Clerk UI components in the React app.
2. **Initialization**: On every authenticated session, a custom hook (`useAuthInit` in `App.tsx`) extracts the Clerk standard token and calls the backend `/api/users/sync`.
3. **Backend Sync**: The backend verifies the token and ensures a corresponding record exists in the local PostgreSQL database (creating one if it doesn't). The internal Database User ID (`db_user_id`) is then returned and cached on the frontend, serving as the primary identifier for application-specific logic (like matchmaking and WebSockets).

### 2. Real-Time WebSockets
Socket.IO is heavily utilized to foster instant communication. WebSockets are authenticated automatically using either the user's Clerk JWT or their `clerkId`. 
* **Matchmaking (`match.socket.js`)**: Users can send, receive, and accept match requests to converse on specific topics.
* **Sessions (`session.socket.js`)**: Once a match is accepted, users join isolated socket rooms to begin their live conversational exchange or debate.

### 3. Core Database Schema & Entities
The PostgreSQL database (managed by Prisma) handles the gamification, matching, and learning pathways:

* **Users**: Tracks profile data, `clerkId`, points, streak lengths, and current course progress.
* **Gamification**: 
  * `QuestDefinition` & `UserDailyQuest`: Tracks daily goals and progress.
  * `MonthlyChallengeDefinition` & `UserMonthlyChallenge`: Manages longer-term retention events.
* **Learning Paths (Duolingo-style tree)**:
  * `Course` → `Section` → `Unit` → `Lesson` → `Exercise` & `ExerciseOption`
  * Tracks completions via `LessonCompletion`, `ExerciseAttempt`, and overall `UserCourseProgress`.
* **Social**:
  * `Follow`: Tracks user connections.
  * `Match`: Tracks peer-to-peer session requests (`requesterId`, `receiverId`, `status`, `sessionId`).

---

## 🚀 Key Features

1. **Gamified Learning Tree**: Structured curriculum ranging from Courses to specific Exercises, enabling users to attempt questions, score points, and maintain engagement streaks.
2. **Live Peer-to-Peer Matching**: Rather than talking to bots, users match with other live users to practice greetings, advanced arguments, or casual daily life conversations.
3. **Daily Quests & Challenges**: Dynamic reward system tracking daily and monthly user milestones.
4. **AI-Assisted Features**: Intelligent prompt generation, answer verification, or conversational guidance powered by Gemini/OpenAI integration.
5. **Robust User Profiles**: Customizable profiles showing learning languages, interests (Travel, Tech, Gaming, etc.), nicknames, and flags.

---

## 🚦 Getting Started

### Prerequisites
* Node.js (v18+)
* PostgreSQL running locally or remotely
* Clerk Account (for Auth keys)

### Backend Setup
1. Navigate to `/sayloop-backend`
2. Run `npm install`
3. Copy `.env.example` to `.env` and configure:
   * `DATABASE_URL` (Your Postgres connection string)
   * `CLERK_SECRET_KEY`
   * `FRONTEND_URL` (usually `http://localhost:5173`)
4. Run migrations: `npm run migrate` (or `npx prisma db push` for dev)
5. Start the server: `npm run dev` (Runs on port 4000 by default)

### Frontend Setup
1. Navigate to `/sayloop-frontend`
2. Run `npm install`
3. Copy `.env.example` to `.env` and add:
   * `VITE_CLERK_PUBLISHABLE_KEY`
4. Start the dev server: `npm run dev`

---

## 📂 Directory Structure

```text
/
├── sayloop-backend/
│   ├── src/
│   │   ├── config/        # Environment and DB constants
│   │   ├── middleware/    # Auth, Logger, Rate limiting
│   │   ├── modules/       # Domain-driven feature sets (users, matches, etc.)
│   │   ├── prisma/        # Schema definition and seed scripts
│   │   ├── utils/         # Helpers and Node-Cron schedulers
│   │   ├── app.js         # Express App configuration
│   │   └── server.js      # Main entry point & Socket server
│   └── package.json
│
└── sayloop-frontend/
    ├── src/
    │   ├── assets/        # Images, Logos, SVGs
    │   ├── components/    # Reusable UI architecture (Auth, Match, Home modules)
    │   ├── hooks/         # Custom React hooks (e.g., useAuthInit)
    │   ├── redux/         # Global state & Saga side effects
    │   ├── page/          # Route-level Page layouts
    │   ├── lib/           # Axios singletons and utility configurations
    │   ├── App.tsx        # Application root
    │   └── main.tsx       # React DOM bindings
    └── package.json
```
