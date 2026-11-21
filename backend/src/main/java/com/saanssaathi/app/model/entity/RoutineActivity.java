package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "routine_activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "routine_id", nullable = false)
    private DailyRoutine routine;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_member_id")
    private FamilyMember familyMember;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "activity_name", nullable = false, length = 200)
    private String activityName;

    @Column(name = "original_activity", length = 200)
    private String originalActivity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String recommendation;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ActivityType type = ActivityType.INDOOR;

    @Enumerated(EnumType.STRING)
    @Column(name = "risk_level", length = 20)
    @Builder.Default
    private RiskLevel riskLevel = RiskLevel.LOW;

    @Column(name = "is_completed", nullable = false)
    @Builder.Default
    private Boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum ActivityType {
        OUTDOOR,
        INDOOR,
        TRAVEL,
        EXERCISE,
        WORK
    }

    public enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH
    }
}
