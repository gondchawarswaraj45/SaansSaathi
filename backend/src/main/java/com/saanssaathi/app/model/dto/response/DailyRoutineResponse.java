package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyRoutineResponse {

    private Long id;
    private Long userId;
    private LocalDate routineDate;
    private LocalDateTime generatedAt;
    private Integer aqiAtGen;
    private String aqiCategory;
    private Boolean isCustom;
    private String bestOutdoorWindow;
    private Integer completedActivitiesCount;
    private Integer totalActivitiesCount;
    private Integer compliancePercentage;
    private List<RoutineActivityResponse> activities;
}
