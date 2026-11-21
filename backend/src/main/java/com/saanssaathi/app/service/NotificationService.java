package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.request.UserPreferenceRequest;
import com.saanssaathi.app.model.dto.response.NotificationResponse;
import com.saanssaathi.app.model.dto.response.UserPreferenceResponse;
import com.saanssaathi.app.model.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);

    List<NotificationResponse> getRecentUnreadNotifications(Long userId);

    long getUnreadCount(Long userId);

    NotificationResponse markAsRead(Long userId, Long notificationId);

    void markAllAsRead(Long userId);

    UserPreferenceResponse getUserPreferences(Long userId);

    UserPreferenceResponse updateUserPreferences(Long userId, UserPreferenceRequest request);

    NotificationResponse createAqiAlert(Long userId, Integer currentAqi, Integer threshold, String locationName);

    NotificationResponse createFamilyAlert(Long userId, String memberName, String precaution);

    NotificationResponse createMorningBriefing(Long userId, Integer aqi, String bestWindow);

    NotificationResponse createSystemNotification(Long userId, String title, String message, String actionUrl, Notification.NotificationType type);
}
