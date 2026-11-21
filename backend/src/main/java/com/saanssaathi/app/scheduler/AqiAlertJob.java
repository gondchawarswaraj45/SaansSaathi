package com.saanssaathi.app.scheduler;

import com.saanssaathi.app.model.entity.AqiReading;
import com.saanssaathi.app.model.entity.MonitoringStation;
import com.saanssaathi.app.model.entity.Notification;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.model.entity.UserLocation;
import com.saanssaathi.app.model.entity.UserPreference;
import com.saanssaathi.app.repository.AqiReadingRepository;
import com.saanssaathi.app.repository.MonitoringStationRepository;
import com.saanssaathi.app.repository.NotificationRepository;
import com.saanssaathi.app.repository.UserLocationRepository;
import com.saanssaathi.app.repository.UserPreferenceRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class AqiAlertJob {

    private final UserRepository userRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserLocationRepository userLocationRepository;
    private final MonitoringStationRepository monitoringStationRepository;
    private final AqiReadingRepository aqiReadingRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    /**
     * Checks air quality threshold breaches every 30 minutes.
     * Throttled to avoid duplicate alerts within 2 hours.
     */
    @Scheduled(fixedRate = 1800000, initialDelay = 60000)
    public void checkAqiThresholds() {
        log.info("Running AQI Threshold Alert Job...");
        try {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                if (!user.isActive()) continue;

                UserPreference pref = userPreferenceRepository.findByUserId(user.getId())
                        .orElse(null);

                int threshold = (pref != null && pref.getAqiAlertThreshold() != null)
                        ? pref.getAqiAlertThreshold()
                        : 200;

                // Check primary location or city
                Optional<UserLocation> primaryLoc = userLocationRepository.findByUserIdAndIsPrimaryTrue(user.getId());
                Integer cityId = primaryLoc.map(loc -> loc.getCity() != null ? loc.getCity().getId().intValue() : 1).orElse(1);
                String locationName = primaryLoc.map(UserLocation::getName).orElse("Your City Area");

                List<MonitoringStation> stations = monitoringStationRepository.findByCityId(cityId);
                if (stations.isEmpty()) {
                    stations = monitoringStationRepository.findByIsActiveTrue();
                }

                if (!stations.isEmpty()) {
                    MonitoringStation station = stations.get(0);
                    Optional<AqiReading> latestReading = aqiReadingRepository.findTopByStationIdOrderByMeasuredAtDesc(station.getId());
                    if (latestReading.isPresent()) {
                        int currentAqi = latestReading.get().getAqiValue();
                        if (currentAqi >= threshold) {
                            // Check last alert time within 2 hours
                            Optional<Notification> lastAlert = notificationRepository.findTop1ByUserIdAndTypeOrderByCreatedAtDesc(
                                    user.getId(), Notification.NotificationType.AQI_ALERT);

                            boolean isRecent = lastAlert.isPresent() &&
                                    lastAlert.get().getCreatedAt() != null &&
                                    lastAlert.get().getCreatedAt().isAfter(LocalDateTime.now().minusHours(2));

                            if (!isRecent) {
                                notificationService.createAqiAlert(user.getId(), currentAqi, threshold, locationName);
                                log.info("Triggered AQI threshold alert for user {} at location {} (AQI: {})", user.getId(), locationName, currentAqi);
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Error in AqiAlertJob checkAqiThresholds: {}", e.getMessage(), e);
        }
    }

    /**
     * Sends daily morning briefings at 7:00 AM IST.
     */
    @Scheduled(cron = "0 0 7 * * ?", zone = "Asia/Kolkata")
    public void sendMorningBriefings() {
        log.info("Running Morning Air Quality Briefing Job...");
        try {
            List<User> users = userRepository.findAll();
            for (User user : users) {
                if (!user.isActive()) continue;

                UserPreference pref = userPreferenceRepository.findByUserId(user.getId()).orElse(null);
                if (pref != null && Boolean.FALSE.equals(pref.getMorningBriefing())) {
                    continue;
                }

                // Default estimated morning AQI & best window
                int morningAqi = 245;
                String bestWindow = "1:00 PM – 3:30 PM (Post-inversion dispersion)";

                notificationService.createMorningBriefing(user.getId(), morningAqi, bestWindow);
                log.info("Sent morning briefing to user {}", user.getId());
            }
        } catch (Exception e) {
            log.error("Error in sendMorningBriefings: {}", e.getMessage(), e);
        }
    }
}
