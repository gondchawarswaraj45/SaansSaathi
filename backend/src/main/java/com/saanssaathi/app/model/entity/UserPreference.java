package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 50)
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    @Column(name = "aqi_alert_threshold")
    @Builder.Default
    private Integer aqiAlertThreshold = 200;

    @Column(name = "morning_briefing")
    @Builder.Default
    private Boolean morningBriefing = true;

    @Column(name = "email_notifications")
    @Builder.Default
    private Boolean emailNotifications = false;

    @Column(name = "push_notifications")
    @Builder.Default
    private Boolean pushNotifications = true;

    @Column(name = "dark_mode")
    @Builder.Default
    private Boolean darkMode = false;

    @Column(length = 10)
    @Builder.Default
    private String language = "en";
}
