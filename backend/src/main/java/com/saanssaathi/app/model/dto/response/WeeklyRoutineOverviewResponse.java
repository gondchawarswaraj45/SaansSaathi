package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyRoutineOverviewResponse {

    private LocalDate startDate;
    private LocalDate endDate;
    private Integer overallComplianceScore;
    private Integer averageAqi;
    private Integer totalActivitiesCompleted;
    private List<DailySummary> days;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailySummary {
        private LocalDate date;
        private String dayOfWeek;
        private Integer aqi;
        private String aqiCategory;
        private Integer totalActivities;
        private Integer completedActivities;
        private Integer compliancePercentage;
    }
}
