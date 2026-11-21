package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndoorAssessmentResponse {

    private Long id;
    private Long userId;
    private Integer roomCount;
    private Integer windowCount;
    private Integer floorNumber;
    private Integer totalFloors;
    private Boolean hasAirPurifier;
    private Boolean hasExhaustFan;
    private Boolean hasChimney;
    private String cookingFuel;
    private Boolean usesIncense;
    private Boolean usesMosquitoCoil;
    private Boolean hasSmokingMember;
    private Integer budgetRupees;
    private Boolean hasChildren;
    private Boolean hasSeniors;
    private String additionalNotes;
    private LocalDateTime createdAt;

    // Generated recommendations for this assessment
    private List<IndoorRecommendationDTO> recommendations;
    private Integer estimatedIndoorAqiScore; // 0-100 hazard rating
    private String riskLevel; // LOW, MODERATE, HIGH, CRITICAL
}
