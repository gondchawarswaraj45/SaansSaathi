package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapPopupDTO {

    private Long stationId;
    private String stationName;
    private String cityName;
    private String areaName;
    private Double latitude;
    private Double longitude;
    private Integer aqi;
    private String category;
    private String colorHex;
    private String dominantPollutant;
    private Map<String, Object> pollutants;
    private String healthAdvisory;
    private String lastUpdated;
}
