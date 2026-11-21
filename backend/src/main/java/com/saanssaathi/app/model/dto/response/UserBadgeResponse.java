package com.saanssaathi.app.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserBadgeResponse {
    private String id;
    private String name;
    private String description;
    private String icon;
    private String category;
    private Boolean isUnlocked;
    private LocalDateTime unlockedAt;
    private Integer points;
}
