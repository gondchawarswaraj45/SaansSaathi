package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoutineActivityResponse {

    private Long id;
    private Long routineId;
    private Long familyMemberId;
    private String familyMemberName;
    private LocalTime startTime;
    private LocalTime endTime;
    private String timeSlotFormatted;
    private String activityName;
    private String originalActivity;
    private String recommendation;
    private String reason;
    private String type;
    private String riskLevel;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
}
