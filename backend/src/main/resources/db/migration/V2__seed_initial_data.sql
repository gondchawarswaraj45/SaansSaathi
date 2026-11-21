-- ================================================================
-- SaansSaathi - Seed Data Migration
-- V2__seed_initial_data.sql
-- ================================================================
-- Seeds: Top Indian cities, pollutant definitions, challenges
-- ================================================================

-- ============================================================
-- POLLUTANTS
-- ============================================================
INSERT INTO pollutants (code, name, full_name, unit, cpcb_safe_limit, who_guideline, description) VALUES
('PM25', 'PM2.5', 'Particulate Matter 2.5 micrometers', 'µg/m³', 60, 15,
 'Fine particles <2.5µm that penetrate deep into lungs and bloodstream. Primary health concern.'),
('PM10', 'PM10', 'Particulate Matter 10 micrometers', 'µg/m³', 100, 45,
 'Inhalable coarse particles <10µm. Includes dust, pollen, mold.'),
('NO2',  'NO2',  'Nitrogen Dioxide', 'µg/m³', 80, 25,
 'Gas from vehicle exhaust and industrial combustion. Irritates airways.'),
('SO2',  'SO2',  'Sulphur Dioxide', 'µg/m³', 80, 40,
 'From coal/oil combustion. Can cause respiratory problems.'),
('CO',   'CO',   'Carbon Monoxide', 'mg/m³', 2, 4,
 'Colorless, odorless gas from incomplete combustion. Prevents oxygen absorption.'),
('O3',   'O3',   'Ground-level Ozone', 'µg/m³', 180, 100,
 'Secondary pollutant formed from NOx + VOCs + sunlight. Irritates respiratory system.'),
('NH3',  'NH3',  'Ammonia', 'µg/m³', 400, NULL,
 'From agricultural activities. Contributes to secondary particulate formation.'),
('Pb',   'Pb',   'Lead', 'µg/m³', 0.5, NULL,
 'Toxic heavy metal from industrial processes.');

-- ============================================================
-- TOP INDIAN CITIES
-- ============================================================
INSERT INTO cities (name, state, latitude, longitude) VALUES
('Delhi', 'Delhi', 28.6139, 77.2090),
('Mumbai', 'Maharashtra', 19.0760, 72.8777),
('Bangalore', 'Karnataka', 12.9716, 77.5946),
('Hyderabad', 'Telangana', 17.3850, 78.4867),
('Ahmedabad', 'Gujarat', 23.0225, 72.5714),
('Chennai', 'Tamil Nadu', 13.0827, 80.2707),
('Kolkata', 'West Bengal', 22.5726, 88.3639),
('Pune', 'Maharashtra', 18.5204, 73.8567),
('Jaipur', 'Rajasthan', 26.9124, 75.7873),
('Lucknow', 'Uttar Pradesh', 26.8467, 80.9462),
('Kanpur', 'Uttar Pradesh', 26.4499, 80.3319),
('Nagpur', 'Maharashtra', 21.1458, 79.0882),
('Indore', 'Madhya Pradesh', 22.7196, 75.8577),
('Bhopal', 'Madhya Pradesh', 23.2599, 77.4126),
('Patna', 'Bihar', 25.5941, 85.1376),
('Agra', 'Uttar Pradesh', 27.1767, 78.0081),
('Varanasi', 'Uttar Pradesh', 25.3176, 82.9739),
('Meerut', 'Uttar Pradesh', 28.9845, 77.7064),
('Gurgaon', 'Haryana', 28.4595, 77.0266),
('Noida', 'Uttar Pradesh', 28.5355, 77.3910),
('Faridabad', 'Haryana', 28.4089, 77.3178),
('Ghaziabad', 'Uttar Pradesh', 28.6692, 77.4538),
('Surat', 'Gujarat', 21.1702, 72.8311),
('Coimbatore', 'Tamil Nadu', 11.0168, 76.9558),
('Visakhapatnam', 'Andhra Pradesh', 17.6868, 83.2185),
('Thane', 'Maharashtra', 19.2183, 72.9781),
('Pimpri-Chinchwad', 'Maharashtra', 18.6279, 73.7998),
('Bhubaneswar', 'Odisha', 20.2961, 85.8245),
('Kochi', 'Kerala', 9.9312, 76.2673),
('Chandigarh', 'Chandigarh', 30.7333, 76.7794);

-- ============================================================
-- CLEAN AIR CHALLENGES
-- ============================================================
INSERT INTO clean_air_challenges (title, description, category, duration_days, points_reward) VALUES
('7-Day Public Transport Challenge',
 'Use public transport (bus, metro, auto) instead of private vehicle for all trips this week.',
 'TRANSPORT', 7, 15),

('No Car Idling Week',
 'Turn off your engine whenever waiting more than 30 seconds. Idling wastes fuel and pollutes air unnecessarily.',
 'TRANSPORT', 7, 10),

('14-Day Carpool Challenge',
 'Share your ride with at least one colleague or neighbour for your daily commute for 2 weeks.',
 'TRANSPORT', 14, 25),

('Smoke-Free Home Week',
 'Eliminate all indoor smoke sources for 7 days: no incense, no mosquito coils, no indoor burning of any kind.',
 'HOME', 7, 15),

('No Incense Week',
 'Avoid burning incense sticks and dhoop indoors for a week. Try natural alternatives like essential oil diffusers with minimal smoke.',
 'HOME', 7, 10),

('Damp Mop Challenge',
 'Use damp mopping instead of dry sweeping for all floor cleaning this week. Dry sweeping resuspends dust particles.',
 'HOME', 7, 10),

('Air Filter Check Day',
 'Check and clean (or replace if due) all filters in your home today: AC filters, air purifier filters, kitchen exhaust filters.',
 'HOME', 1, 5),

('Indoor Exercise Week',
 'Replace outdoor exercise with indoor alternatives for one week when AQI is above 150. Yoga, home workouts, or gym sessions.',
 'HEALTH', 7, 10),

('Mask Up for Commute',
 'Wear a properly fitted N95/N99 mask for all outdoor commuting activities this week when AQI exceeds 150.',
 'HEALTH', 7, 10),

('Combine Errands Challenge',
 'Plan and combine all your outdoor errands into the minimum possible trips this week to reduce vehicle trips.',
 'TRANSPORT', 7, 10);

-- ============================================================
-- CREATE DEFAULT ADMIN USER (password: Admin@123)
-- BCrypt hash of 'Admin@123' with factor 12
-- ============================================================
-- NOTE: Change this password immediately after first deployment!
INSERT INTO users (email, password_hash, full_name, role, is_verified, is_active) VALUES
('admin@saanssaathi.in',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiJVvMKJGj9fMBPJAQNxLCBEJhPu',
 'SaansSaathi Admin',
 'ADMIN',
 TRUE,
 TRUE);
