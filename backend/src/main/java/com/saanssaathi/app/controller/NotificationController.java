package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.UserPreferenceRequest;
import com.saanssaathi.app.model.dto.response.NotificationResponse;
import com.saanssaathi.app.model.dto.response.UserPreferenceResponse;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications & Alerts System", description = "AQI threshold alerts, morning briefings, unread badges, and user notification preferences")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get paginated notifications for current user")
    public ResponseEntity<ApiResponse<Page<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Long userId = user != null ? user.getId() : 1L;
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationResponse> response = notificationService.getUserNotifications(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(response, "Notifications retrieved"));
    }

    @GetMapping("/recent")
    @Operation(summary = "Get recent unread notifications for bell dropdown")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getRecentUnread(
            @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        List<NotificationResponse> response = notificationService.getRecentUnreadNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Recent unread notifications retrieved"));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications for bell badge")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.success(count, "Unread notification count"));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        Long userId = user != null ? user.getId() : 1L;
        NotificationResponse response = notificationService.markAsRead(userId, id);
        return ResponseEntity.ok(ApiResponse.success(response, "Notification marked as read"));
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications marked as read"));
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get user alert and notification preferences")
    public ResponseEntity<ApiResponse<UserPreferenceResponse>> getPreferences(@AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        UserPreferenceResponse response = notificationService.getUserPreferences(userId);
        return ResponseEntity.ok(ApiResponse.success(response, "Notification preferences retrieved"));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update user alert and notification preferences")
    public ResponseEntity<ApiResponse<UserPreferenceResponse>> updatePreferences(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UserPreferenceRequest request) {
        Long userId = user != null ? user.getId() : 1L;
        UserPreferenceResponse response = notificationService.updateUserPreferences(userId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Preferences updated successfully"));
    }

    @PostMapping("/test-alert")
    @Operation(summary = "Trigger a simulated high AQI alert for demonstration")
    public ResponseEntity<ApiResponse<NotificationResponse>> triggerTestAlert(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "320") int aqi,
            @RequestParam(defaultValue = "Delhi / Anand Vihar") String location) {
        Long userId = user != null ? user.getId() : 1L;
        NotificationResponse response = notificationService.createAqiAlert(userId, aqi, 200, location);
        return ResponseEntity.ok(ApiResponse.success(response, "Test AQI alert created"));
    }
}
