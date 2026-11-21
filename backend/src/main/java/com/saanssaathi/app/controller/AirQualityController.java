package com.saanssaathi.app.controller;

import com.saanssaathi.app.common.ApiResponse;
import com.saanssaathi.app.model.dto.response.AirQualityResponse;
import com.saanssaathi.app.model.entity.MonitoringStation;
import com.saanssaathi.app.service.AirQualityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/air-quality")
@RequiredArgsConstructor
@Tag(name = "Air Quality Telemetry", description = "Real-time AQI readings, CPCB calculations, stations, and pollutant history")
public class AirQualityController {

    private final AirQualityService airQualityService;

    @GetMapping("/current")
    @Operation(summary = "Get live AQI & pollutant metrics", description = "Returns AQI, CPCB category, individual pollutant levels and local weather parameters")
    public ResponseEntity<ApiResponse<AirQualityResponse>> getCurrentAirQuality(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng) {
        AirQualityResponse response = airQualityService.getCurrentAirQuality(city, lat, lng);
        return ResponseEntity.ok(ApiResponse.success(response, "Current air quality retrieved"));
    }

    @GetMapping("/stations")
    @Operation(summary = "Get monitoring stations", description = "Returns active monitoring stations in the city with geographic coordinates")
    public ResponseEntity<ApiResponse<List<MonitoringStation>>> getStations(
            @RequestParam(required = false) String city) {
        List<MonitoringStation> stations = airQualityService.getMonitoringStations(city);
        return ResponseEntity.ok(ApiResponse.success(stations, "Monitoring stations retrieved"));
    }

    @GetMapping("/history")
    @Operation(summary = "Get historical pollution curve", description = "Returns 24-hour diurnal variation for area charts")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getHistory(
            @RequestParam(required = false, defaultValue = "1") Long stationId) {
        List<Map<String, Object>> history = airQualityService.getHourlyHistory(stationId);
        return ResponseEntity.ok(ApiResponse.success(history, "Hourly history retrieved"));
    }
}
