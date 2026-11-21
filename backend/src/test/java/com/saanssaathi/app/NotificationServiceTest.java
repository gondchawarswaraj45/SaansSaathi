package com.saanssaathi.app;

import com.saanssaathi.app.model.dto.request.UserPreferenceRequest;
import com.saanssaathi.app.model.dto.response.NotificationResponse;
import com.saanssaathi.app.model.dto.response.UserPreferenceResponse;
import com.saanssaathi.app.model.entity.AqiReading;
import com.saanssaathi.app.model.entity.Notification;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.model.entity.UserPreference;
import com.saanssaathi.app.repository.NotificationRepository;
import com.saanssaathi.app.repository.UserPreferenceRepository;
import com.saanssaathi.app.repository.UserRepository;
import com.saanssaathi.app.service.AqiCalculationService;
import com.saanssaathi.app.service.impl.NotificationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private UserPreferenceRepository userPreferenceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AqiCalculationService aqiCalculationService;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User sampleUser;
    private UserPreference samplePref;
    private Notification sampleNotification;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .email("test@example.com")
                .fullName("Test User")
                .role(User.Role.USER)
                .build();

        samplePref = UserPreference.builder()
                .id(10L)
                .user(sampleUser)
                .timezone("Asia/Kolkata")
                .aqiAlertThreshold(200)
                .morningBriefing(true)
                .emailNotifications(false)
                .pushNotifications(true)
                .build();

        sampleNotification = Notification.builder()
                .id(100L)
                .user(sampleUser)
                .type(Notification.NotificationType.AQI_ALERT)
                .title("🚨 AQI Alert: Delhi reached 310 (Very Poor)")
                .message("High smog detected")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testCreateAqiAlert() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(aqiCalculationService.getCategory(310)).thenReturn(AqiReading.Category.VERY_POOR);
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> {
            Notification n = invocation.getArgument(0);
            n.setId(101L);
            return n;
        });

        NotificationResponse response = notificationService.createAqiAlert(1L, 310, 200, "Delhi");

        assertNotNull(response);
        assertEquals(Notification.NotificationType.AQI_ALERT, response.getType());
        assertTrue(response.getTitle().contains("Delhi reached 310"));
        assertFalse(response.getIsRead());
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testMarkAsRead() {
        when(notificationRepository.findById(100L)).thenReturn(Optional.of(sampleNotification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationResponse response = notificationService.markAsRead(1L, 100L);

        assertNotNull(response);
        assertTrue(response.getIsRead());
        assertNotNull(response.getReadAt());
        verify(notificationRepository, times(1)).save(sampleNotification);
    }

    @Test
    void testUpdateUserPreferences() {
        when(userPreferenceRepository.findByUserId(1L)).thenReturn(Optional.of(samplePref));
        when(userPreferenceRepository.save(any(UserPreference.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserPreferenceRequest request = UserPreferenceRequest.builder()
                .aqiAlertThreshold(250)
                .morningBriefing(false)
                .pushNotifications(true)
                .build();

        UserPreferenceResponse response = notificationService.updateUserPreferences(1L, request);

        assertNotNull(response);
        assertEquals(250, response.getAqiAlertThreshold());
        assertFalse(response.getMorningBriefing());
        assertTrue(response.getPushNotifications());
        verify(userPreferenceRepository, times(1)).save(samplePref);
    }

    @Test
    void testGetUnreadCount() {
        when(notificationRepository.countByUserIdAndIsReadFalse(1L)).thenReturn(5L);

        long count = notificationService.getUnreadCount(1L);

        assertEquals(5L, count);
        verify(notificationRepository, times(1)).countByUserIdAndIsReadFalse(1L);
    }
}
