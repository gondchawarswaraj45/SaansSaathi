package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "family_members")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_group_id", nullable = false)
    private FamilyGroup familyGroup;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "age_group", nullable = false)
    @Builder.Default
    private AgeGroup ageGroup = AgeGroup.ADULT;

    @Column(name = "birth_year")
    private Integer birthYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "sensitive_category")
    @Builder.Default
    private SensitiveCategory sensitiveCategory = SensitiveCategory.NONE;

    @Column(name = "daily_outdoor_hours")
    @Builder.Default
    private Integer dailyOutdoorHours = 1;

    @Column(name = "work_schedule_start")
    private LocalTime workScheduleStart;

    @Column(name = "work_schedule_end")
    private LocalTime workScheduleEnd;

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_preference")
    @Builder.Default
    private ExercisePreference exercisePreference = ExercisePreference.NONE;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum AgeGroup {
        CHILD,
        ADULT,
        SENIOR
    }

    public enum SensitiveCategory {
        NONE,
        RESPIRATORY,
        CARDIOVASCULAR,
        BOTH
    }

    public enum ExercisePreference {
        OUTDOOR,
        INDOOR,
        NONE
    }
}
