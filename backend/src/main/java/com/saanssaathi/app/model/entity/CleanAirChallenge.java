package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "clean_air_challenges")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CleanAirChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ChallengeCategory category;

    @Column(name = "duration_days", nullable = false)
    @Builder.Default
    private Integer durationDays = 7;

    @Column(name = "points_reward", nullable = false)
    @Builder.Default
    private Integer pointsReward = 10;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ChallengeCategory {
        TRANSPORT,
        HOME,
        HEALTH,
        COMMUNITY
    }
}
