package com.saanssaathi.app.model.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferenceRequest {

    private String timezone;

    @Min(value = 50, message = "AQI alert threshold must be at least 50")
    @Max(value = 500, message = "AQI alert threshold cannot exceed 500")
    private Integer aqiAlertThreshold;

    private Boolean morningBriefing;

    private Boolean emailNotifications;

    private Boolean pushNotifications;

    private Boolean darkMode;

    private String language;
}
