# SaansSaathi - System Architecture

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS (Browser)                          │
│                 React SPA @ Vercel CDN                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS REST API
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SPRING BOOT BACKEND                            │
│                  (Render.com - Singapore)                        │
│                                                                  │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │ AuthFilter │  │  Controllers │  │  Recommendation       │   │
│  │ (JWT)      │→ │  (REST API)  │→ │  Engine (Rule-Based)  │   │
│  └────────────┘  └──────┬───────┘  └───────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────┼──────────────────────────────────┐   │
│  │                 Service Layer                            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌───────────┐  │   │
│  │  │  Auth    │ │   AQI    │ │ Family  │ │  Gemini   │  │   │
│  │  │ Service  │ │ Service  │ │ Service │ │  Service  │  │   │
│  │  └──────────┘ └──────────┘ └─────────┘ └───────────┘  │   │
│  └──────────────────────┼──────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │              External Integrations                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │   │
│  │  │  OpenAQ    │  │ Open-Meteo │  │  Gemini Flash    │  │   │
│  │  │  Client    │  │  Client    │  │  API Client      │  │   │
│  │  └────────────┘  └────────────┘  └──────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            Spring Scheduler (Background Jobs)             │   │
│  │  ┌────────────────┐  ┌──────────────────┐               │   │
│  │  │ AQI Refresh    │  │  Alert Generator │               │   │
│  │  │ (every 30 min) │  │  (every 30 min)  │               │   │
│  │  └────────────────┘  └──────────────────┘               │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ JDBC (HikariCP)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL 8.0 Database                            │
│                   (Railway.app - managed)                        │
│                                                                  │
│  23 Tables: users, family_*, aqi_readings, chat_*, ...          │
│  Flyway migrations: V1 (schema) + V2 (seed data)                │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
1. User opens browser → Vercel serves React app
2. React fetches /api/air-quality/current → Spring Boot
3. Spring Boot checks cache (Caffeine, 15 min TTL)
4. Cache miss → Fetches from OpenAQ API
5. OpenAQ returns station + measurements
6. AqiCalculationService computes Indian AQI
7. Result cached + stored in MySQL (aqi_readings)
8. Response sent to React with AQI + category + advisory
9. React renders dashboard with color-coded AQI
10. If AQI crosses threshold → Scheduler creates notification
```

## Security Architecture

```
Request → JwtAuthFilter (validates Bearer token)
       → SecurityFilterChain (checks role permissions)
       → Controller → Service → Repository
       
Tokens:
  Access Token:  1 hour  (stored in memory/state)
  Refresh Token: 7 days  (stored in DB for revocation)
  
API Keys: Backend env vars only. Never in frontend.
CORS:     Only allows FRONTEND_URL origin.
```

## Frontend Architecture

```
src/
├── api/          → Axios client + API service functions
├── store/        → Zustand global state (auth, settings)
├── pages/        → Route-level components (1 per route)
├── components/   → Reusable UI components
├── features/     → Feature modules (airquality, family, etc.)
├── hooks/        → Custom React hooks
└── utils/        → AQI helpers, formatters, validators
```

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Map library | Leaflet + OSM | Free, no paid API key |
| AI model | Gemini Flash 1.5 | Fast, free tier, sufficient |
| State | Zustand | Simple, no boilerplate |
| Charts | Recharts | Native React, TypeScript |
| DB migrations | Flyway | Simple SQL files |
| AQI calculation | Rule-based backend | Deterministic, verifiable |
| AI guardrails | System prompt | No medical diagnosis |
