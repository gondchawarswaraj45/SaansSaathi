package com.saanssaathi.app.model.dto.response;

import com.saanssaathi.app.model.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private Notification.NotificationType type;
    private String title;
    private String message;
    private Boolean isRead;
    private String actionUrl;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
