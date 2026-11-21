# SaansSaathi - Database Entity Relationship (ER) Diagram

## Overview

The SaansSaathi data model is structured around family units, real-time pollution telemetry, behavioral interventions, and personalized indoor mitigation.

```mermaid
erDiagram
    users ||--o{ user_locations : has
    users ||--o| family_groups : manages
    users ||--o{ daily_routines : creates
    users ||--o{ indoor_assessments : submits
    users ||--o{ notifications : receives
    users ||--o| user_preferences : configures
    users ||--o{ chat_sessions : conducts
    users ||--o{ challenge_participants : joins
    users ||--o{ reported_incidents : files

    family_groups ||--o{ family_members : contains

    daily_routines ||--o{ routine_activities : includes
    family_members ||--o{ routine_activities : assigned_to

    cities ||--o{ monitoring_stations : houses
    monitoring_stations ||--o{ aqi_readings : records
    aqi_readings ||--o{ pollutant_readings : comprises
    pollutants ||--o{ pollutant_readings : defines

    chat_sessions ||--o{ chat_messages : contains
    clean_air_challenges ||--o{ challenge_participants : tracks

    users {
        bigint id PK
        string email UK
        string password_hash
        string full_name
        string role
        boolean is_active
        datetime created_at
    }

    family_members {
        bigint id PK
        bigint family_group_id FK
        string name
        enum age_group "CHILD | ADULT | SENIOR"
        enum sensitive_category "NONE | RESPIRATORY | CARDIOVASCULAR | BOTH"
        tinyint daily_outdoor_hours
        enum exercise_preference "OUTDOOR | INDOOR | NONE"
    }

    aqi_readings {
        bigint id PK
        bigint station_id FK
        int aqi_value
        enum aqi_category "GOOD | SATISFACTORY | MODERATE | POOR | VERY_POOR | SEVERE"
        string dominant_pollutant
        datetime measured_at
    }

    pollutant_readings {
        bigint id PK
        bigint aqi_reading_id FK
        int pollutant_id FK
        decimal value
        string unit
        int sub_index
    }

    indoor_assessments {
        bigint id PK
        bigint user_id FK
        tinyint room_count
        boolean has_air_purifier
        boolean has_exhaust_fan
        enum cooking_fuel "LPG | BIOMASS | ELECTRIC"
        boolean uses_incense
        int budget_rupees
    }

    daily_routines {
        bigint id PK
        bigint user_id FK
        date routine_date
        int aqi_at_gen
        boolean is_custom
    }

    routine_activities {
        bigint id PK
        bigint routine_id FK
        bigint family_member_id FK
        time start_time
        time end_time
        string original_activity
        string recommendation
        string reason
        enum risk_level "LOW | MEDIUM | HIGH"
        boolean is_completed
    }
```

## Table Specifications & Key Relationships

1. **`users` & `family_groups` & `family_members`**:
   - Each user can organize their household into a `family_group`.
   - `family_members` stores vulnerability profiles (`CHILD`, `SENIOR`, `RESPIRATORY`, `CARDIOVASCULAR`).
   - The Rule-Based Recommendation Engine queries these profiles against live AQI to formulate customized precautions.

2. **`monitoring_stations`, `aqi_readings` & `pollutant_readings`**:
   - Normalized telemetry schema. `aqi_readings` preserves historical values calculated using CPCB sub-index algorithms.
   - Individual pollutant measurements (PM2.5, PM10, NO2, SO2, CO, O3) are kept in `pollutant_readings`.

3. **`indoor_assessments`**:
   - Records home factors (room count, presence of exhaust, incense burning, cooking fuel, budget).
   - Feeds the AI Indoor Air Hack Generator to formulate budget-appropriate Clean Air Room guidance.

4. **`daily_routines` & `routine_activities`**:
   - Contains hour-by-hour schedules with recommended adjustments based on diurnal inversion curves.
