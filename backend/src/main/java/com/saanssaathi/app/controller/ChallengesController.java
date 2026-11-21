package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.UpdateProgressRequest;
import com.saanssaathi.app.model.dto.response.ChallengeParticipantResponse;
import com.saanssaathi.app.model.dto.response.CleanAirChallengeResponse;
import com.saanssaathi.app.model.dto.response.UserBadgeResponse;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.service.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
@RequiredArgsConstructor
@Tag(name = "Clean Air Challenges & Gamification", description = "Community low-emission challenges, habit tracking, streak points, and achievement badges")
public class ChallengesController {

    private final ChallengeService challengeService;

    @GetMapping
    @Operation(summary = "Get all available clean-air challenges with user join status")
    public ResponseEntity<ApiResponse<List<CleanAirChallengeResponse>>> getAllChallenges(
            @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        List<CleanAirChallengeResponse> challenges = challengeService.getAllChallenges(userId);
        return ResponseEntity.ok(ApiResponse.success(challenges, "Clean air challenges retrieved"));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's active and completed challenges")
    public ResponseEntity<ApiResponse<Map<String, List<ChallengeParticipantResponse>>>> getMyChallenges(
            @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        List<ChallengeParticipantResponse> active = challengeService.getUserActiveChallenges(userId);
        List<ChallengeParticipantResponse> completed = challengeService.getUserCompletedChallenges(userId);

        Map<String, List<ChallengeParticipantResponse>> result = new HashMap<>();
        result.put("active", active);
        result.put("completed", completed);

        return ResponseEntity.ok(ApiResponse.success(result, "User challenges retrieved"));
    }

    @PostMapping("/{id}/join")
    @Operation(summary = "Join a clean-air challenge")
    public ResponseEntity<ApiResponse<ChallengeParticipantResponse>> joinChallenge(
            @AuthenticationPrincipal User user,
            @PathVariable Integer id) {
        Long userId = user != null ? user.getId() : 1L;
        ChallengeParticipantResponse response = challengeService.joinChallenge(userId, id);
        return ResponseEntity.ok(ApiResponse.success(response, "Challenge joined successfully"));
    }

    @DeleteMapping("/{id}/leave")
    @Operation(summary = "Leave an active clean-air challenge")
    public ResponseEntity<ApiResponse<Void>> leaveChallenge(
            @AuthenticationPrincipal User user,
            @PathVariable Integer id) {
        Long userId = user != null ? user.getId() : 1L;
        challengeService.leaveChallenge(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Challenge abandoned"));
    }

    @PutMapping("/{id}/progress")
    @Operation(summary = "Update progress / check off a completed day in challenge")
    public ResponseEntity<ApiResponse<ChallengeParticipantResponse>> updateProgress(
            @AuthenticationPrincipal User user,
            @PathVariable Integer id,
            @RequestBody(required = false) UpdateProgressRequest request) {
        Long userId = user != null ? user.getId() : 1L;
        Integer daysCompleted = request != null ? request.getDaysCompleted() : null;
        ChallengeParticipantResponse response = challengeService.updateProgress(userId, id, daysCompleted);
        return ResponseEntity.ok(ApiResponse.success(response, "Progress logged successfully"));
    }

    @GetMapping("/badges")
    @Operation(summary = "Get user achievement badges and unlock progression")
    public ResponseEntity<ApiResponse<List<UserBadgeResponse>>> getBadges(
            @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        List<UserBadgeResponse> badges = challengeService.getUserBadges(userId);
        return ResponseEntity.ok(ApiResponse.success(badges, "User badges retrieved"));
    }

    @GetMapping("/points")
    @Operation(summary = "Get total community health points earned by family")
    public ResponseEntity<ApiResponse<Integer>> getTotalPoints(
            @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : 1L;
        int points = challengeService.getUserTotalPoints(userId);
        return ResponseEntity.ok(ApiResponse.success(points, "Total points retrieved"));
    }
}
