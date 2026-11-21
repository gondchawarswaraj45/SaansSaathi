package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.RoutineActivityRequest;
import com.saanssaathi.app.model.dto.response.DailyRoutineResponse;
import com.saanssaathi.app.model.dto.response.RoutineActivityResponse;
import com.saanssaathi.app.model.dto.response.WeeklyRoutineOverviewResponse;
import com.saanssaathi.app.model.entity.User;
import com.saanssaathi.app.service.RoutinePlannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
@Tag(name = "Smart Daily Routine Planner", description = "Low-emission routines synchronized with diurnal inversion patterns and family profiles")
public class PlannerController {

    private final RoutinePlannerService plannerService;

    @GetMapping
    @Operation(summary = "Get today's scheduled low-emission routine")
    public ResponseEntity<ApiResponse<DailyRoutineResponse>> getTodayRoutine(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false, defaultValue = "285") Integer aqi) {
        DailyRoutineResponse response = plannerService.getTodayRoutine(user.getId(), aqi);
        return ResponseEntity.ok(ApiResponse.success(response, "Today's daily routine retrieved"));
    }

    @PostMapping("/generate")
    @Operation(summary = "Generate or regenerate routine for a specified date")
    public ResponseEntity<ApiResponse<DailyRoutineResponse>> generateRoutine(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false, defaultValue = "285") Integer aqi) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        DailyRoutineResponse response = plannerService.generateRoutineForDate(user.getId(), targetDate, aqi, true);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Routine generated for " + targetDate));
    }

    @PostMapping("/{id}/activities")
    @Operation(summary = "Add a custom scheduled activity to the routine")
    public ResponseEntity<ApiResponse<RoutineActivityResponse>> addActivity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody RoutineActivityRequest request) {
        RoutineActivityResponse response = plannerService.addCustomActivity(user.getId(), id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Custom activity added to routine"));
    }

    @PutMapping("/{id}/activities/{actId}")
    @Operation(summary = "Update an existing activity in the routine")
    public ResponseEntity<ApiResponse<RoutineActivityResponse>> updateActivity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long actId,
            @Valid @RequestBody RoutineActivityRequest request) {
        RoutineActivityResponse response = plannerService.updateActivity(user.getId(), id, actId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Routine activity updated"));
    }

    @PostMapping("/{id}/activities/{actId}/complete")
    @Operation(summary = "Toggle activity completion status")
    public ResponseEntity<ApiResponse<RoutineActivityResponse>> toggleComplete(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long actId) {
        RoutineActivityResponse response = plannerService.toggleActivityComplete(user.getId(), id, actId);
        return ResponseEntity.ok(ApiResponse.success(response, "Activity completion toggled"));
    }

    @DeleteMapping("/{id}/activities/{actId}")
    @Operation(summary = "Delete an activity from the routine")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @PathVariable Long actId) {
        plannerService.deleteActivity(user.getId(), id, actId);
        return ResponseEntity.ok(ApiResponse.success(null, "Activity deleted"));
    }

    @GetMapping("/weekly")
    @Operation(summary = "Get 7-day routine compliance and air quality summary")
    public ResponseEntity<ApiResponse<WeeklyRoutineOverviewResponse>> getWeeklyOverview(
            @AuthenticationPrincipal User user) {
        WeeklyRoutineOverviewResponse response = plannerService.getWeeklyOverview(user.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Weekly routine overview retrieved"));
    }
}
