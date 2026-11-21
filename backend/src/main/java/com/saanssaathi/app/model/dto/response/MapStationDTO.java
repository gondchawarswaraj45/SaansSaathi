package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MapStationDTO {

    private Long id;
    private String name;
    private String cityName;
    private String areaName;
    private Double latitude;
    private Double longitude;
    private String provider;
    private Integer aqi;
    private String category;
    private String colorHex;
    private String dominantPollutant;
    private Double pm25;
    private Double pm10;
    private String lastUpdated;
}
