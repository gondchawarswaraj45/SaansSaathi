package com.saanssaathi.app;

import com.saanssaathi.app.model.entity.City;
import com.saanssaathi.app.model.entity.CleanAirChallenge;
import com.saanssaathi.app.model.entity.Pollutant;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@DisplayName("SQLite Database Engine Integration Test")
class SqliteDatabaseIntegrationTest {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PollutantRepository pollutantRepository;

    @Autowired
    private CleanAirChallengeRepository challengeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MonitoringStationRepository stationRepository;

    @Autowired
    private AqiReadingRepository aqiReadingRepository;

    @Test
    @DisplayName("Should successfully connect to SQLite and verify auto-seeded baseline data")
    void shouldVerifySqliteBaselineDataSeeded() {
        // Verify cities populated
        long cityCount = cityRepository.count();
        assertThat(cityCount).isGreaterThanOrEqualTo(30);

        Optional<City> delhi = cityRepository.findByNameIgnoreCase("Delhi");
        assertThat(delhi).isPresent();
        assertThat(delhi.get().getState()).isEqualTo("Delhi");

        // Verify criteria pollutants
        long pollutantCount = pollutantRepository.count();
        assertThat(pollutantCount).isGreaterThanOrEqualTo(8);

        Optional<Pollutant> pm25 = pollutantRepository.findByCodeIgnoreCase("PM25");
        assertThat(pm25).isPresent();
        assertThat(pm25.get().getName()).isEqualTo("PM2.5");

        // Verify gamification challenges
        long challengeCount = challengeRepository.count();
        assertThat(challengeCount).isGreaterThanOrEqualTo(10);

        // Verify default users
        Optional<User> admin = userRepository.findByEmail("admin@saanssaathi.org");
        assertThat(admin).isPresent();
        assertThat(admin.get().getRole()).isEqualTo(User.Role.ADMIN);

        Optional<User> demo = userRepository.findByEmail("demo@saanssaathi.org");
        assertThat(demo).isPresent();
        assertThat(demo.get().getRole()).isEqualTo(User.Role.USER);

        // Verify monitoring stations
        long stationCount = stationRepository.count();
        assertThat(stationCount).isGreaterThanOrEqualTo(1);

        // Verify live AQI readings
        long readingCount = aqiReadingRepository.count();
        assertThat(readingCount).isGreaterThanOrEqualTo(1);
    }
}
