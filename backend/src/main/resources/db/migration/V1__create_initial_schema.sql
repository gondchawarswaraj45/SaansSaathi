-- ================================================================
-- SaansSaathi Database Schema - Initial Migration
-- V1__create_initial_schema.sql
-- ================================================================
-- Run order: This file runs first on a fresh database
-- Database: MySQL 8.0+
-- Charset: utf8mb4 (supports Hindi/Marathi characters)
-- ================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone           VARCHAR(15),
    role            ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at   DATETIME,
    UNIQUE KEY uk_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- refresh_tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  DATETIME NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_revoked  BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE KEY uk_token_hash (token_hash),
    INDEX idx_user_expires (user_id, expires_at),
    CONSTRAINT fk_refresh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- cities
-- ============================================================
CREATE TABLE IF NOT EXISTS cities (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    state       VARCHAR(100) NOT NULL,
    country     VARCHAR(50) NOT NULL DEFAULT 'India',
    latitude    DECIMAL(9,6) NOT NULL,
    longitude   DECIMAL(9,6) NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_name (name),
    INDEX idx_coordinates (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- user_locations
-- ============================================================
CREATE TABLE IF NOT EXISTS user_locations (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    name        VARCHAR(100) NOT NULL,
    area_name   VARCHAR(150),
    latitude    DECIMAL(9,6) NOT NULL,
    longitude   DECIMAL(9,6) NOT NULL,
    city_id     INT UNSIGNED,
    is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_primary (user_id, is_primary),
    CONSTRAINT fk_location_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_location_city FOREIGN KEY (city_id) REFERENCES cities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- monitoring_stations
-- ============================================================
CREATE TABLE IF NOT EXISTS monitoring_stations (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    openaq_id   VARCHAR(50),
    name        VARCHAR(200) NOT NULL,
    city_id     INT UNSIGNED,
    area_name   VARCHAR(150),
    latitude    DECIMAL(9,6) NOT NULL,
    longitude   DECIMAL(9,6) NOT NULL,
    provider    VARCHAR(100),
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen   DATETIME,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city (city_id),
    INDEX idx_coordinates (latitude, longitude),
    INDEX idx_openaq_id (openaq_id),
    CONSTRAINT fk_station_city FOREIGN KEY (city_id) REFERENCES cities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- pollutants
-- ============================================================
CREATE TABLE IF NOT EXISTS pollutants (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(20) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    full_name       VARCHAR(200),
    unit            VARCHAR(20) NOT NULL,
    cpcb_safe_limit DECIMAL(8,2),
    who_guideline   DECIMAL(8,2),
    description     TEXT,
    UNIQUE KEY uk_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- aqi_readings
-- ============================================================
CREATE TABLE IF NOT EXISTS aqi_readings (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    station_id          BIGINT UNSIGNED NOT NULL,
    aqi_value           INT UNSIGNED NOT NULL,
    aqi_category        ENUM('GOOD','SATISFACTORY','MODERATE','POOR','VERY_POOR','SEVERE') NOT NULL,
    dominant_pollutant  VARCHAR(20),
    source              VARCHAR(50) NOT NULL DEFAULT 'OPENAQ',
    measured_at         DATETIME NOT NULL,
    fetched_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_station_time (station_id, measured_at),
    INDEX idx_measured_at (measured_at),
    CONSTRAINT fk_reading_station FOREIGN KEY (station_id) REFERENCES monitoring_stations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- pollutant_readings
-- ============================================================
CREATE TABLE IF NOT EXISTS pollutant_readings (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    aqi_reading_id  BIGINT UNSIGNED NOT NULL,
    pollutant_id    INT UNSIGNED NOT NULL,
    value           DECIMAL(10,3) NOT NULL,
    unit            VARCHAR(20) NOT NULL,
    sub_index       INT UNSIGNED,
    INDEX idx_aqi_reading (aqi_reading_id),
    CONSTRAINT fk_pr_reading FOREIGN KEY (aqi_reading_id) REFERENCES aqi_readings(id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_pollutant FOREIGN KEY (pollutant_id) REFERENCES pollutants(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- weather_readings
-- ============================================================
CREATE TABLE IF NOT EXISTS weather_readings (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    temperature     DECIMAL(5,2),
    humidity        TINYINT UNSIGNED,
    wind_speed      DECIMAL(6,2),
    wind_direction  SMALLINT UNSIGNED,
    weather_code    SMALLINT,
    is_foggy        BOOLEAN,
    measured_at     DATETIME NOT NULL,
    INDEX idx_location_time (latitude, longitude, measured_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- family_groups
-- ============================================================
CREATE TABLE IF NOT EXISTS family_groups (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    family_name VARCHAR(100) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user (user_id),
    CONSTRAINT fk_fg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- family_members
-- ============================================================
CREATE TABLE IF NOT EXISTS family_members (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    family_group_id         BIGINT UNSIGNED NOT NULL,
    name                    VARCHAR(100) NOT NULL,
    age_group               ENUM('CHILD','ADULT','SENIOR') NOT NULL DEFAULT 'ADULT',
    birth_year              SMALLINT UNSIGNED,
    sensitive_category      ENUM('NONE','RESPIRATORY','CARDIOVASCULAR','BOTH') DEFAULT 'NONE',
    daily_outdoor_hours     TINYINT UNSIGNED DEFAULT 1,
    work_schedule_start     TIME,
    work_schedule_end       TIME,
    exercise_preference     ENUM('OUTDOOR','INDOOR','NONE') DEFAULT 'NONE',
    is_active               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_family_group (family_group_id),
    CONSTRAINT fk_fm_group FOREIGN KEY (family_group_id) REFERENCES family_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- daily_routines
-- ============================================================
CREATE TABLE IF NOT EXISTS daily_routines (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    routine_date    DATE NOT NULL,
    generated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aqi_at_gen      INT UNSIGNED,
    is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE KEY uk_user_date (user_id, routine_date),
    INDEX idx_user (user_id),
    CONSTRAINT fk_routine_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- routine_activities
-- ============================================================
CREATE TABLE IF NOT EXISTS routine_activities (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    routine_id          BIGINT UNSIGNED NOT NULL,
    family_member_id    BIGINT UNSIGNED,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    activity_name       VARCHAR(200) NOT NULL,
    original_activity   VARCHAR(200),
    recommendation      TEXT NOT NULL,
    reason              VARCHAR(500),
    type                ENUM('OUTDOOR','INDOOR','TRAVEL','EXERCISE','WORK') DEFAULT 'INDOOR',
    risk_level          ENUM('LOW','MEDIUM','HIGH') DEFAULT 'LOW',
    is_completed        BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at        DATETIME,
    INDEX idx_routine (routine_id),
    CONSTRAINT fk_ra_routine FOREIGN KEY (routine_id) REFERENCES daily_routines(id) ON DELETE CASCADE,
    CONSTRAINT fk_ra_member FOREIGN KEY (family_member_id) REFERENCES family_members(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- indoor_assessments
-- ============================================================
CREATE TABLE IF NOT EXISTS indoor_assessments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL,
    room_count          TINYINT UNSIGNED NOT NULL DEFAULT 2,
    window_count        TINYINT UNSIGNED NOT NULL DEFAULT 4,
    floor_number        TINYINT UNSIGNED DEFAULT 1,
    total_floors        TINYINT UNSIGNED DEFAULT 4,
    has_air_purifier    BOOLEAN DEFAULT FALSE,
    has_exhaust_fan     BOOLEAN DEFAULT FALSE,
    has_chimney         BOOLEAN DEFAULT FALSE,
    cooking_fuel        ENUM('LPG','BIOMASS','ELECTRIC','PIPED_GAS','NONE') DEFAULT 'LPG',
    uses_incense        BOOLEAN DEFAULT FALSE,
    uses_mosquito_coil  BOOLEAN DEFAULT FALSE,
    has_smoking_member  BOOLEAN DEFAULT FALSE,
    budget_rupees       INT UNSIGNED DEFAULT 0,
    has_children        BOOLEAN DEFAULT FALSE,
    has_seniors         BOOLEAN DEFAULT FALSE,
    additional_notes    TEXT,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    CONSTRAINT fk_ia_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    type        ENUM('AQI_ALERT','FAMILY_ALERT','MORNING_BRIEFING','INDOOR_TIP','CHALLENGE_UPDATE','SYSTEM') NOT NULL,
    title       VARCHAR(200) NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    action_url  VARCHAR(500),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at     DATETIME,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created (created_at),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- user_preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS user_preferences (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL,
    timezone            VARCHAR(50) DEFAULT 'Asia/Kolkata',
    aqi_alert_threshold INT DEFAULT 200,
    morning_briefing    BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    push_notifications  BOOLEAN DEFAULT TRUE,
    dark_mode           BOOLEAN DEFAULT FALSE,
    language            VARCHAR(10) DEFAULT 'en',
    UNIQUE KEY uk_user (user_id),
    CONSTRAINT fk_pref_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- chat_sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    title       VARCHAR(200),
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id, last_active),
    CONSTRAINT fk_cs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- chat_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id  BIGINT UNSIGNED NOT NULL,
    role        ENUM('USER', 'ASSISTANT') NOT NULL,
    content     TEXT NOT NULL,
    tokens_used INT UNSIGNED,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_time (session_id, created_at),
    CONSTRAINT fk_cm_session FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- clean_air_challenges
-- ============================================================
CREATE TABLE IF NOT EXISTS clean_air_challenges (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    category        ENUM('TRANSPORT','HOME','HEALTH','COMMUNITY') NOT NULL,
    duration_days   TINYINT UNSIGNED NOT NULL DEFAULT 7,
    points_reward   INT UNSIGNED DEFAULT 10,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- challenge_participants
-- ============================================================
CREATE TABLE IF NOT EXISTS challenge_participants (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    challenge_id    INT UNSIGNED NOT NULL,
    start_date      DATE NOT NULL,
    end_date        DATE,
    days_completed  TINYINT UNSIGNED DEFAULT 0,
    is_completed    BOOLEAN DEFAULT FALSE,
    completed_at    DATETIME,
    points_earned   INT UNSIGNED DEFAULT 0,
    joined_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_challenge (user_id, challenge_id),
    INDEX idx_user (user_id),
    CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cp_challenge FOREIGN KEY (challenge_id) REFERENCES clean_air_challenges(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- reported_incidents
-- ============================================================
CREATE TABLE IF NOT EXISTS reported_incidents (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    incident_type   ENUM('BURNING','CONSTRUCTION_DUST','INDUSTRIAL','VEHICLE','OTHER') NOT NULL,
    description     VARCHAR(500),
    latitude        DECIMAL(9,6) NOT NULL,
    longitude       DECIMAL(9,6) NOT NULL,
    area_name       VARCHAR(150),
    status          ENUM('PENDING','REVIEWED','DISMISSED') DEFAULT 'PENDING',
    reported_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (latitude, longitude),
    INDEX idx_reported_at (reported_at),
    CONSTRAINT fk_ri_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
