package com.saanssaathi.app.model.dto.response;

import com.saanssaathi.app.recommendation.RecommendationEngine;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FamilyProtectionPlanResponse {
    private Long familyGroupId;
    private String familyName;
    private int currentAqi;
    private String aqiCategory;
    private String overallRiskSummary;
    private List<RecommendationEngine.MemberRecommendation> memberPlans;
}
