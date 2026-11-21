package com.saanssaathi.app.model.dto.response;

import com.saanssaathi.app.model.entity.CleanAirChallenge;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeParticipantResponse {
    private Long id;
    private Long userId;
    private Integer challengeId;
    private String challengeTitle;
    private String challengeDescription;
    private CleanAirChallenge.ChallengeCategory category;
    private Integer durationDays;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer daysCompleted;
    private Boolean isCompleted;
    private LocalDateTime completedAt;
    private Integer pointsEarned;
    private Integer progressPercentage;
}
