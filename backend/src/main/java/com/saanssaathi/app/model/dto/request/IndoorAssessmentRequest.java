package com.saanssaathi.app.model.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndoorAssessmentRequest {

    @Min(value = 1, message = "Room count must be at least 1")
    @Builder.Default
    private Integer roomCount = 2;

    @Min(value = 0, message = "Window count cannot be negative")
    @Builder.Default
    private Integer windowCount = 4;

    @Builder.Default
    private Integer floorNumber = 1;

    @Builder.Default
    private Integer totalFloors = 4;

    @Builder.Default
    private Boolean hasAirPurifier = false;

    @Builder.Default
    private Boolean hasExhaustFan = false;

    @Builder.Default
    private Boolean hasChimney = false;

    @Builder.Default
    private String cookingFuel = "LPG";

    @Builder.Default
    private Boolean usesIncense = false;

    @Builder.Default
    private Boolean usesMosquitoCoil = false;

    @Builder.Default
    private Boolean hasSmokingMember = false;

    @Builder.Default
    private Integer budgetRupees = 0;

    @Builder.Default
    private Boolean hasChildren = false;

    @Builder.Default
    private Boolean hasSeniors = false;

    private String additionalNotes;
}
