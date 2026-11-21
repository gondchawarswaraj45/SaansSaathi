package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AirQualityResponse {
    private int aqi;
    private String category;
    private String dominantPollutant;
    private String locationName;
    private String stationName;
    private Double latitude;
    private Double longitude;
    private String updatedAt;
    private boolean isLive;
    private List<PollutantItem> pollutants;
    private WeatherInfo weather;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PollutantItem {
        private String code;
        private String name;
        private double value;
        private String unit;
        private double safeLimit;
        private Integer subIndex;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeatherInfo {
        private double temperature;
        private int humidity;
        private double windSpeed;
        private int windDirection;
        private int weatherCode;
    }
}
