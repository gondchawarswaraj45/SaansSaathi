# SaansSaathi 🌿
### *Breathe Better. Live Smarter.*

**AI-Powered Urban Air Quality & Family Health Protection Platform**

[![Backend CI](https://github.com/YOUR_USERNAME/saansSaathi/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/saansSaathi/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/YOUR_USERNAME/saansSaathi/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/saansSaathi/actions/workflows/frontend-ci.yml)

---

## 🎯 What is SaansSaathi?

SaansSaathi (सांस साथी — *Your Breath Companion*) is a full-stack web application that helps Indian urban families make better daily decisions based on real-time air quality data. Unlike existing AQI apps that just show numbers, SaansSaathi:

- 🏘️ **Personalizes protection** for every family member (child, senior, asthmatic)
- 🏠 **Guides indoor air improvement** with affordable, practical recommendations
- 🤖 **Answers your questions** via an AI chatbot (powered by Gemini)
- 📅 **Generates daily routines** adjusted for current and predicted air quality
- 🗺️ **Shows city-wide pollution** on an interactive map
- 🏆 **Challenges your family** to adopt cleaner habits

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap |
| Backend | Java 21 + Spring Boot 3 |
| Database | MySQL 8.0 |
| Auth | JWT (Access + Refresh tokens) |
| AI | Google Gemini 1.5 Flash |
| AQI Data | OpenAQ API v3 |
| Weather | Open-Meteo API |
| Deployment | Vercel (Frontend) + Render (Backend) + Railway (MySQL) |

---

## 🏗️ Project Structure

```
saansSaathi/
├── frontend/                   # React + TypeScript app
│   ├── src/
│   │   ├── api/               # Axios client + API services
│   │   ├── components/        # Reusable UI components
│   │   │   ├── common/        # Buttons, Navbar, etc.
│   │   │   ├── dashboard/     # AQI cards, charts
│   │   │   ├── map/           # Leaflet map components
│   │   │   ├── family/        # Family member cards
│   │   │   ├── indoor/        # Indoor assessment UI
│   │   │   └── chatbot/       # AI chat interface
│   │   ├── features/          # Feature-based modules
│   │   ├── pages/             # Route-level page components
│   │   ├── store/             # Zustand state stores
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Helper utilities
│   │   └── types/             # TypeScript type definitions
│   └── public/
│
├── backend/                    # Spring Boot app
│   └── src/main/java/com/saanssaathi/app/
│       ├── auth/              # JWT auth, security config
│       ├── airquality/        # AQI data, calculation engine
│       ├── family/            # Family profiles, recommendations
│       ├── indoor/            # Indoor assessment, tips
│       ├── planner/           # Daily routine generator
│       ├── ai/                # Gemini integration, chatbot
│       ├── notifications/     # Alert system
│       ├── admin/             # Admin dashboard
│       ├── integration/       # External API clients
│       └── common/            # Exception handlers, utilities
│
├── docs/                       # Documentation
├── suggestions/                # Development suggestions (6 files)
├── sample images/              # UI reference images
├── task.txt                    # Complete development task list
├── docker-compose.yml          # Local development setup
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Java 21+
- Node.js 20+
- MySQL 8.0+ (or Docker)
- Maven 3.8+

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/saansSaathi.git
cd saansSaathi
```

### 2. Start MySQL (using Docker)
```bash
docker-compose up -d mysql
```

### 3. Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your API keys and database credentials
```

### 4. Start Backend
```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
# Backend starts at http://localhost:8080
# API docs available at http://localhost:8080/swagger-ui.html
```

### 5. Configure Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_BASE_URL=http://localhost:8080/api
```

### 6. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend starts at http://localhost:5173
```

---

## 🌍 Live Demo

| Service | URL |
|---|---|
| **Frontend** | https://saanssaathi.vercel.app |
| **Backend API** | https://saanssaathi-backend.onrender.com |
| **API Docs** | https://saanssaathi-backend.onrender.com/swagger-ui.html |

> ⚠️ Note: Backend may take 30-60 seconds to respond on first request (Render free tier cold start).

---

## 📡 External APIs Used

| API | Purpose | Cost |
|---|---|---|
| [OpenAQ v3](https://openaq.org) | Real-time & historical AQI data | Free (2000 req/day) |
| [Open-Meteo](https://open-meteo.com) | Weather context | Free, no key needed |
| [Google Gemini](https://aistudio.google.com) | AI chatbot & recommendations | Free tier |
| [OpenStreetMap](https://www.openstreetmap.org) | Map tiles | Free |

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```properties
DB_URL=jdbc:mysql://localhost:3306/saanssaathi_db
DB_USERNAME=saanssaathi_user
DB_PASSWORD=your_password
JWT_SECRET=your_256bit_secret_key
OPENAQ_API_KEY=your_openaq_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)
```properties
VITE_API_BASE_URL=http://localhost:8080/api
```

> ⚠️ **Never commit .env files to git.** See `.env.example` files for templates.

---

## 🧪 Running Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests  
cd frontend
npm run test

# Backend test coverage report
mvn jacoco:report
# Open target/site/jacoco/index.html
```

---

## 📋 Development Progress

See [task.txt](./task.txt) for the complete 15-step development roadmap.

| Phase | Status |
|---|---|
| Step 1: Project Setup | [ ] |
| Step 2: Authentication | [ ] |
| Step 3: AQI Dashboard | [ ] |
| Step 4: Family Management | [ ] |
| Step 5: Indoor Air Assistant | [ ] |
| Step 6: AI Integration | [ ] |
| Step 7: Daily Planner | [ ] |
| Step 8: Air Quality Map | [ ] |
| Step 9: Notifications | [ ] |
| Step 10: Challenges | [ ] |
| Step 11: Landing Page | [ ] |
| Step 12: Admin Dashboard | [ ] |
| Step 13: Testing & QA | [ ] |
| Step 14: Deployment | [ ] |
| Step 15: Documentation | [ ] |

---

## 📚 Documentation

| Document | Description |
|---|---|
| [task.txt](./task.txt) | Complete development task list (15 steps) |
| [suggestions/01_ui_design.txt](./suggestions/01_ui_design_suggestions.txt) | UI/UX design recommendations |
| [suggestions/02_tech_stack.txt](./suggestions/02_tech_stack_suggestions.txt) | Technology choices rationale |
| [suggestions/03_api_integration.txt](./suggestions/03_api_integration_suggestions.txt) | API integration guide |
| [suggestions/04_database.txt](./suggestions/04_database_design_suggestions.txt) | Complete MySQL schema |
| [suggestions/05_deployment.txt](./suggestions/05_deployment_suggestions.txt) | Deployment step-by-step |
| [suggestions/06_improvements.txt](./suggestions/06_project_improvement_suggestions.txt) | Unique features to stand out |

---

## 🏥 Health & Safety Disclaimer

SaansSaathi provides **general air quality awareness** information. It is **not a medical device** and does not:
- Diagnose medical conditions
- Replace professional medical advice
- Provide precise inhaled dose measurements

For health concerns related to air pollution, consult a qualified healthcare professional.

**Data Sources & Attribution:**
- Air quality data: OpenAQ (openaq.org)
- AQI categories: CPCB National AQI System
- Health guidelines: WHO, CPCB, NCDC
- Maps: OpenStreetMap contributors

---

## 👥 Team

| Name | Role |
|---|---|
| [Your Name] | Full Stack Developer |

---

## 📄 License

This project is developed for educational purposes as part of a college project.

---

*SaansSaathi — Breathe Better. Live Smarter.* 🌿
