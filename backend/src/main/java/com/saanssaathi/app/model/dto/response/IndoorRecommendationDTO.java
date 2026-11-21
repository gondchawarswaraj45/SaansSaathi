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
public class IndoorRecommendationDTO {

    private String id;
    private String category; // SOURCE_CONTROL, VENTILATION, FILTRATION, CLEANING, HABIT
    private String title;
    private String recommendation;
    private String priority; // CRITICAL, HIGH, MEDIUM, LOW
    private String estimatedCost;
    private String source; // Medical/Environmental research citation
    private List<String> actionSteps;
    private String impactDescription;
}
