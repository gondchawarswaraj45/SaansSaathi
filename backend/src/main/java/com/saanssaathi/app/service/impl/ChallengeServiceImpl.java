package com.saanssaathi.app.service.impl;

import com.saanssaathi.app.exception.ResourceNotFoundException;
import com.saanssaathi.app.model.dto.response.ChallengeParticipantResponse;
import com.saanssaathi.app.model.dto.response.CleanAirChallengeResponse;
import com.saanssaathi.app.model.dto.response.UserBadgeResponse;
import com.saanssaathi.app.model.entity.ChallengeParticipant;
import com.saanssaathi.app.model.entity.CleanAirChallenge;
import com.saanssaathi.app.model.entity.Notification;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.ChallengeParticipantRepository;
import com.saanssaathi.app.repository.CleanAirChallengeRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.service.ChallengeService;
import com.saanssaathi.app.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChallengeServiceImpl implements ChallengeService {

    private final CleanAirChallengeRepository challengeRepository;
    private final ChallengeParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<CleanAirChallengeResponse> getAllChallenges(Long userId) {
        List<CleanAirChallenge> challenges = challengeRepository.findByIsActiveTrue();
        Map<Integer, ChallengeParticipant> participantMap = new HashMap<>();

        if (userId != null) {
            participantRepository.findByUserId(userId)
                    .forEach(p -> participantMap.put(p.getChallenge().getId(), p));
        }

        return challenges.stream().map(c -> {
            ChallengeParticipant p = participantMap.get(c.getId());
            boolean isJoined = p != null;
            int days = p != null ? p.getDaysCompleted() : 0;
            int progress = p != null ? Math.min(100, (days * 100) / Math.max(1, c.getDurationDays())) : 0;
            boolean isCompleted = p != null && Boolean.TRUE.equals(p.getIsCompleted());

            return CleanAirChallengeResponse.builder()
                    .id(c.getId())
                    .title(c.getTitle())
                    .description(c.getDescription())
                    .category(c.getCategory())
                    .durationDays(c.getDurationDays())
                    .pointsReward(c.getPointsReward())
                    .isActive(c.getIsActive())
                    .isJoined(isJoined)
                    .currentProgress(progress)
                    .daysCompleted(days)
                    .isCompleted(isCompleted)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChallengeParticipantResponse> getUserActiveChallenges(Long userId) {
        if (userId == null) return Collections.emptyList();
        return participantRepository.findByUserIdAndIsCompletedFalse(userId).stream()
                .map(this::mapToParticipantResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChallengeParticipantResponse> getUserCompletedChallenges(Long userId) {
        if (userId == null) return Collections.emptyList();
        return participantRepository.findByUserIdAndIsCompletedTrue(userId).stream()
                .map(this::mapToParticipantResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChallengeParticipantResponse joinChallenge(Long userId, Integer challengeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        CleanAirChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + challengeId));

        Optional<ChallengeParticipant> existing = participantRepository.findByUserIdAndChallengeId(userId, challengeId);
        if (existing.isPresent()) {
            return mapToParticipantResponse(existing.get());
        }

        LocalDate today = LocalDate.now();
        ChallengeParticipant participant = ChallengeParticipant.builder()
                .user(user)
                .challenge(challenge)
                .startDate(today)
                .endDate(today.plusDays(challenge.getDurationDays()))
                .daysCompleted(1) // Day 1 joined
                .isCompleted(challenge.getDurationDays() <= 1)
                .completedAt(challenge.getDurationDays() <= 1 ? LocalDateTime.now() : null)
                .pointsEarned(challenge.getDurationDays() <= 1 ? challenge.getPointsReward() : 0)
                .build();

        ChallengeParticipant saved = participantRepository.save(participant);
        log.info("User {} joined challenge: {}", userId, challenge.getTitle());
        return mapToParticipantResponse(saved);
    }

    @Override
    @Transactional
    public void leaveChallenge(Long userId, Integer challengeId) {
        participantRepository.findByUserIdAndChallengeId(userId, challengeId)
                .ifPresent(participantRepository::delete);
        log.info("User {} left challenge {}", userId, challengeId);
    }

    @Override
    @Transactional
    public ChallengeParticipantResponse updateProgress(Long userId, Integer challengeId, Integer daysCompleted) {
        ChallengeParticipant participant = participantRepository.findByUserIdAndChallengeId(userId, challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("User has not joined challenge: " + challengeId));

        int newDays = daysCompleted != null ? daysCompleted : (participant.getDaysCompleted() + 1);
        int totalDays = participant.getChallenge().getDurationDays();
        participant.setDaysCompleted(Math.min(totalDays, newDays));

        if (participant.getDaysCompleted() >= totalDays && !Boolean.TRUE.equals(participant.getIsCompleted())) {
            participant.setIsCompleted(true);
            participant.setCompletedAt(LocalDateTime.now());
            participant.setPointsEarned(participant.getChallenge().getPointsReward());

            // Notify user of completion & points awarded
            try {
                notificationService.createSystemNotification(
                        userId,
                        "🏆 Challenge Completed: " + participant.getChallenge().getTitle(),
                        String.format("Congratulations! You completed the '%s' challenge and earned +%d health points for your family.",
                                participant.getChallenge().getTitle(), participant.getPointsEarned()),
                        "/challenges",
                        Notification.NotificationType.CHALLENGE_UPDATE
                );
            } catch (Exception e) {
                log.warn("Could not create completion notification: {}", e.getMessage());
            }
        }

        ChallengeParticipant saved = participantRepository.save(participant);
        return mapToParticipantResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserBadgeResponse> getUserBadges(Long userId) {
        List<ChallengeParticipant> allJoined = userId != null ? participantRepository.findByUserId(userId) : Collections.emptyList();
        List<ChallengeParticipant> completed = allJoined.stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsCompleted()))
                .collect(Collectors.toList());

        int totalPoints = completed.stream().mapToInt(ChallengeParticipant::getPointsEarned).sum();

        boolean hasJoinedAny = !allJoined.isEmpty();
        boolean hasTransport = completed.stream().anyMatch(c -> c.getChallenge().getCategory() == CleanAirChallenge.ChallengeCategory.TRANSPORT);
        boolean hasHome = completed.stream().anyMatch(c -> c.getChallenge().getCategory() == CleanAirChallenge.ChallengeCategory.HOME);
        boolean hasHealth = completed.stream().anyMatch(c -> c.getChallenge().getCategory() == CleanAirChallenge.ChallengeCategory.HEALTH);
        boolean hasStreak = completed.stream().anyMatch(c -> c.getDaysCompleted() >= 7);
        boolean hasCenturion = totalPoints >= 50;

        List<UserBadgeResponse> badges = new ArrayList<>();

        badges.add(UserBadgeResponse.builder()
                .id("FIRST_STEP")
                .name("Clean Air Pioneer")
                .description("Joined your first community clean-air challenge to reduce personal exposure.")
                .icon("Compass")
                .category("COMMUNITY")
                .isUnlocked(hasJoinedAny)
                .unlockedAt(hasJoinedAny ? allJoined.get(0).getJoinedAt() : null)
                .points(10)
                .build());

        badges.add(UserBadgeResponse.builder()
                .id("METRO_MAESTRO")
                .name("Metro Maestro")
                .description("Successfully completed a public transport or carpooling challenge.")
                .icon("Bus")
                .category("TRANSPORT")
                .isUnlocked(hasTransport)
                .unlockedAt(hasTransport ? completed.get(0).getCompletedAt() : null)
                .points(25)
                .build());

        badges.add(UserBadgeResponse.builder()
                .id("SMOKE_FREE")
                .name("Smoke-Free Sanctuary")
                .description("Protected household indoor air by eliminating incense, coils, or dry dust.")
                .icon("ShieldCheck")
                .category("HOME")
                .isUnlocked(hasHome)
                .unlockedAt(hasHome ? completed.get(0).getCompletedAt() : null)
                .points(25)
                .build());

        badges.add(UserBadgeResponse.builder()
                .id("INVERSION_EVADER")
                .name("Inversion Evader")
                .description("Shifted outdoor activities indoors to protect against ground-level inversion smog.")
                .icon("Sun")
                .category("HEALTH")
                .isUnlocked(hasHealth)
                .unlockedAt(hasHealth ? completed.get(0).getCompletedAt() : null)
                .points(20)
                .build());

        badges.add(UserBadgeResponse.builder()
                .id("SEVEN_DAY_STREAK")
                .name("7-Day Winter Shield")
                .description("Maintained 100% compliance across a full 7-day clean air regimen.")
                .icon("Flame")
                .category("STREAK")
                .isUnlocked(hasStreak)
                .unlockedAt(hasStreak ? completed.get(0).getCompletedAt() : null)
                .points(30)
                .build());

        badges.add(UserBadgeResponse.builder()
                .id("CENTURION")
                .name("Clean Air Champion")
                .description("Accumulated 50+ total family clean air and health points.")
                .icon("Trophy")
                .category("MILESTONE")
                .isUnlocked(hasCenturion)
                .unlockedAt(hasCenturion ? completed.get(0).getCompletedAt() : null)
                .points(50)
                .build());

        return badges;
    }

    @Override
    @Transactional(readOnly = true)
    public int getUserTotalPoints(Long userId) {
        if (userId == null) return 45; // Default demo points
        return participantRepository.findByUserIdAndIsCompletedTrue(userId).stream()
                .mapToInt(ChallengeParticipant::getPointsEarned)
                .sum();
    }

    private ChallengeParticipantResponse mapToParticipantResponse(ChallengeParticipant p) {
        int duration = p.getChallenge().getDurationDays();
        int progress = Math.min(100, (p.getDaysCompleted() * 100) / Math.max(1, duration));

        return ChallengeParticipantResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .challengeId(p.getChallenge().getId())
                .challengeTitle(p.getChallenge().getTitle())
                .challengeDescription(p.getChallenge().getDescription())
                .category(p.getChallenge().getCategory())
                .durationDays(duration)
                .startDate(p.getStartDate())
                .endDate(p.getEndDate())
                .daysCompleted(p.getDaysCompleted())
                .isCompleted(p.getIsCompleted())
                .completedAt(p.getCompletedAt())
                .pointsEarned(p.getPointsEarned())
                .progressPercentage(progress)
                .build();
    }
}
