package com.saanssaathi.app;

import com.saanssaathi.app.model.dto.request.RoutineActivityRequest;
import com.saanssaathi.app.model.dto.response.DailyRoutineResponse;
import com.saanssaathi.app.model.dto.response.RoutineActivityResponse;
import com.saanssaathi.app.model.dto.response.WeeklyRoutineOverviewResponse;
import com.saanssaathi.app.model.entity.*;
import com.saanssaathi.app.repository.*;
import com.saanssaathi.app.service.AqiCalculationService;
import com.saanssaathi.app.service.impl.RoutinePlannerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoutinePlannerServiceTest {

    @Mock
    private DailyRoutineRepository routineRepository;

    @Mock
    private RoutineActivityRepository activityRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FamilyGroupRepository familyGroupRepository;

    @Mock
    private FamilyMemberRepository familyMemberRepository;

    @Mock
    private AqiCalculationService aqiCalculationService;

    @InjectMocks
    private RoutinePlannerServiceImpl plannerService;

    private User testUser;
    private FamilyGroup testGroup;
    private FamilyMember childMember;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .email("planner@saanssaathi.in")
                .fullName("Amit Patel")
                .build();

        testGroup = FamilyGroup.builder()
                .id(10L)
                .user(testUser)
                .familyName("Patel Family")
                .build();

        childMember = FamilyMember.builder()
                .id(20L)
                .familyGroup(testGroup)
                .name("Aarav")
                .ageGroup(FamilyMember.AgeGroup.CHILD)
                .build();
    }

    @Test
    @DisplayName("Should generate daily routine with school and inversion adjustments")
    void testGenerateRoutine_BuildsSchedule() {
        LocalDate today = LocalDate.now();

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(routineRepository.findByUserIdAndRoutineDate(1L, today)).thenReturn(Optional.empty());
        when(familyGroupRepository.findByUserId(1L)).thenReturn(Optional.of(testGroup));
        when(familyMemberRepository.findByFamilyGroupIdAndIsActiveTrue(10L)).thenReturn(List.of(childMember));
        when(aqiCalculationService.getCategory(310)).thenReturn(AqiReading.Category.VERY_POOR);

        when(routineRepository.save(any(DailyRoutine.class))).thenAnswer(inv -> {
            DailyRoutine r = inv.getArgument(0);
            if (r.getId() == null) r.setId(55L);
            return r;
        });

        DailyRoutineResponse response = plannerService.generateRoutineForDate(1L, today, 310, true);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(55L);
        assertThat(response.getBestOutdoorWindow()).contains("01:00 PM");
        assertThat(response.getActivities()).isNotEmpty();

        // Check that school commute was scheduled for the child
        boolean hasSchool = response.getActivities().stream().anyMatch(a -> a.getActivityName().contains("School"));
        assertThat(hasSchool).isTrue();

        // Check that morning inversion fitness warning was scheduled
        boolean hasMorning = response.getActivities().stream().anyMatch(a -> a.getActivityName().contains("Morning"));
        assertThat(hasMorning).isTrue();
    }

    @Test
    @DisplayName("Should toggle activity completion status")
    void testToggleActivityComplete() {
        DailyRoutine routine = DailyRoutine.builder()
                .id(55L)
                .user(testUser)
                .routineDate(LocalDate.now())
                .build();

        RoutineActivity activity = RoutineActivity.builder()
                .id(99L)
                .routine(routine)
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(9, 0))
                .activityName("Work Commute")
                .type(RoutineActivity.ActivityType.TRAVEL)
                .riskLevel(RoutineActivity.RiskLevel.HIGH)
                .isCompleted(false)
                .build();

        when(routineRepository.findById(55L)).thenReturn(Optional.of(routine));
        when(activityRepository.findByIdAndRoutineId(99L, 55L)).thenReturn(Optional.of(activity));
        when(activityRepository.save(any(RoutineActivity.class))).thenAnswer(inv -> inv.getArgument(0));

        RoutineActivityResponse res = plannerService.toggleActivityComplete(1L, 55L, 99L);

        assertThat(res.getIsCompleted()).isTrue();
        assertThat(res.getCompletedAt()).isNotNull();
    }

    @Test
    @DisplayName("Should add custom activity to existing routine")
    void testAddCustomActivity() {
        DailyRoutine routine = DailyRoutine.builder()
                .id(55L)
                .user(testUser)
                .routineDate(LocalDate.now())
                .isCustom(false)
                .build();

        RoutineActivityRequest req = RoutineActivityRequest.builder()
                .startTime(LocalTime.of(16, 0))
                .endTime(LocalTime.of(17, 0))
                .activityName("Visit neighborhood chemist")
                .originalActivity("Walk to chemist")
                .type("TRAVEL")
                .riskLevel("MEDIUM")
                .build();

        when(routineRepository.findById(55L)).thenReturn(Optional.of(routine));
        when(activityRepository.save(any(RoutineActivity.class))).thenAnswer(inv -> {
            RoutineActivity a = inv.getArgument(0);
            a.setId(105L);
            return a;
        });

        RoutineActivityResponse res = plannerService.addCustomActivity(1L, 55L, req);

        assertThat(res.getId()).isEqualTo(105L);
        assertThat(res.getActivityName()).isEqualTo("Visit neighborhood chemist");
        assertThat(routine.getIsCustom()).isTrue();
    }
}
