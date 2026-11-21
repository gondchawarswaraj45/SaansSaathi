package com.saanssaathi.app.integration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Open-Meteo Integration Service
 * Free environmental and meteorological context (temperature, humidity, wind)
 */
@Service
public class WeatherIntegrationService {

    private static final Logger log = LoggerFactory.getLogger(WeatherIntegrationService.class);
    private final RestClient restClient;

    public WeatherIntegrationService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.open-meteo.com/v1")
                .build();
    }

    @Cacheable(value = "weatherCache", key = "#lat + '_' + #lng")
    public WeatherData fetchCurrentWeather(double lat, double lng) {
        try {
            Map response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/forecast")
                            .queryParam("latitude", lat)
                            .queryParam("longitude", lng)
                            .queryParam("current", "temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code")
                            .queryParam("timezone", "Asia/Kolkata")
                            .build())
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("current")) {
                Map current = (Map) response.get("current");
                return WeatherData.builder()
                        .temperature(((Number) current.getOrDefault("temperature_2m", 25.0)).doubleValue())
                        .humidity(((Number) current.getOrDefault("relative_humidity_2m", 60.0)).intValue())
                        .windSpeed(((Number) current.getOrDefault("wind_speed_10m", 8.0)).doubleValue())
                        .windDirection(((Number) current.getOrDefault("wind_direction_10m", 180)).intValue())
                        .weatherCode(((Number) current.getOrDefault("weather_code", 0)).intValue())
                        .build();
            }
        } catch (Exception e) {
            log.warn("Failed to fetch weather from Open-Meteo for ({}, {}): {}", lat, lng, e.getMessage());
        }

        // Return sensible default fallback context
        return WeatherData.builder()
                .temperature(24.0)
                .humidity(65)
                .windSpeed(6.5)
                .windDirection(270)
                .weatherCode(1)
                .build();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeatherData {
        private double temperature;
        private int humidity;
        private double windSpeed;
        private int windDirection;
        private int weatherCode;
    }
}
