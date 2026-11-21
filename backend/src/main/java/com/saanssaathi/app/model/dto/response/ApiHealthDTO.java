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
public class ApiHealthDTO {
    private String serviceName;
    private String status;
    private long latencyMs;
    private String details;
    private LocalDateTime lastChecked;
}
