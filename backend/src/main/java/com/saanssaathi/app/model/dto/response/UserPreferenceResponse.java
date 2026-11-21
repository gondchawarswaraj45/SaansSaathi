package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPreferenceResponse {
    private Long id;
    private Long userId;
    private String timezone;
    private Integer aqiAlertThreshold;
    private Boolean morningBriefing;
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean darkMode;
    private String language;
}
