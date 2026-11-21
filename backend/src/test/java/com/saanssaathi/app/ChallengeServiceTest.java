package com.saanssaathi.app;

import com.saanssaathi.app.model.dto.response.ChallengeParticipantResponse;
import com.saanssaathi.app.model.dto.response.CleanAirChallengeResponse;
import com.saanssaathi.app.model.dto.response.UserBadgeResponse;
import com.saanssaathi.app.model.entity.ChallengeParticipant;
import com.saanssaathi.app.model.entity.CleanAirChallenge;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.ChallengeParticipantRepository;
import com.saanssaathi.app.repository.CleanAirChallengeRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.service.NotificationService;
import com.saanssaathi.app.service.impl.ChallengeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChallengeServiceTest {

    @Mock
    private CleanAirChallengeRepository challengeRepository;

    @Mock
    private ChallengeParticipantRepository participantRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ChallengeServiceImpl challengeService;

    private User sampleUser;
    private CleanAirChallenge sampleChallenge;
    private ChallengeParticipant sampleParticipant;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("family@example.com")
                .fullName("Aarav Sharma")
                .role(User.Role.USER)
                .build();

        sampleChallenge = CleanAirChallenge.builder()
                .id(1)
                .title("7-Day Public Transport Challenge")
                .description("Use metro or bus instead of private car")
                .category(CleanAirChallenge.ChallengeCategory.TRANSPORT)
                .durationDays(7)
                .pointsReward(15)
                .isActive(true)
                .build();

        sampleParticipant = ChallengeParticipant.builder()
                .id(50L)
                .user(sampleUser)
                .challenge(sampleChallenge)
                .startDate(LocalDate.now())
                .daysCompleted(3)
                .isCompleted(false)
                .pointsEarned(0)
                .joinedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testGetAllChallenges() {
        when(challengeRepository.findByIsActiveTrue()).thenReturn(List.of(sampleChallenge));
        when(participantRepository.findByUserId(1L)).thenReturn(List.of(sampleParticipant));

        List<CleanAirChallengeResponse> responses = challengeService.getAllChallenges(1L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertTrue(responses.get(0).getIsJoined());
        assertEquals(3, responses.get(0).getDaysCompleted());
        verify(challengeRepository, times(1)).findByIsActiveTrue();
    }

    @Test
    void testJoinChallenge() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(challengeRepository.findById(1)).thenReturn(Optional.of(sampleChallenge));
        when(participantRepository.findByUserIdAndChallengeId(1L, 1)).thenReturn(Optional.empty());
        when(participantRepository.save(any(ChallengeParticipant.class))).thenAnswer(i -> {
            ChallengeParticipant p = i.getArgument(0);
            p.setId(51L);
            return p;
        });

        ChallengeParticipantResponse res = challengeService.joinChallenge(1L, 1);

        assertNotNull(res);
        assertEquals(1, res.getChallengeId());
        assertEquals(1, res.getDaysCompleted());
        assertFalse(res.getIsCompleted());
        verify(participantRepository, times(1)).save(any(ChallengeParticipant.class));
    }

    @Test
    void testUpdateProgressToCompletion() {
        when(participantRepository.findByUserIdAndChallengeId(1L, 1)).thenReturn(Optional.of(sampleParticipant));
        when(participantRepository.save(any(ChallengeParticipant.class))).thenAnswer(i -> i.getArgument(0));

        ChallengeParticipantResponse res = challengeService.updateProgress(1L, 1, 7);

        assertNotNull(res);
        assertEquals(7, res.getDaysCompleted());
        assertTrue(res.getIsCompleted());
        assertEquals(15, res.getPointsEarned());
        verify(participantRepository, times(1)).save(sampleParticipant);
    }

    @Test
    void testGetUserBadges() {
        when(participantRepository.findByUserId(1L)).thenReturn(List.of(sampleParticipant));

        List<UserBadgeResponse> badges = challengeService.getUserBadges(1L);

        assertNotNull(badges);
        assertEquals(6, badges.size());
        // First badge "FIRST_STEP" should be unlocked since user joined sampleParticipant
        assertTrue(badges.get(0).getIsUnlocked());
    }
}
