package com.saanssaathi.app;

import com.saanssaathi.app.model.entity.AqiReading;
import com.saanssaathi.app.service.AqiCalculationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class AqiCalculationServiceTest {

    private AqiCalculationService aqiService;

    @BeforeEach
    void setUp() {
        aqiService = new AqiCalculationService();
    }

    @Test
    void testPM25SubIndex_Breakpoints() {
        // Good: 0-30 -> 0-50
        int good = aqiService.calculatePM25SubIndex(15);
        assertTrue(good >= 0 && good <= 50);

        // Satisfactory: 31-60 -> 51-100
        int satisfactory = aqiService.calculatePM25SubIndex(45);
        assertTrue(satisfactory >= 51 && satisfactory <= 100);

        // Moderate: 61-90 -> 101-200
        int moderate = aqiService.calculatePM25SubIndex(75);
        assertTrue(moderate >= 101 && moderate <= 200);

        // Poor: 91-120 -> 201-300
        int poor = aqiService.calculatePM25SubIndex(105);
        assertTrue(poor >= 201 && poor <= 300);

        // Very Poor: 121-250 -> 301-400
        int veryPoor = aqiService.calculatePM25SubIndex(180);
        assertTrue(veryPoor >= 301 && veryPoor <= 400);

        // Severe: >250 -> 401-500
        int severe = aqiService.calculatePM25SubIndex(300);
        assertTrue(severe >= 401 && severe <= 500);
    }

    @Test
    void testCategoryClassification() {
        assertEquals(AqiReading.Category.GOOD, aqiService.getCategory(35));
        assertEquals(AqiReading.Category.SATISFACTORY, aqiService.getCategory(85));
        assertEquals(AqiReading.Category.MODERATE, aqiService.getCategory(165));
        assertEquals(AqiReading.Category.POOR, aqiService.getCategory(285));
        assertEquals(AqiReading.Category.VERY_POOR, aqiService.getCategory(345));
        assertEquals(AqiReading.Category.SEVERE, aqiService.getCategory(440));
    }

    @Test
    void testDominantPollutantAndOverallAqi() {
        // PM2.5 = 110 (Poor ~267), PM10 = 80 (Satisfactory ~80)
        Map<String, Integer> subIndices = aqiService.calculateAllSubIndices(
                110.0, 80.0, 30.0, 20.0, 1.2, 35.0);

        assertEquals("PM2.5", aqiService.determineDominantPollutant(subIndices));
        assertTrue(aqiService.calculateOverallAqi(subIndices) >= 201);
    }
}
