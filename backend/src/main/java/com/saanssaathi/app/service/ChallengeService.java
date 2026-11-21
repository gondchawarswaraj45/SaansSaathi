package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.response.ChallengeParticipantResponse;
import com.saanssaathi.app.model.dto.response.CleanAirChallengeResponse;
import com.saanssaathi.app.model.dto.response.UserBadgeResponse;

import java.util.List;

public interface ChallengeService {

    List<CleanAirChallengeResponse> getAllChallenges(Long userId);

    List<ChallengeParticipantResponse> getUserActiveChallenges(Long userId);

    List<ChallengeParticipantResponse> getUserCompletedChallenges(Long userId);

    ChallengeParticipantResponse joinChallenge(Long userId, Integer challengeId);

    void leaveChallenge(Long userId, Integer challengeId);

    ChallengeParticipantResponse updateProgress(Long userId, Integer challengeId, Integer daysCompleted);

    List<UserBadgeResponse> getUserBadges(Long userId);

    int getUserTotalPoints(Long userId);
}
