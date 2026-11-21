package com.saanssaathi.app.config;

import com.saanssaathi.app.model.entity.*;
import com.saanssaathi.app.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * DataInitializer seeds fundamental baseline entities into SQLite upon startup if empty:
 * - 30 Top Indian Cities
 * - 8 Standard Pollutants with CPCB / WHO limits
 * - 10 Clean Air Challenges
 * - Sample Urban Monitoring Stations & Live Telemetry Readings
 * - Default Admin and Demo Users
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final PollutantRepository pollutantRepository;
    private final CleanAirChallengeRepository cleanAirChallengeRepository;
    private final MonitoringStationRepository monitoringStationRepository;
    private final AqiReadingRepository aqiReadingRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Checking SQLite database baseline seed data...");
        seedCities();
        seedPollutants();
        seedChallenges();
        seedUsers();
        seedStationsAndReadings();
        log.info("SQLite baseline data verification completed.");
    }

    private void seedCities() {
        if (cityRepository.count() > 0) return;

        List<City> cities = Arrays.asList(
                City.builder().name("Delhi").state("Delhi").latitude(28.6139).longitude(77.2090).build(),
                City.builder().name("Mumbai").state("Maharashtra").latitude(19.0760).longitude(72.8777).build(),
                City.builder().name("Bangalore").state("Karnataka").latitude(12.9716).longitude(77.5946).build(),
                City.builder().name("Hyderabad").state("Telangana").latitude(17.3850).longitude(78.4867).build(),
                City.builder().name("Ahmedabad").state("Gujarat").latitude(23.0225).longitude(72.5714).build(),
                City.builder().name("Chennai").state("Tamil Nadu").latitude(13.0827).longitude(80.2707).build(),
                City.builder().name("Kolkata").state("West Bengal").latitude(22.5726).longitude(88.3639).build(),
                City.builder().name("Pune").state("Maharashtra").latitude(18.5204).longitude(73.8567).build(),
                City.builder().name("Jaipur").state("Rajasthan").latitude(26.9124).longitude(75.7873).build(),
                City.builder().name("Lucknow").state("Uttar Pradesh").latitude(26.8467).longitude(80.9462).build(),
                City.builder().name("Kanpur").state("Uttar Pradesh").latitude(26.4499).longitude(80.3319).build(),
                City.builder().name("Nagpur").state("Maharashtra").latitude(21.1458).longitude(79.0882).build(),
                City.builder().name("Indore").state("Madhya Pradesh").latitude(22.7196).longitude(75.8577).build(),
                City.builder().name("Bhopal").state("Madhya Pradesh").latitude(23.2599).longitude(77.4126).build(),
                City.builder().name("Patna").state("Bihar").latitude(25.5941).longitude(85.1376).build(),
                City.builder().name("Agra").state("Uttar Pradesh").latitude(27.1767).longitude(78.0081).build(),
                City.builder().name("Varanasi").state("Uttar Pradesh").latitude(25.3176).longitude(82.9739).build(),
                City.builder().name("Meerut").state("Uttar Pradesh").latitude(28.9845).longitude(77.7064).build(),
                City.builder().name("Gurgaon").state("Haryana").latitude(28.4595).longitude(77.0266).build(),
                City.builder().name("Noida").state("Uttar Pradesh").latitude(28.5355).longitude(77.3910).build(),
                City.builder().name("Faridabad").state("Haryana").latitude(28.4089).longitude(77.3178).build(),
                City.builder().name("Ghaziabad").state("Uttar Pradesh").latitude(28.6692).longitude(77.4538).build(),
                City.builder().name("Surat").state("Gujarat").latitude(21.1702).longitude(72.8311).build(),
                City.builder().name("Coimbatore").state("Tamil Nadu").latitude(11.0168).longitude(76.9558).build(),
                City.builder().name("Visakhapatnam").state("Andhra Pradesh").latitude(17.6868).longitude(83.2185).build(),
                City.builder().name("Thane").state("Maharashtra").latitude(19.2183).longitude(72.9781).build(),
                City.builder().name("Pimpri-Chinchwad").state("Maharashtra").latitude(18.6279).longitude(73.7998).build(),
                City.builder().name("Bhubaneswar").state("Odisha").latitude(20.2961).longitude(85.8245).build(),
                City.builder().name("Kochi").state("Kerala").latitude(9.9312).longitude(76.2673).build(),
                City.builder().name("Chandigarh").state("Chandigarh").latitude(30.7333).longitude(76.7794).build()
        );

        cityRepository.saveAll(cities);
        log.info("Seeded {} Indian cities into database.", cities.size());
    }

    private void seedPollutants() {
        if (pollutantRepository.count() > 0) return;

        List<Pollutant> pollutants = Arrays.asList(
                Pollutant.builder().code("PM25").name("PM2.5").fullName("Particulate Matter 2.5 micrometers")
                        .unit("µg/m³").cpcbSafeLimit(BigDecimal.valueOf(60.0)).whoGuideline(BigDecimal.valueOf(15.0))
                        .description("Fine particles <2.5µm that penetrate deep into lungs and bloodstream. Primary health concern in winter smog.").build(),
                Pollutant.builder().code("PM10").name("PM10").fullName("Particulate Matter 10 micrometers")
                        .unit("µg/m³").cpcbSafeLimit(BigDecimal.valueOf(100.0)).whoGuideline(BigDecimal.valueOf(45.0))
                        .description("Inhalable coarse particles <10µm. Includes dust, pollen, mold.").build(),
                Pollutant.builder().code("NO2").name("NO2").fullName("Nitrogen Dioxide")
                        .unit("µg/m³").cpcbSafeLimit(BigDecimal.valueOf(80.0)).whoGuideline(BigDecimal.valueOf(25.0))
                        .description("Gas from vehicle exhaust and combustion. Irritates respiratory airways.").build(),
                Pollutant.builder().code("SO2").name("SO2").fullName("Sulphur Dioxide")
                        .unit("µg/m³").cpcbSafeLimit(BigDecimal.valueOf(80.0)).whoGuideline(BigDecimal.valueOf(40.0))
                        .description("From coal and industrial fuel combustion.").build(),
                Pollutant.builder().code("CO").name("CO").fullName("Carbon Monoxide")
                        .unit("mg/m³").cpcbSafeLimit(BigDecimal.valueOf(2.0)).whoGuideline(BigDecimal.valueOf(4.0))
                        .description("Colorless, odorless gas from incomplete combustion.").build(),
                Pollutant.builder().code("O3").name("O3").fullName("Ground-level Ozone")
                        .unit("µg/m³").cpcbSafeLimit(BigDecimal.valueOf(180.0)).whoGuideline(BigDecimal.valueOf(100.0))
                        .description("Secondary photochemical pollutant formed from NOx + sunlight.").build(),
                Pollutant.builder().code("NH3").name("NH3").fullName("Ammonia")
                        .unit("µg/m³").cpcbSafeLimit(BigDecimal.valueOf(400.0)).whoGuideline(null)
                        .description("From agricultural activities and waste.").build(),
                Pollutant.builder().code("Pb").name("Pb").fullName("Lead")
                        .unit("µg/m³").cpcbSafeLimit(BigDecimal.valueOf(0.5)).whoGuideline(null)
                        .description("Toxic heavy metal from industrial emissions.").build()
        );

        pollutantRepository.saveAll(pollutants);
        log.info("Seeded {} criteria pollutants into database.", pollutants.size());
    }

    private void seedChallenges() {
        if (cleanAirChallengeRepository.count() > 0) return;

        List<CleanAirChallenge> challenges = Arrays.asList(
                CleanAirChallenge.builder()
                        .title("7-Day Public Transport Challenge")
                        .description("Use public transport (bus, metro, suburban rail) instead of private vehicle for all trips this week.")
                        .category(CleanAirChallenge.ChallengeCategory.TRANSPORT)
                        .durationDays(7).pointsReward(15).build(),
                CleanAirChallenge.builder()
                        .title("No Car Idling Week")
                        .description("Turn off your engine whenever waiting more than 30 seconds at traffic signals or pick-up points.")
                        .category(CleanAirChallenge.ChallengeCategory.TRANSPORT)
                        .durationDays(7).pointsReward(10).build(),
                CleanAirChallenge.builder()
                        .title("14-Day Carpool Challenge")
                        .description("Share your commute with colleagues or neighbours to take vehicles off congested winter roads.")
                        .category(CleanAirChallenge.ChallengeCategory.TRANSPORT)
                        .durationDays(14).pointsReward(25).build(),
                CleanAirChallenge.builder()
                        .title("Smoke-Free Home Week")
                        .description("Eliminate indoor combustion: zero incense sticks, dhoop, or mosquito coils for 7 days.")
                        .category(CleanAirChallenge.ChallengeCategory.HOME)
                        .durationDays(7).pointsReward(15).build(),
                CleanAirChallenge.builder()
                        .title("Damp Mop Challenge")
                        .description("Replace dry broom sweeping with wet microfiber mopping to avoid resuspending toxic floor dust.")
                        .category(CleanAirChallenge.ChallengeCategory.HOME)
                        .durationDays(7).pointsReward(10).build(),
                CleanAirChallenge.builder()
                        .title("Air Filter Inspection Day")
                        .description("Inspect, vacuum or replace dirty AC, HEPA, and kitchen chimney mesh filters.")
                        .category(CleanAirChallenge.ChallengeCategory.HOME)
                        .durationDays(1).pointsReward(5).build(),
                CleanAirChallenge.builder()
                        .title("Indoor Cardio Week")
                        .description("Shift morning outdoor jogs and workouts indoors when the local AQI is above 150.")
                        .category(CleanAirChallenge.ChallengeCategory.HEALTH)
                        .durationDays(7).pointsReward(10).build(),
                CleanAirChallenge.builder()
                        .title("Commute Mask Up Habit")
                        .description("Consistently wear a well-fitted certified N95 / FFP2 respirator during high-exposure transit.")
                        .category(CleanAirChallenge.ChallengeCategory.HEALTH)
                        .durationDays(7).pointsReward(15).build(),
                CleanAirChallenge.builder()
                        .title("Clean Air Ambassador")
                        .description("Help 3 vulnerable neighbours or relatives set up a Clean Air Room and register on SaansSaathi.")
                        .category(CleanAirChallenge.ChallengeCategory.COMMUNITY)
                        .durationDays(14).pointsReward(30).build(),
                CleanAirChallenge.builder()
                        .title("Smog Inversion Evader")
                        .description("Reschedule all high-exertion outdoor activities to the 12:30 PM - 3:30 PM boundary layer opening window.")
                        .category(CleanAirChallenge.ChallengeCategory.HEALTH)
                        .durationDays(7).pointsReward(20).build()
        );

        cleanAirChallengeRepository.saveAll(challenges);
        log.info("Seeded {} clean-air gamification challenges.", challenges.size());
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@saanssaathi.org")) {
            User admin = User.builder()
                    .email("admin@saanssaathi.org")
                    .fullName("SaansSaathi Administrator")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .role(User.Role.ADMIN)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(admin);
            log.info("Created default system administrator: admin@saanssaathi.org");
        }

        if (!userRepository.existsByEmail("demo@saanssaathi.org")) {
            User demo = User.builder()
                    .email("demo@saanssaathi.org")
                    .fullName("Rahul Sharma")
                    .passwordHash(passwordEncoder.encode("Demo@123"))
                    .role(User.Role.USER)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(demo);
            log.info("Created default demo user: demo@saanssaathi.org");
        }
    }

    private void seedStationsAndReadings() {
        if (monitoringStationRepository.count() > 0) return;

        City delhi = cityRepository.findByNameIgnoreCase("Delhi").orElse(null);
        City mumbai = cityRepository.findByNameIgnoreCase("Mumbai").orElse(null);
        City pune = cityRepository.findByNameIgnoreCase("Pune").orElse(null);

        if (delhi != null) {
            MonitoringStation anandVihar = monitoringStationRepository.save(MonitoringStation.builder()
                    .name("Anand Vihar, Delhi - DPCC")
                    .areaName("Anand Vihar")
                    .city(delhi)
                    .latitude(28.6476)
                    .longitude(77.3158)
                    .provider("CPCB / DPCC")
                    .openaqId("DEL-AV-01")
                    .isActive(true)
                    .build());

            aqiReadingRepository.save(AqiReading.builder()
                    .station(anandVihar)
                    .aqiValue(342)
                    .aqiCategory(AqiReading.Category.VERY_POOR)
                    .dominantPollutant("PM2.5")
                    .source("CPCB_STATION")
                    .measuredAt(LocalDateTime.now().minusMinutes(15))
                    .build());

            MonitoringStation rkPuram = monitoringStationRepository.save(MonitoringStation.builder()
                    .name("R K Puram, Delhi - DPCC")
                    .areaName("R K Puram")
                    .city(delhi)
                    .latitude(28.5632)
                    .longitude(77.1869)
                    .provider("CPCB / DPCC")
                    .openaqId("DEL-RKP-02")
                    .isActive(true)
                    .build());

            aqiReadingRepository.save(AqiReading.builder()
                    .station(rkPuram)
                    .aqiValue(285)
                    .aqiCategory(AqiReading.Category.POOR)
                    .dominantPollutant("PM2.5")
                    .source("CPCB_STATION")
                    .measuredAt(LocalDateTime.now().minusMinutes(20))
                    .build());
        }

        if (mumbai != null) {
            MonitoringStation bandra = monitoringStationRepository.save(MonitoringStation.builder()
                    .name("Bandra, Mumbai - MPCB")
                    .areaName("Bandra")
                    .city(mumbai)
                    .latitude(19.0596)
                    .longitude(72.8295)
                    .provider("CPCB / MPCB")
                    .openaqId("MUM-BAN-01")
                    .isActive(true)
                    .build());

            aqiReadingRepository.save(AqiReading.builder()
                    .station(bandra)
                    .aqiValue(162)
                    .aqiCategory(AqiReading.Category.MODERATE)
                    .dominantPollutant("PM10")
                    .source("CPCB_STATION")
                    .measuredAt(LocalDateTime.now().minusMinutes(25))
                    .build());
        }

        if (pune != null) {
            MonitoringStation shivajinagar = monitoringStationRepository.save(MonitoringStation.builder()
                    .name("Shivajinagar, Pune - IITM SAFAR")
                    .areaName("Shivajinagar")
                    .city(pune)
                    .latitude(18.5314)
                    .longitude(73.8446)
                    .provider("SAFAR / CPCB")
                    .openaqId("PUN-SHV-01")
                    .isActive(true)
                    .build());

            aqiReadingRepository.save(AqiReading.builder()
                    .station(shivajinagar)
                    .aqiValue(145)
                    .aqiCategory(AqiReading.Category.MODERATE)
                    .dominantPollutant("PM2.5")
                    .source("SAFAR_STATION")
                    .measuredAt(LocalDateTime.now().minusMinutes(10))
                    .build());
        }

        log.info("Seeded initial monitoring stations and CPCB live telemetry records.");
    }
}
