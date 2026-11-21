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
public class DiyAirPurifierGuideDTO {

    private String title;
    private String subtitle;
    private String scientificValidation;
    private String estimatedCost;
    private String filtrationEfficiency;
    private List<MaterialItem> materials;
    private List<AssemblyStep> steps;
    private List<String> safetyPrecautions;
    private String officialCitation;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MaterialItem {
        private String name;
        private String specification;
        private String approximateCost;
        private Boolean isEssential;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssemblyStep {
        private Integer stepNumber;
        private String title;
        private String instructions;
        private String tip;
    }
}
