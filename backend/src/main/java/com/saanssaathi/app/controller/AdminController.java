package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.request.BroadcastNotificationRequest;
import com.saanssaathi.app.model.dto.response.AdminStatsResponse;
import com.saanssaathi.app.model.dto.response.AdminUserDTO;
import com.saanssaathi.app.model.dto.response.ApiHealthDTO;
import com.saanssaathi.app.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Operations & System Diagnostics", description = "Platform statistics, user management, telemetry pipelines health, and system-wide broadcast alerts")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    @Operation(summary = "Get platform-wide statistics (users, families, stations, challenges)")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        AdminStatsResponse stats = adminService.getPlatformStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Platform statistics retrieved"));
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of registered users")
    public ResponseEntity<ApiResponse<List<AdminUserDTO>>> getUsers() {
        List<AdminUserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users, "User accounts retrieved"));
    }

    @PutMapping("/users/{id}/status")
    @Operation(summary = "Toggle user active / suspended status")
    public ResponseEntity<ApiResponse<AdminUserDTO>> toggleUserStatus(@PathVariable Long id) {
        AdminUserDTO updated = adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success(updated, "User status updated"));
    }

    @GetMapping("/api-health")
    @Operation(summary = "Get live health diagnostics for external APIs & database")
    public ResponseEntity<ApiResponse<List<ApiHealthDTO>>> getApiHealth() {
        List<ApiHealthDTO> healthList = adminService.getApiHealthDiagnostics();
        return ResponseEntity.ok(ApiResponse.success(healthList, "API health diagnostics"));
    }

    @PostMapping("/notifications/broadcast")
    @Operation(summary = "Broadcast critical emergency air advisory to all active users")
    public ResponseEntity<ApiResponse<Integer>> broadcastNotification(
            @Valid @RequestBody BroadcastNotificationRequest request) {
        int deliveredCount = adminService.broadcastNotification(request);
        return ResponseEntity.ok(ApiResponse.success(deliveredCount, "Broadcast alert sent to " + deliveredCount + " users"));
    }
}
