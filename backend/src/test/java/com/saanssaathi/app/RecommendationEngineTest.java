package com.saanssaathi.app;

import com.saanssaathi.app.model.entity.FamilyMember;
import com.saanssaathi.app.recommendation.RecommendationEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class RecommendationEngineTest {

    private RecommendationEngine engine;

    @BeforeEach
    void setUp() {
        engine = new RecommendationEngine();
    }

    @Test
    void testChildProtection_InPoorAqi() {
        FamilyMember child = FamilyMember.builder()
                .id(1L)
                .name("Aarav")
                .ageGroup(FamilyMember.AgeGroup.CHILD)
                .sensitiveCategory(FamilyMember.SensitiveCategory.NONE)
                .build();

        RecommendationEngine.MemberRecommendation rec = engine.generateRecommendation(child, 285);

        assertEquals("CRITICAL", rec.getRiskLevel());
        assertTrue(rec.getPrecautions().stream().anyMatch(p -> p.contains("school sports")));
    }

    @Test
    void testSeniorCardiacProtection_InModerateAqi() {
        FamilyMember senior = FamilyMember.builder()
                .id(2L)
                .name("Grandfather")
                .ageGroup(FamilyMember.AgeGroup.SENIOR)
                .sensitiveCategory(FamilyMember.SensitiveCategory.CARDIOVASCULAR)
                .build();

        RecommendationEngine.MemberRecommendation rec = engine.generateRecommendation(senior, 160);

        assertEquals("HIGH", rec.getRiskLevel());
        assertTrue(rec.getPrecautions().stream().anyMatch(p -> p.contains("morning")));
    }

    @Test
    void testHealthyAdult_InGoodAqi() {
        FamilyMember adult = FamilyMember.builder()
                .id(3L)
                .name("Rahul")
                .ageGroup(FamilyMember.AgeGroup.ADULT)
                .sensitiveCategory(FamilyMember.SensitiveCategory.NONE)
                .build();

        RecommendationEngine.MemberRecommendation rec = engine.generateRecommendation(adult, 40);

        assertEquals("LOW", rec.getRiskLevel());
        assertTrue(rec.getPrecautions().stream().anyMatch(p -> p.contains("ideal")));
    }
}
