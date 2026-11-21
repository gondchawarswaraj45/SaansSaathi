package com.saanssaathi.app.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineActivityRequest {

    private Long familyMemberId;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Activity name is required")
    private String activityName;

    private String originalActivity;
    private String recommendation;
    private String reason;
    private String type; // OUTDOOR, INDOOR, TRAVEL, EXERCISE, WORK
    private String riskLevel; // LOW, MEDIUM, HIGH
}
