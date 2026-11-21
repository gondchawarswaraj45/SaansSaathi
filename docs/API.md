# SaansSaathi - Complete REST API Specification

## 1. Global Conventions & Standards

### Base URL
- **Local Development**: `http://localhost:8080`
- **Production Web Service**: `https://saanssaathi-api.onrender.com` (or configured host)

### Security & Headers
Authenticated endpoints require a valid Bearer token in the HTTP Authorization header:
```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
Content-Type: application/json
```

### Standard Response Envelope (`ApiResponse<T>`)
Every endpoint returns a unified JSON envelope:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "error": null,
  "timestamp": "2026-11-21T18:00:00Z"
}
```

### Standard Error Response
```json
{
  "success": false,
  "message": "Resource not found with id: 42",
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "details": "Entity MonitoringStation [42] does not exist"
  },
  "timestamp": "2026-11-21T18:00:00Z"
}
```

---

## 2. API Catalog by Module

### Module 1: System Health (`/api/health`)
#### 1.1 Liveness Probe
- **Method**: `GET`
- **Path**: `/api/health`
- **Auth**: Public
- **Description**: Returns server operational state and current UTC timestamp.
- **Response**: `200 OK`
```json
{
  "status": "UP",
  "service": "SaansSaathi API",
  "version": "1.0.0",
  "timestamp": "2026-11-21T12:30:00Z"
}
```

---

### Module 2: Authentication (`/api/auth`)

#### 2.1 Register New User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password@123",
  "fullName": "Swaraj Gondchawar",
  "city": "Delhi NCR"
}
```
- **Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "refreshToken": "d748f219-...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "Swaraj Gondchawar",
      "city": "Delhi NCR",
      "role": "ROLE_USER"
    }
  }
}
```

#### 2.2 Login User
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```
- **Response**: `200 OK` (returns `accessToken`, `refreshToken`, and user payload)

#### 2.3 Refresh Access Token
- **Method**: `POST`
- **Path**: `/api/auth/refresh`
- **Auth**: Public
- **Request Body**:
```json
{
  "refreshToken": "d748f219-..."
}
```
- **Response**: `200 OK` (returns newly minted `accessToken` and rotated `refreshToken`)

#### 2.4 Logout User
- **Method**: `POST`
- **Path**: `/api/auth/logout`
- **Auth**: Authenticated
- **Request Body**:
```json
{
  "refreshToken": "d748f219-..."
}
```
- **Response**: `200 OK` (revokes the refresh token in database)

#### 2.5 Get Authenticated User Profile
- **Method**: `GET`
- **Path**: `/api/auth/me`
- **Auth**: Authenticated
- **Response**: `200 OK` (returns current user profile and preferences)

---

### Module 3: Air Quality Telemetry (`/api/air-quality`)

#### 3.1 Get Current AQI
- **Method**: `GET`
- **Path**: `/api/air-quality/current`
- **Auth**: Public
- **Query Params**:
  - `city` (optional, string): City name (e.g. "Delhi NCR")
  - `stationId` (optional, long): Specific station ID
  - `lat`, `lon` (optional, double): GPS coordinates
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "stationId": 1,
    "stationName": "Anand Vihar, Delhi",
    "city": "Delhi NCR",
    "aqi": 384,
    "category": "VERY_POOR",
    "dominantPollutant": "pm25",
    "temperature": 18.4,
    "humidity": 68.0,
    "measuredAt": "2026-11-21T11:45:00Z",
    "pollutants": [
      { "code": "pm25", "name": "PM2.5", "value": 242.0, "unit": "µg/m³", "subIndex": 384 },
      { "code": "pm10", "name": "PM10", "value": 395.0, "unit": "µg/m³", "subIndex": 355 },
      { "code": "no2", "name": "NO2", "value": 84.0, "unit": "µg/m³", "subIndex": 105 },
      { "code": "so2", "name": "SO2", "value": 22.0, "unit": "µg/m³", "subIndex": 28 },
      { "code": "co", "name": "CO", "value": 2.4, "unit": "mg/m³", "subIndex": 112 },
      { "code": "o3", "name": "Ozone", "value": 46.0, "unit": "µg/m³", "subIndex": 46 }
    ]
  }
}
```

#### 3.2 List Monitoring Stations by City
- **Method**: `GET`
- **Path**: `/api/air-quality/stations?city={cityName}`
- **Auth**: Public
- **Response**: `200 OK` (list of stations with coordinates and current AQI values)

#### 3.3 Get Station Historical Readings
- **Method**: `GET`
- **Path**: `/api/air-quality/history?stationId={id}&days={1-7}`
- **Auth**: Public
- **Response**: `200 OK` (chronological list of readings showing diurnal inversion cycles)

---

### Module 4: Family Health Protection (`/api/family`)

#### 4.1 Get User Family Group
- **Method**: `GET`
- **Path**: `/api/family`
- **Auth**: Authenticated
- **Response**: `200 OK` (returns family group details and member count)

#### 4.2 Create Family Group
- **Method**: `POST`
- **Path**: `/api/family`
- **Auth**: Authenticated
- **Request Body**:
```json
{
  "name": "Gondchawar Household",
  "primaryCity": "Pune"
}
```
- **Response**: `201 Created`

#### 4.3 List Family Members
- **Method**: `GET`
- **Path**: `/api/family/members`
- **Auth**: Authenticated
- **Response**: `200 OK` (array of family members with sensitivity profiles)

#### 4.4 Add Family Member
- **Method**: `POST`
- **Path**: `/api/family/members`
- **Auth**: Authenticated
- **Request Body**:
```json
{
  "name": "Aarav",
  "age": 8,
  "ageGroup": "CHILD",
  "sensitiveCategory": "RESPIRATORY",
  "dailyOutdoorHours": 2,
  "exercisePreference": "OUTDOOR"
}
```
- **Response**: `201 Created`

#### 4.5 Update Family Member
- **Method**: `PUT`
- **Path**: `/api/family/members/{id}`
- **Auth**: Authenticated
- **Request Body**: Partial or full update payload
- **Response**: `200 OK`

#### 4.6 Delete Family Member
- **Method**: `DELETE`
- **Path**: `/api/family/members/{id}`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 4.7 Get Rule-Based Family Recommendations
- **Method**: `GET`
- **Path**: `/api/family/recommendations`
- **Auth**: Authenticated
- **Response**: `200 OK` (customized health directives cross-referenced against live AQI)

---

### Module 5: Indoor Air Assistant (`/api/indoor`)

#### 5.1 Submit Indoor Assessment
- **Method**: `POST`
- **Path**: `/api/indoor/assessment`
- **Auth**: Authenticated
- **Request Body**:
```json
{
  "roomCount": 3,
  "hasAirPurifier": false,
  "hasExhaustFan": true,
  "cookingFuel": "LPG",
  "usesIncense": true,
  "usesMosquitoCoil": false,
  "windowSealingQuality": "MEDIUM",
  "budgetRupees": 2500
}
```
- **Response**: `201 Created` (returns calculated safety score 0–100 and risk flags)

#### 5.2 Get Latest Indoor Assessment
- **Method**: `GET`
- **Path**: `/api/indoor/assessment`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 5.3 Get Clean Air Room Blueprint
- **Method**: `GET`
- **Path**: `/api/indoor/clean-air-room`
- **Auth**: Authenticated
- **Response**: `200 OK` (step-by-step guidance for sealing and operating an indoor clean refuge)

#### 5.4 Get DIY Air Purifier Engineering Guide
- **Method**: `GET`
- **Path**: `/api/indoor/diy-purifier-guide`
- **Auth**: Public
- **Response**: `200 OK` (₹1,500 bill-of-materials, fan sizing, MERV-13 filter assembly)

---

### Module 6: AI Saathi Copilot (`/api/ai`)

#### 6.1 Send Conversational Query
- **Method**: `POST`
- **Path**: `/api/ai/chat`
- **Auth**: Authenticated
- **Request Body**:
```json
{
  "sessionId": null,
  "message": "My mother is 72 with hypertension. Can she walk in Lodhi Garden tomorrow morning?"
}
```
- **Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "sessionId": 12,
    "reply": "Based on Delhi's current Very Poor AQI (384) and morning temperature inversion, walking outdoors between 6:00 AM and 10:00 AM poses serious cardiovascular strain. I recommend shifting her walking routine to an indoor corridor or waiting until the 1:00 PM – 3:30 PM solar ventilation window.",
    "medicalDisclaimer": "For awareness only. Not medical advice.",
    "emergencySuggested": false
  }
}
```

#### 6.2 List User Chat Sessions
- **Method**: `GET`
- **Path**: `/api/ai/chat/sessions`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 6.3 Explain Air Quality Concept
- **Method**: `GET`
- **Path**: `/api/ai/explain?term=pm25`
- **Auth**: Public
- **Response**: `200 OK` (plain-language explanation of particulate matter)

---

### Module 7: Daily Routine Planner (`/api/routines`)

#### 7.1 Get Today's Routine
- **Method**: `GET`
- **Path**: `/api/routines?date={YYYY-MM-DD}`
- **Auth**: Authenticated
- **Response**: `200 OK` (timeline activities ordered by time slot)

#### 7.2 Generate Diurnal Routine
- **Method**: `POST`
- **Path**: `/api/routines/generate`
- **Auth**: Authenticated
- **Request Body**: `{ "date": "2026-11-21" }`
- **Response**: `201 Created`

#### 7.3 Mark Activity Completed
- **Method**: `POST`
- **Path**: `/api/routines/{id}/activities/{actId}/complete`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 7.4 Get Weekly Compliance
- **Method**: `GET`
- **Path**: `/api/routines/weekly`
- **Auth**: Authenticated
- **Response**: `200 OK` (7-day completion breakdown)

---

### Module 8: Geospatial Map Telemetry (`/api/map`)

#### 8.1 Get Stations by Geographic Bounds
- **Method**: `GET`
- **Path**: `/api/map/stations?sw_lat=28.4&sw_lng=76.8&ne_lat=28.9&ne_lng=77.4`
- **Auth**: Public
- **Response**: `200 OK` (array of station markers with lat/lng, AQI, CPCB category, and pulse color)

#### 8.2 Get Station Popup Details
- **Method**: `GET`
- **Path**: `/api/map/stations/{id}/popup`
- **Auth**: Public
- **Response**: `200 OK` (detailed popover card content)

---

### Module 9: Notifications & Smog Alerts (`/api/notifications`)

#### 9.1 Get Notifications Feed
- **Method**: `GET`
- **Path**: `/api/notifications`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 9.2 Get Unread Alerts Count
- **Method**: `GET`
- **Path**: `/api/notifications/unread-count`
- **Auth**: Authenticated
- **Response**: `200 OK` (integer count)

#### 9.3 Mark Notification Read
- **Method**: `PUT`
- **Path**: `/api/notifications/{id}/read`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 9.4 Mark All Notifications Read
- **Method**: `PUT`
- **Path**: `/api/notifications/read-all`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 9.5 Get / Update Preferences
- **Method**: `GET` | `PUT`
- **Path**: `/api/notifications/preferences`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 9.6 Trigger Test Smog Alert
- **Method**: `POST`
- **Path**: `/api/notifications/test-alert`
- **Auth**: Authenticated
- **Response**: `200 OK`

---

### Module 10: Clean Air Challenges & Gamification (`/api/challenges`)

#### 10.1 List Active Challenges
- **Method**: `GET`
- **Path**: `/api/challenges`
- **Auth**: Public
- **Response**: `200 OK` (catalog of 10 challenges with points and duration)

#### 10.2 Enlist / Join Challenge
- **Method**: `POST`
- **Path**: `/api/challenges/{id}/join`
- **Auth**: Authenticated
- **Response**: `201 Created`

#### 10.3 Log Daily Challenge Progress
- **Method**: `PUT`
- **Path**: `/api/challenges/{id}/progress`
- **Auth**: Authenticated
- **Request Body**: `{ "completedDay": true }`
- **Response**: `200 OK` (returns updated progress count and unlocked badges if completed)

#### 10.4 Get User Badges & Points
- **Method**: `GET`
- **Path**: `/api/challenges/badges` | `/api/challenges/points`
- **Auth**: Authenticated
- **Response**: `200 OK`

---

### Module 11: Saved Locations (`/api/locations`)

#### 11.1 List Saved Locations
- **Method**: `GET`
- **Path**: `/api/locations`
- **Auth**: Authenticated
- **Response**: `200 OK`

#### 11.2 Save New Location
- **Method**: `POST`
- **Path**: `/api/locations`
- **Auth**: Authenticated
- **Request Body**:
```json
{
  "name": "Noida Office",
  "latitude": 28.5355,
  "longitude": 77.3910,
  "isPrimary": false
}
```
- **Response**: `201 Created`

#### 11.3 Delete Location
- **Method**: `DELETE`
- **Path**: `/api/locations/{id}`
- **Auth**: Authenticated
- **Response**: `200 OK`

---

### Module 12: Administration & Telemetry (`/api/admin`)

#### 12.1 Get System Telemetry Metrics
- **Method**: `GET`
- **Path**: `/api/admin/stats`
- **Auth**: Admin Only (`ROLE_ADMIN`)
- **Response**: `200 OK` (user counts, station telemetry counts, active alerts)

#### 12.2 Get API Pipeline Health Probes
- **Method**: `GET`
- **Path**: `/api/admin/api-health`
- **Auth**: Admin Only (`ROLE_ADMIN`)
- **Response**: `200 OK` (latencies for OpenAQ, Open-Meteo, Gemini AI, SQLite)

#### 12.3 Broadcast Emergency Smog Advisory
- **Method**: `POST`
- **Path**: `/api/admin/notifications/broadcast`
- **Auth**: Admin Only (`ROLE_ADMIN`)
- **Request Body**:
```json
{
  "city": "Delhi NCR",
  "title": "EMERGENCY: GRAP Stage IV Enacted",
  "message": "AQI exceeds 450 across all stations. Cease all non-essential outdoor travel.",
  "severity": "EMERGENCY"
}
```
- **Response**: `200 OK`
