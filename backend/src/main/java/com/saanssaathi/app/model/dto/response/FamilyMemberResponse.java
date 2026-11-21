package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberResponse {
    private Long id;
    private String name;
    private String ageGroup;
    private Integer birthYear;
    private String sensitiveCategory;
    private Integer dailyOutdoorHours;
    private String workScheduleStart;
    private String workScheduleEnd;
    private String exercisePreference;
    private boolean isActive;
}
