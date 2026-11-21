package com.saanssaathi.app.service.impl;

import com.saanssaathi.app.exception.ResourceNotFoundException;
import com.saanssaathi.app.model.dto.request.UserPreferenceRequest;
import com.saanssaathi.app.model.dto.response.NotificationResponse;
import com.saanssaathi.app.model.dto.response.UserPreferenceResponse;
import com.saanssaathi.app.model.entity.AqiReading;
import com.saanssaathi.app.model.entity.Notification;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.model.entity.UserPreference;
import com.saanssaathi.app.repository.NotificationRepository;
import com.saanssaathi.app.repository.UserPreferenceRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.service.AqiCalculationService;
import com.saanssaathi.app.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserPreferenceRepository userPreferenceRepository;
    private final UserRepository userRepository;
    private final AqiCalculationService aqiCalculationService;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getRecentUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .limit(10)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized to modify this notification");
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        LocalDateTime now = LocalDateTime.now();
        unread.forEach(n -> {
            n.setIsRead(true);
            n.setReadAt(now);
        });
        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public UserPreferenceResponse getUserPreferences(Long userId) {
        UserPreference pref = userPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreference(userId));
        return mapToPreferenceResponse(pref);
    }

    @Override
    @Transactional
    public UserPreferenceResponse updateUserPreferences(Long userId, UserPreferenceRequest request) {
        UserPreference pref = userPreferenceRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreference(userId));

        if (request.getTimezone() != null) pref.setTimezone(request.getTimezone());
        if (request.getAqiAlertThreshold() != null) pref.setAqiAlertThreshold(request.getAqiAlertThreshold());
        if (request.getMorningBriefing() != null) pref.setMorningBriefing(request.getMorningBriefing());
        if (request.getEmailNotifications() != null) pref.setEmailNotifications(request.getEmailNotifications());
        if (request.getPushNotifications() != null) pref.setPushNotifications(request.getPushNotifications());
        if (request.getDarkMode() != null) pref.setDarkMode(request.getDarkMode());
        if (request.getLanguage() != null) pref.setLanguage(request.getLanguage());

        UserPreference saved = userPreferenceRepository.save(pref);
        return mapToPreferenceResponse(saved);
    }

    @Override
    @Transactional
    public NotificationResponse createAqiAlert(Long userId, Integer currentAqi, Integer threshold, String locationName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        AqiReading.Category category = aqiCalculationService.getCategory(currentAqi);
        String categoryName = formatCategoryName(category);
        String recommendation = getCategoryRecommendation(category);

        String title = String.format("🚨 AQI Alert: %s reached %d (%s)", locationName, currentAqi, categoryName);
        String message = String.format("Current air quality in %s has crossed your alert threshold of %d. Category: %s. %s",
                locationName, threshold, categoryName, recommendation);

        Notification notification = Notification.builder()
                .user(user)
                .type(Notification.NotificationType.AQI_ALERT)
                .title(title)
                .message(message)
                .isRead(false)
                .actionUrl("/dashboard")
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Created AQI alert for user {}: {}", userId, title);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public NotificationResponse createFamilyAlert(Long userId, String memberName, String precaution) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String title = "🛡️ Family Alert: Health Advisory for " + memberName;
        String message = precaution;

        Notification notification = Notification.builder()
                .user(user)
                .type(Notification.NotificationType.FAMILY_ALERT)
                .title(title)
                .message(message)
                .isRead(false)
                .actionUrl("/family")
                .build();

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public NotificationResponse createMorningBriefing(Long userId, Integer aqi, String bestWindow) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        AqiReading.Category category = aqiCalculationService.getCategory(aqi);
        String categoryName = formatCategoryName(category);

        String title = "☀️ Morning Air Quality Briefing";
        String message = String.format("Today's morning AQI is %d (%s). Best window for outdoor ventilation/exercise is %s. Stay protected against winter inversion smog.",
                aqi, categoryName, bestWindow);

        Notification notification = Notification.builder()
                .user(user)
                .type(Notification.NotificationType.MORNING_BRIEFING)
                .title(title)
                .message(message)
                .isRead(false)
                .actionUrl("/planner")
                .build();

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public NotificationResponse createSystemNotification(Long userId, String title, String message, String actionUrl, Notification.NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Notification notification = Notification.builder()
                .user(user)
                .type(type != null ? type : Notification.NotificationType.SYSTEM)
                .title(title)
                .message(message)
                .isRead(false)
                .actionUrl(actionUrl != null ? actionUrl : "/dashboard")
                .build();

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    private String formatCategoryName(AqiReading.Category category) {
        if (category == null) return "Moderate";
        switch (category) {
            case GOOD: return "Good";
            case SATISFACTORY: return "Satisfactory";
            case MODERATE: return "Moderate";
            case POOR: return "Poor";
            case VERY_POOR: return "Very Poor";
            case SEVERE: return "Severe";
            default: return category.name();
        }
    }

    private String getCategoryRecommendation(AqiReading.Category category) {
        if (category == null) return "Keep windows closed during early morning peak smog.";
        switch (category) {
            case GOOD:
                return "Air quality is ideal for all outdoor activities and natural home ventilation.";
            case SATISFACTORY:
                return "Minor breathing discomfort to sensitive individuals; normal outdoor routines can continue.";
            case MODERATE:
                return "Breathing discomfort possible for children, seniors, and people with respiratory or heart conditions.";
            case POOR:
                return "Avoid morning outdoor cardio. Shift workouts indoors and prepare air purifiers.";
            case VERY_POOR:
                return "Respiratory illness possible on prolonged exposure. Wear N95 masks outdoors and keep windows closed.";
            case SEVERE:
                return "Emergency conditions. Strongly limit outdoor exposure for all family members. Seal rooms and run HEPA filters.";
            default:
                return "Monitor local AQI levels closely.";
        }
    }

    private UserPreference createDefaultPreference(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserPreference preference = UserPreference.builder()
                .user(user)
                .timezone("Asia/Kolkata")
                .aqiAlertThreshold(200)
                .morningBriefing(true)
                .emailNotifications(false)
                .pushNotifications(true)
                .darkMode(false)
                .language("en")
                .build();

        return userPreferenceRepository.save(preference);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .isRead(n.getIsRead())
                .actionUrl(n.getActionUrl())
                .createdAt(n.getCreatedAt())
                .readAt(n.getReadAt())
                .build();
    }

    private UserPreferenceResponse mapToPreferenceResponse(UserPreference p) {
        return UserPreferenceResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .timezone(p.getTimezone())
                .aqiAlertThreshold(p.getAqiAlertThreshold())
                .morningBriefing(p.getMorningBriefing())
                .emailNotifications(p.getEmailNotifications())
                .pushNotifications(p.getPushNotifications())
                .darkMode(p.getDarkMode())
                .language(p.getLanguage())
                .build();
    }
}
