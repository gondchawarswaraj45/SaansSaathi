package com.saanssaathi.app.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyMemberRequest {

    @NotBlank(message = "Member name is required")
    private String name;

    @NotNull(message = "Age group is required (CHILD, ADULT, SENIOR)")
    private String ageGroup;

    private Integer birthYear;
    private String sensitiveCategory;
    private Integer dailyOutdoorHours;
    private String workScheduleStart;
    private String workScheduleEnd;
    private String exercisePreference;
}
