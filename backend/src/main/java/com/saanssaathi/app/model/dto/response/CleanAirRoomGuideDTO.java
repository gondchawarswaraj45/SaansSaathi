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
public class CleanAirRoomGuideDTO {

    private String title;
    private String subtitle;
    private String rationale;
    private List<SetupStep> setupSteps;
    private List<PurifierSizing> sizingTable;
    private List<String> doItems;
    private List<String> dontItems;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SetupStep {
        private Integer stepNumber;
        private String title;
        private String description;
        private String tip;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurifierSizing {
        private String roomCategory;
        private String roomArea;
        private String requiredCadr;
        private String airChangesPerHour;
        private String recommendedType;
    }
}
