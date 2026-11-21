package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalFamilyMembers;
    private long totalIndoorAssessments;
    private long totalMonitoringStations;
    private long totalCitiesCovered;
    private long totalChallenges;
    private double systemUptimeHours;
}
