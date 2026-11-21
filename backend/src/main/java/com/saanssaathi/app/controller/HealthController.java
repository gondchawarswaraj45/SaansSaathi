package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Health Controller for container orchestrators, Docker healthchecks, and uptime monitoring
 */
@RestController
@RequestMapping("/api")
@Tag(name = "System Health", description = "Endpoints for uptime and service readiness")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Service health check", description = "Returns service readiness status and version info")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        Map<String, String> status = Map.of(
                "status", "UP",
                "application", "SaansSaathi Backend",
                "version", "1.0.0",
                "service", "Operational"
        );
        return ResponseEntity.ok(ApiResponse.success(status, "SaansSaathi backend service is healthy"));
    }
}
