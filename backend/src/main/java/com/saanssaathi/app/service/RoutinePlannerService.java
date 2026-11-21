package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.request.RoutineActivityRequest;
import com.saanssaathi.app.model.dto.response.DailyRoutineResponse;
import com.saanssaathi.app.model.dto.response.RoutineActivityResponse;
import com.saanssaathi.app.model.dto.response.WeeklyRoutineOverviewResponse;

import java.time.LocalDate;

public interface RoutinePlannerService {

    DailyRoutineResponse getTodayRoutine(Long userId, Integer currentAqi);

    DailyRoutineResponse generateRoutineForDate(Long userId, LocalDate date, Integer currentAqi, boolean forceRegenerate);

    RoutineActivityResponse addCustomActivity(Long userId, Long routineId, RoutineActivityRequest request);

    RoutineActivityResponse updateActivity(Long userId, Long routineId, Long activityId, RoutineActivityRequest request);

    RoutineActivityResponse toggleActivityComplete(Long userId, Long routineId, Long activityId);

    void deleteActivity(Long userId, Long routineId, Long activityId);

    WeeklyRoutineOverviewResponse getWeeklyOverview(Long userId);
}
