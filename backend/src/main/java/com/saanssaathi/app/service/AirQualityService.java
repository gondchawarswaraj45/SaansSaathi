package com.saanssaathi.app.service;

import com.saanssaathi.app.model.dto.response.AirQualityResponse;
import com.saanssaathi.app.model.entity.MonitoringStation;

import java.util.List;
import java.util.Map;

public interface AirQualityService {
    AirQualityResponse getCurrentAirQuality(String city, Double lat, Double lng);
    List<MonitoringStation> getMonitoringStations(String city);
    List<Map<String, Object>> getHourlyHistory(Long stationId);
}
