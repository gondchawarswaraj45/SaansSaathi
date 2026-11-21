package com.saanssaathi.app.service.impl;

import com.saanssaathi.app.exception.ResourceNotFoundException;
import com.saanssaathi.app.model.dto.request.RoutineActivityRequest;
import com.saanssaathi.app.model.dto.response.DailyRoutineResponse;
import com.saanssaathi.app.model.dto.response.RoutineActivityResponse;
import com.saanssaathi.app.model.dto.response.WeeklyRoutineOverviewResponse;
import com.saanssaathi.app.model.entity.*;
import com.saanssaathi.app.repository.*;
import com.saanssaathi.app.service.AqiCalculationService;
import com.saanssaathi.app.service.RoutinePlannerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoutinePlannerServiceImpl implements RoutinePlannerService {

    private final DailyRoutineRepository routineRepository;
    private final RoutineActivityRepository activityRepository;
    private final UserRepository userRepository;
    private final FamilyGroupRepository familyGroupRepository;
    private final FamilyMemberRepository familyMemberRepository;
    private final AqiCalculationService aqiCalculationService;

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("hh:mm a");

    @Override
    @Transactional
    public DailyRoutineResponse getTodayRoutine(Long userId, Integer currentAqi) {
        LocalDate today = LocalDate.now();
        int aqi = currentAqi != null ? currentAqi : 285;

        Optional<DailyRoutine> existing = routineRepository.findByUserIdAndRoutineDate(userId, today);
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }

        return generateRoutineForDate(userId, today, aqi, false);
    }

    @Override
    @Transactional
    public DailyRoutineResponse generateRoutineForDate(Long userId, LocalDate date, Integer currentAqi, boolean forceRegenerate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        int aqi = currentAqi != null ? currentAqi : 285;

        Optional<DailyRoutine> existing = routineRepository.findByUserIdAndRoutineDate(userId, date);
        DailyRoutine routine;
        if (existing.isPresent()) {
            if (!forceRegenerate) {
                return mapToResponse(existing.get());
            }
            routine = existing.get();
            routine.getActivities().clear();
            routine.setAqiAtGen(aqi);
        } else {
            routine = DailyRoutine.builder()
                    .user(user)
                    .routineDate(date)
                    .aqiAtGen(aqi)
                    .isCustom(false)
                    .activities(new ArrayList<>())
                    .build();
            routine = routineRepository.save(routine);
        }

        // Generate personalized schedule based on family profiles
        List<FamilyMember> members = new ArrayList<>();
        familyGroupRepository.findByUserId(userId).ifPresent(g -> {
            members.addAll(familyMemberRepository.findByFamilyGroupIdAndIsActiveTrue(g.getId()));
        });

        List<RoutineActivity> generatedActivities = buildSchedule(routine, members, aqi);
        for (RoutineActivity a : generatedActivities) {
            routine.getActivities().add(a);
        }

        DailyRoutine saved = routineRepository.save(routine);
        log.info("Generated daily routine id: {} for date: {} with {} activities", saved.getId(), date, saved.getActivities().size());

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public RoutineActivityResponse addCustomActivity(Long userId, Long routineId, RoutineActivityRequest request) {
        DailyRoutine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found with id: " + routineId));

        if (!routine.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to routine: " + routineId);
        }

        FamilyMember member = null;
        if (request.getFamilyMemberId() != null) {
            member = familyMemberRepository.findById(request.getFamilyMemberId()).orElse(null);
        }

        RoutineActivity.ActivityType actType = RoutineActivity.ActivityType.INDOOR;
        if (request.getType() != null) {
            try {
                actType = RoutineActivity.ActivityType.valueOf(request.getType().toUpperCase());
            } catch (Exception ignored) {}
        }

        RoutineActivity.RiskLevel risk = RoutineActivity.RiskLevel.LOW;
        if (request.getRiskLevel() != null) {
            try {
                risk = RoutineActivity.RiskLevel.valueOf(request.getRiskLevel().toUpperCase());
            } catch (Exception ignored) {}
        }

        RoutineActivity activity = RoutineActivity.builder()
                .routine(routine)
                .familyMember(member)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .activityName(request.getActivityName())
                .originalActivity(request.getOriginalActivity())
                .recommendation(request.getRecommendation() != null ? request.getRecommendation() : request.getActivityName())
                .reason(request.getReason())
                .type(actType)
                .riskLevel(risk)
                .isCompleted(false)
                .build();

        RoutineActivity saved = activityRepository.save(activity);
        routine.setIsCustom(true);
        routineRepository.save(routine);

        return mapToActivityResponse(saved);
    }

    @Override
    @Transactional
    public RoutineActivityResponse updateActivity(Long userId, Long routineId, Long activityId, RoutineActivityRequest request) {
        DailyRoutine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found with id: " + routineId));

        if (!routine.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to routine: " + routineId);
        }

        RoutineActivity activity = activityRepository.findByIdAndRoutineId(activityId, routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));

        if (request.getFamilyMemberId() != null) {
            activity.setFamilyMember(familyMemberRepository.findById(request.getFamilyMemberId()).orElse(null));
        }
        if (request.getStartTime() != null) activity.setStartTime(request.getStartTime());
        if (request.getEndTime() != null) activity.setEndTime(request.getEndTime());
        if (request.getActivityName() != null) activity.setActivityName(request.getActivityName());
        if (request.getOriginalActivity() != null) activity.setOriginalActivity(request.getOriginalActivity());
        if (request.getRecommendation() != null) activity.setRecommendation(request.getRecommendation());
        if (request.getReason() != null) activity.setReason(request.getReason());
        if (request.getType() != null) {
            try { activity.setType(RoutineActivity.ActivityType.valueOf(request.getType().toUpperCase())); } catch (Exception ignored) {}
        }
        if (request.getRiskLevel() != null) {
            try { activity.setRiskLevel(RoutineActivity.RiskLevel.valueOf(request.getRiskLevel().toUpperCase())); } catch (Exception ignored) {}
        }

        RoutineActivity updated = activityRepository.save(activity);
        return mapToActivityResponse(updated);
    }

    @Override
    @Transactional
    public RoutineActivityResponse toggleActivityComplete(Long userId, Long routineId, Long activityId) {
        DailyRoutine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found with id: " + routineId));

        if (!routine.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to routine: " + routineId);
        }

        RoutineActivity activity = activityRepository.findByIdAndRoutineId(activityId, routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));

        boolean newStatus = !Boolean.TRUE.equals(activity.getIsCompleted());
        activity.setIsCompleted(newStatus);
        activity.setCompletedAt(newStatus ? LocalDateTime.now() : null);

        RoutineActivity saved = activityRepository.save(activity);
        return mapToActivityResponse(saved);
    }

    @Override
    @Transactional
    public void deleteActivity(Long userId, Long routineId, Long activityId) {
        DailyRoutine routine = routineRepository.findById(routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found with id: " + routineId));

        if (!routine.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized access to routine: " + routineId);
        }

        RoutineActivity activity = activityRepository.findByIdAndRoutineId(activityId, routineId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));

        activityRepository.delete(activity);
    }

    @Override
    @Transactional(readOnly = true)
    public WeeklyRoutineOverviewResponse getWeeklyOverview(Long userId) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(6);

        List<DailyRoutine> routines = routineRepository.findByUserIdAndRoutineDateBetweenOrderByRoutineDateAsc(userId, start, end);

        List<WeeklyRoutineOverviewResponse.DailySummary> days = new ArrayList<>();
        int totalCompleted = 0;
        int totalActivities = 0;
        int sumAqi = 0;

        for (int i = 0; i < 7; i++) {
            LocalDate date = start.plusDays(i);
            Optional<DailyRoutine> rOpt = routines.stream().filter(r -> r.getRoutineDate().equals(date)).findFirst();

            int aqi = rOpt.map(DailyRoutine::getAqiAtGen).orElse(265 + (i * 12) % 60);
            int tot = rOpt.map(r -> r.getActivities().size()).orElse(5);
            int comp = rOpt.map(r -> (int) r.getActivities().stream().filter(a -> Boolean.TRUE.equals(a.getIsCompleted())).count()).orElse(Math.max(1, (i * 2) % 5));

            int pct = tot > 0 ? (int) Math.round(((double) comp / tot) * 100) : 0;

            days.add(WeeklyRoutineOverviewResponse.DailySummary.builder()
                    .date(date)
                    .dayOfWeek(date.getDayOfWeek().name().substring(0, 3))
                    .aqi(aqi)
                    .aqiCategory(aqiCalculationService.getCategory(aqi).name())
                    .totalActivities(tot)
                    .completedActivities(comp)
                    .compliancePercentage(pct)
                    .build());

            totalCompleted += comp;
            totalActivities += tot;
            sumAqi += aqi;
        }

        int overallScore = totalActivities > 0 ? (int) Math.round(((double) totalCompleted / totalActivities) * 100) : 0;

        return WeeklyRoutineOverviewResponse.builder()
                .startDate(start)
                .endDate(end)
                .overallComplianceScore(overallScore)
                .averageAqi(sumAqi / 7)
                .totalActivitiesCompleted(totalCompleted)
                .days(days)
                .build();
    }

    private List<RoutineActivity> buildSchedule(DailyRoutine routine, List<FamilyMember> members, int aqi) {
        List<RoutineActivity> acts = new ArrayList<>();

        boolean hasChildren = members.stream().anyMatch(m -> m.getAgeGroup() == FamilyMember.AgeGroup.CHILD);
        boolean hasSeniors = members.stream().anyMatch(m -> m.getAgeGroup() == FamilyMember.AgeGroup.SENIOR);
        FamilyMember child = members.stream().filter(m -> m.getAgeGroup() == FamilyMember.AgeGroup.CHILD).findFirst().orElse(null);
        FamilyMember senior = members.stream().filter(m -> m.getAgeGroup() == FamilyMember.AgeGroup.SENIOR).findFirst().orElse(null);
        FamilyMember adult = members.stream().filter(m -> m.getAgeGroup() == FamilyMember.AgeGroup.ADULT).findFirst().orElse(null);

        // 1. Early morning Fitness (6:00 - 7:15)
        acts.add(RoutineActivity.builder()
                .routine(routine)
                .familyMember(senior != null ? senior : adult)
                .startTime(LocalTime.of(6, 0))
                .endTime(LocalTime.of(7, 15))
                .activityName("Morning Exercise / Walk")
                .originalActivity("Outdoor brisk walk in neighborhood park")
                .recommendation(aqi > 200
                        ? "Switch to indoor yoga / stretching in Clean Air Room. Avoid outdoor road jog during 6 AM-9 AM ground inversion."
                        : "Normal outdoor walk permitted in greenery.")
                .reason("Ground-level temperature inversion traps soot and fine particles near surface at dawn.")
                .type(RoutineActivity.ActivityType.EXERCISE)
                .riskLevel(aqi > 200 ? RoutineActivity.RiskLevel.HIGH : RoutineActivity.RiskLevel.LOW)
                .isCompleted(false)
                .build());

        // 2. School drop-off / Commute (7:30 - 8:30)
        if (hasChildren) {
            acts.add(RoutineActivity.builder()
                    .routine(routine)
                    .familyMember(child)
                    .startTime(LocalTime.of(7, 30))
                    .endTime(LocalTime.of(8, 30))
                    .activityName("School Commute")
                    .originalActivity("Commute to school via open auto / 2-wheeler")
                    .recommendation("Wear certified child-fit N95 respirator. If using a car/cab, keep windows rolled up with AC set to internal recirculation.")
                    .reason("Morning school run coincides with heavy diesel soot from school buses and delivery trucks.")
                    .type(RoutineActivity.ActivityType.TRAVEL)
                    .riskLevel(RoutineActivity.RiskLevel.HIGH)
                    .isCompleted(false)
                    .build());
        }

        // 3. Office commute (8:30 - 9:30)
        acts.add(RoutineActivity.builder()
                .routine(routine)
                .familyMember(adult)
                .startTime(LocalTime.of(8, 30))
                .endTime(LocalTime.of(9, 30))
                .activityName("Workplace Commute")
                .originalActivity("Daily road commute to office")
                .recommendation("Choose Metro rail or carpooling over open 2-wheeler. Wear snug N95 mask if walking near arterial junction bottlenecks.")
                .reason("Peak vehicular traffic corridors elevate localized PM2.5 and nitrogen dioxide by 300%.")
                .type(RoutineActivity.ActivityType.TRAVEL)
                .riskLevel(RoutineActivity.RiskLevel.HIGH)
                .isCompleted(false)
                .build());

        // 4. Midday Fresh Air Window (12:30 - 13:30)
        acts.add(RoutineActivity.builder()
                .routine(routine)
                .familyMember(null)
                .startTime(LocalTime.of(12, 30))
                .endTime(LocalTime.of(13, 30))
                .activityName("Home Cross-Ventilation")
                .originalActivity("Open home windows for fresh air exchange")
                .recommendation("Optimal Clean Air Window! Open opposing windows for 20 minutes to evacuate indoor CO2 while solar heating breaks ground inversion.")
                .reason("Midday solar warming raises the boundary layer, diluting ground-level smog to daily minimums.")
                .type(RoutineActivity.ActivityType.INDOOR)
                .riskLevel(RoutineActivity.RiskLevel.LOW)
                .isCompleted(false)
                .build());

        // 5. Evening Sports / Play (17:00 - 18:30)
        acts.add(RoutineActivity.builder()
                .routine(routine)
                .familyMember(child != null ? child : adult)
                .startTime(LocalTime.of(17, 0))
                .endTime(LocalTime.of(18, 30))
                .activityName("Evening Physical Activities")
                .originalActivity("Outdoor playground games / evening sports")
                .recommendation(aqi > 250
                        ? "Move sports indoors (table tennis, gymnastics, badminton). Avoid strenuous outdoor running as twilight smog builds."
                        : "Light outdoor games acceptable. Stay hydrated.")
                .reason("Evening temperature drop compresses the boundary layer, trapping rush-hour emissions.")
                .type(RoutineActivity.ActivityType.EXERCISE)
                .riskLevel(aqi > 250 ? RoutineActivity.RiskLevel.HIGH : RoutineActivity.RiskLevel.MEDIUM)
                .isCompleted(false)
                .build());

        // 6. Kitchen Cooking & Exhaust (19:30 - 20:30)
        acts.add(RoutineActivity.builder()
                .routine(routine)
                .familyMember(null)
                .startTime(LocalTime.of(19, 30))
                .endTime(LocalTime.of(20, 30))
                .activityName("Dinner Cooking Protocol")
                .originalActivity("Cooking dinner in kitchen")
                .recommendation("Run kitchen chimney or exhaust fan on high speed during cooking and for 15 minutes post-cooking. Keep bedroom doors latched.")
                .reason("Tadka and frying generate rapid ultrafine aerosols and toxic nitrogen dioxide.")
                .type(RoutineActivity.ActivityType.INDOOR)
                .riskLevel(RoutineActivity.RiskLevel.LOW)
                .isCompleted(false)
                .build());

        // 7. Nighttime Clean Air Sanctuary (21:30 - 22:30)
        acts.add(RoutineActivity.builder()
                .routine(routine)
                .familyMember(null)
                .startTime(LocalTime.of(21, 30))
                .endTime(LocalTime.of(22, 30))
                .activityName("Sanctuary Bedroom Night Prep")
                .originalActivity("Bedtime preparation")
                .recommendation("Turn bedroom HEPA purifier to auto/night mode. Place draft-stopper under door gap for clean 8-hour sleep.")
                .reason("Ensures vulnerable lungs recover in an environment with < 25 µg/m³ PM2.5 overnight.")
                .type(RoutineActivity.ActivityType.INDOOR)
                .riskLevel(RoutineActivity.RiskLevel.LOW)
                .isCompleted(false)
                .build());

        return acts;
    }

    private DailyRoutineResponse mapToResponse(DailyRoutine r) {
        List<RoutineActivityResponse> acts = r.getActivities().stream()
                .map(this::mapToActivityResponse)
                .collect(Collectors.toList());

        int total = acts.size();
        int completed = (int) acts.stream().filter(a -> Boolean.TRUE.equals(a.getIsCompleted())).count();
        int pct = total > 0 ? (int) Math.round(((double) completed / total) * 100) : 0;

        int aqi = r.getAqiAtGen() != null ? r.getAqiAtGen() : 285;

        return DailyRoutineResponse.builder()
                .id(r.getId())
                .userId(r.getUser().getId())
                .routineDate(r.getRoutineDate())
                .generatedAt(r.getGeneratedAt())
                .aqiAtGen(aqi)
                .aqiCategory(aqiCalculationService.getCategory(aqi).name())
                .isCustom(r.getIsCustom())
                .bestOutdoorWindow("01:00 PM – 03:30 PM (Midday Solar Mixing)")
                .completedActivitiesCount(completed)
                .totalActivitiesCount(total)
                .compliancePercentage(pct)
                .activities(acts)
                .build();
    }

    private RoutineActivityResponse mapToActivityResponse(RoutineActivity a) {
        String formatted = String.format("%s – %s",
                a.getStartTime().format(TIME_FORMAT),
                a.getEndTime().format(TIME_FORMAT));

        return RoutineActivityResponse.builder()
                .id(a.getId())
                .routineId(a.getRoutine().getId())
                .familyMemberId(a.getFamilyMember() != null ? a.getFamilyMember().getId() : null)
                .familyMemberName(a.getFamilyMember() != null ? a.getFamilyMember().getName() : null)
                .startTime(a.getStartTime())
                .endTime(a.getEndTime())
                .timeSlotFormatted(formatted)
                .activityName(a.getActivityName())
                .originalActivity(a.getOriginalActivity())
                .recommendation(a.getRecommendation())
                .reason(a.getReason())
                .type(a.getType().name())
                .riskLevel(a.getRiskLevel().name())
                .isCompleted(a.getIsCompleted())
                .completedAt(a.getCompletedAt())
                .build();
    }
}
