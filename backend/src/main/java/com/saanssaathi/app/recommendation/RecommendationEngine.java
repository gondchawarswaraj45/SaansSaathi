package com.saanssaathi.app.recommendation;

import com.saanssaathi.app.model.entity.FamilyMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Deterministic Rule-Based Recommendation Engine
 * Evaluates demographic vulnerabilities and health sensitivities against CPCB and NCDC air quality advisories.
 */
@Component
public class RecommendationEngine {

    public MemberRecommendation generateRecommendation(FamilyMember member, int aqi) {
        List<String> precautions = new ArrayList<>();
        RiskLevel riskLevel;

        boolean isChild = member.getAgeGroup() == FamilyMember.AgeGroup.CHILD;
        boolean isSenior = member.getAgeGroup() == FamilyMember.AgeGroup.SENIOR;
        boolean hasRespiratory = member.getSensitiveCategory() == FamilyMember.SensitiveCategory.RESPIRATORY
                || member.getSensitiveCategory() == FamilyMember.SensitiveCategory.BOTH;
        boolean hasCardiac = member.getSensitiveCategory() == FamilyMember.SensitiveCategory.CARDIOVASCULAR
                || member.getSensitiveCategory() == FamilyMember.SensitiveCategory.BOTH;

        // Determine Risk Level based on sensitivity & AQI
        if (aqi <= 50) {
            riskLevel = RiskLevel.LOW;
            precautions.add("Air quality is ideal. Normal outdoor activities, sports, and school playtime are completely safe.");
            precautions.add("Keep home well-ventilated with fresh outdoor air.");
        } else if (aqi <= 100) {
            riskLevel = (hasRespiratory || hasCardiac) ? RiskLevel.MEDIUM : RiskLevel.LOW;
            precautions.add("Acceptable air quality for daily work and school schedules.");
            if (hasRespiratory) {
                precautions.add("Unusually sensitive individuals should monitor for mild throat or airway irritation.");
            }
        } else if (aqi <= 200) { // MODERATE
            if (hasRespiratory || isSenior || isChild) {
                riskLevel = RiskLevel.HIGH;
            } else {
                riskLevel = RiskLevel.MEDIUM;
            }

            if (isChild) {
                precautions.add("Reduce prolonged outdoor sports drills and intense playground running.");
            }
            if (isSenior || hasCardiac) {
                precautions.add("Avoid brisk walks during early morning hours; wait until sunlight clears surface inversion.");
            }
            if (hasRespiratory) {
                precautions.add("Keep rescue inhalers or prescribed respiratory medications accessible.");
            }
            precautions.add("Prefer carpooling or public transit with closed windows during rush-hour traffic.");
        } else if (aqi <= 300) { // POOR
            if (hasRespiratory || isSenior || isChild) {
                riskLevel = RiskLevel.CRITICAL;
            } else {
                riskLevel = RiskLevel.HIGH;
            }

            if (isChild) {
                precautions.add("Strictly avoid school sports and outdoor physical education classes.");
                precautions.add("Wear a certified pediatric N95 respirator during school bus / auto commutes.");
            }
            if (isSenior) {
                precautions.add("Cancel all morning and evening outdoor walks; shift to gentle indoor stretching.");
                precautions.add("Stay in designated Clean Air Room with HEPA filtration active.");
            }
            if (hasRespiratory || hasCardiac) {
                precautions.add("Limit all outdoor physical exertion; monitor peak expiratory flow if advised by doctor.");
            }
            if (!isChild && !isSenior) {
                precautions.add("Wear a well-fitted N95 mask during outdoor walking or 2-wheeler commutes.");
                precautions.add("Replace outdoor jogs with indoor home workouts or gym sessions.");
            }
        } else if (aqi <= 400) { // VERY POOR
            riskLevel = (hasRespiratory || isSenior || isChild) ? RiskLevel.CRITICAL : RiskLevel.HIGH;
            precautions.add("Severe winter smog warning: avoid all non-essential outdoor exposure.");
            if (isChild) {
                precautions.add("Advise school administration to suspend all outdoor assemblies and sports.");
            }
            if (isSenior || hasRespiratory) {
                precautions.add("Strict home stay recommended; run continuous air purification in living areas.");
            }
            precautions.add("Fit-tested N95 or N99 respirator mandatory for any unavoidable transit.");
            precautions.add("Keep windows closed facing arterial roads and damp-mop interior floors.");
        } else { // SEVERE
            riskLevel = RiskLevel.CRITICAL;
            precautions.add("EMERGENCY AIR POLLUTION ADVISORY: Hazardous atmospheric particulate density.");
            precautions.add("All family members must remain indoors with doors and window gaps draft-sealed.");
            precautions.add("Continuous HEPA filtration recommended in the central Clean Air Room.");
            if (hasRespiratory || hasCardiac || isSenior) {
                precautions.add("Consult healthcare provider immediately upon any breathing difficulty, chest tightness, or wheezing.");
            }
        }

        return MemberRecommendation.builder()
                .memberId(member.getId())
                .memberName(member.getName())
                .ageGroup(member.getAgeGroup().name())
                .riskLevel(riskLevel.name())
                .aqi(aqi)
                .precautions(precautions)
                .build();
    }

    public enum RiskLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberRecommendation {
        private Long memberId;
        private String memberName;
        private String ageGroup;
        private String riskLevel;
        private int aqi;
        private List<String> precautions;
    }
}
