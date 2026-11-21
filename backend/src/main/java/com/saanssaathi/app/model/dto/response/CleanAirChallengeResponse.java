package com.saanssaathi.app.model.dto.response;

import com.saanssaathi.app.model.entity.CleanAirChallenge;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CleanAirChallengeResponse {
    private Integer id;
    private String title;
    private String description;
    private CleanAirChallenge.ChallengeCategory category;
    private Integer durationDays;
    private Integer pointsReward;
    private Boolean isActive;
    private Boolean isJoined;
    private Integer currentProgress;
    private Integer daysCompleted;
    private Boolean isCompleted;
}
