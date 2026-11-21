package com.saanssaathi.app.model.dto.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProgressRequest {

    @Min(value = 1, message = "Days completed must be at least 1")
    private Integer daysCompleted;

    private String notes;
}
