package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * JPA Entity mapping for the indoor_assessments table
 */
@Entity
@Table(name = "indoor_assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndoorAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "room_count", nullable = false)
    @Builder.Default
    private Integer roomCount = 2;

    @Column(name = "window_count", nullable = false)
    @Builder.Default
    private Integer windowCount = 4;

    @Column(name = "floor_number")
    @Builder.Default
    private Integer floorNumber = 1;

    @Column(name = "total_floors")
    @Builder.Default
    private Integer totalFloors = 4;

    @Column(name = "has_air_purifier")
    @Builder.Default
    private Boolean hasAirPurifier = false;

    @Column(name = "has_exhaust_fan")
    @Builder.Default
    private Boolean hasExhaustFan = false;

    @Column(name = "has_chimney")
    @Builder.Default
    private Boolean hasChimney = false;

    @Column(name = "cooking_fuel", length = 50)
    @Builder.Default
    private String cookingFuel = "LPG";

    @Column(name = "uses_incense")
    @Builder.Default
    private Boolean usesIncense = false;

    @Column(name = "uses_mosquito_coil")
    @Builder.Default
    private Boolean usesMosquitoCoil = false;

    @Column(name = "has_smoking_member")
    @Builder.Default
    private Boolean hasSmokingMember = false;

    @Column(name = "budget_rupees")
    @Builder.Default
    private Integer budgetRupees = 0;

    @Column(name = "has_children")
    @Builder.Default
    private Boolean hasChildren = false;

    @Column(name = "has_seniors")
    @Builder.Default
    private Boolean hasSeniors = false;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
