package com.saanssaathi.app;

import com.saanssaathi.app.model.dto.request.BroadcastNotificationRequest;
import com.saanssaathi.app.model.dto.response.AdminStatsResponse;
import com.saanssaathi.app.model.dto.response.AdminUserDTO;
import com.saanssaathi.app.model.dto.response.ApiHealthDTO;
import com.saanssaathi.app.model.entity.Notification;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.repository.*;
import com.saanssaathi.app.service.impl.AdminServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private IndoorAssessmentRepository indoorAssessmentRepository;

    @Mock
    private MonitoringStationRepository monitoringStationRepository;

    @Mock
    private CityRepository cityRepository;

    @Mock
    private CleanAirChallengeRepository challengeRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private AdminServiceImpl adminService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("admin@saanssaathi.in")
                .fullName("SaansSaathi Admin")
                .role(User.Role.ADMIN)
                .isActive(true)
                .isVerified(true)
                .build();
    }

    @Test
    void testGetPlatformStats() {
        when(userRepository.count()).thenReturn(200L);
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));
        when(familyMemberRepository.count()).thenReturn(500L);
        when(indoorAssessmentRepository.count()).thenReturn(150L);
        when(monitoringStationRepository.count()).thenReturn(60L);
        when(cityRepository.count()).thenReturn(40L);
        when(challengeRepository.count()).thenReturn(10L);

        AdminStatsResponse stats = adminService.getPlatformStats();

        assertNotNull(stats);
        assertTrue(stats.getTotalUsers() >= 200);
        assertTrue(stats.getTotalCitiesCovered() >= 40);
        assertTrue(stats.getSystemUptimeHours() > 0);
    }

    @Test
    void testToggleUserStatus() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        AdminUserDTO updated = adminService.toggleUserStatus(1L);

        assertNotNull(updated);
        assertFalse(updated.isActive()); // was true, now false
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    void testGetApiHealthDiagnostics() {
        List<ApiHealthDTO> diagnostics = adminService.getApiHealthDiagnostics();

        assertNotNull(diagnostics);
        assertEquals(4, diagnostics.size());
        assertTrue(diagnostics.stream().allMatch(d -> "UP".equals(d.getStatus())));
    }

    @Test
    void testBroadcastNotification() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));
        when(notificationRepository.saveAll(anyList())).thenAnswer(i -> i.getArgument(0));

        BroadcastNotificationRequest req = BroadcastNotificationRequest.builder()
                .title("Severe Smog Emergency")
                .message("GRAP Stage IV implemented in Delhi NCR")
                .type(Notification.NotificationType.AQI_ALERT)
                .build();

        int delivered = adminService.broadcastNotification(req);

        assertEquals(1, delivered);
        verify(notificationRepository, times(1)).saveAll(anyList());
    }
}
