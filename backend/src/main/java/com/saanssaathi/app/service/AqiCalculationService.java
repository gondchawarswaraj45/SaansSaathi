package com.saanssaathi.app.service;

import com.saanssaathi.app.model.entity.AqiReading;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Service to compute Indian National Air Quality Index (CPCB standard)
 * uses sub-index piecewise linear interpolation:
 * Ip = [(IHi - ILo) / (BPHi - BPLo)] * (Cp - BPLo) + ILo
 */
@Service
public class AqiCalculationService {

    public int calculatePM25SubIndex(double concentration) {
        if (concentration < 0) return 0;
        if (concentration <= 30) {
            return interpolate(concentration, 0, 30, 0, 50);
        } else if (concentration <= 60) {
            return interpolate(concentration, 30, 60, 51, 100);
        } else if (concentration <= 90) {
            return interpolate(concentration, 60, 90, 101, 200);
        } else if (concentration <= 120) {
            return interpolate(concentration, 90, 120, 201, 300);
        } else if (concentration <= 250) {
            return interpolate(concentration, 120, 250, 301, 400);
        } else {
            return Math.min(500, interpolate(concentration, 250, 380, 401, 500));
        }
    }

    public int calculatePM10SubIndex(double concentration) {
        if (concentration < 0) return 0;
        if (concentration <= 50) {
            return interpolate(concentration, 0, 50, 0, 50);
        } else if (concentration <= 100) {
            return interpolate(concentration, 50, 100, 51, 100);
        } else if (concentration <= 250) {
            return interpolate(concentration, 100, 250, 101, 200);
        } else if (concentration <= 350) {
            return interpolate(concentration, 250, 350, 201, 300);
        } else if (concentration <= 430) {
            return interpolate(concentration, 350, 430, 301, 400);
        } else {
            return Math.min(500, interpolate(concentration, 430, 510, 401, 500));
        }
    }

    public int calculateNO2SubIndex(double concentration) {
        if (concentration < 0) return 0;
        if (concentration <= 40) {
            return interpolate(concentration, 0, 40, 0, 50);
        } else if (concentration <= 80) {
            return interpolate(concentration, 40, 80, 51, 100);
        } else if (concentration <= 180) {
            return interpolate(concentration, 80, 180, 101, 200);
        } else if (concentration <= 280) {
            return interpolate(concentration, 180, 280, 201, 300);
        } else if (concentration <= 400) {
            return interpolate(concentration, 280, 400, 301, 400);
        } else {
            return Math.min(500, interpolate(concentration, 400, 500, 401, 500));
        }
    }

    public int calculateSO2SubIndex(double concentration) {
        if (concentration < 0) return 0;
        if (concentration <= 40) {
            return interpolate(concentration, 0, 40, 0, 50);
        } else if (concentration <= 80) {
            return interpolate(concentration, 40, 80, 51, 100);
        } else if (concentration <= 380) {
            return interpolate(concentration, 80, 380, 101, 200);
        } else if (concentration <= 800) {
            return interpolate(concentration, 380, 800, 201, 300);
        } else if (concentration <= 1600) {
            return interpolate(concentration, 800, 1600, 301, 400);
        } else {
            return Math.min(500, interpolate(concentration, 1600, 2100, 401, 500));
        }
    }

    public int calculateCOSubIndex(double concentration) {
        if (concentration < 0) return 0;
        if (concentration <= 1.0) {
            return interpolate(concentration, 0, 1.0, 0, 50);
        } else if (concentration <= 2.0) {
            return interpolate(concentration, 1.0, 2.0, 51, 100);
        } else if (concentration <= 10.0) {
            return interpolate(concentration, 2.0, 10.0, 101, 200);
        } else if (concentration <= 17.0) {
            return interpolate(concentration, 10.0, 17.0, 201, 300);
        } else if (concentration <= 34.0) {
            return interpolate(concentration, 17.0, 34.0, 301, 400);
        } else {
            return Math.min(500, interpolate(concentration, 34.0, 45.0, 401, 500));
        }
    }

    public int calculateO3SubIndex(double concentration) {
        if (concentration < 0) return 0;
        if (concentration <= 50) {
            return interpolate(concentration, 0, 50, 0, 50);
        } else if (concentration <= 100) {
            return interpolate(concentration, 50, 100, 51, 100);
        } else if (concentration <= 168) {
            return interpolate(concentration, 100, 168, 101, 200);
        } else if (concentration <= 208) {
            return interpolate(concentration, 168, 208, 201, 300);
        } else if (concentration <= 748) {
            return interpolate(concentration, 208, 748, 301, 400);
        } else {
            return Math.min(500, interpolate(concentration, 748, 1000, 401, 500));
        }
    }

    public AqiReading.Category getCategory(int aqi) {
        if (aqi <= 50) return AqiReading.Category.GOOD;
        if (aqi <= 100) return AqiReading.Category.SATISFACTORY;
        if (aqi <= 200) return AqiReading.Category.MODERATE;
        if (aqi <= 300) return AqiReading.Category.POOR;
        if (aqi <= 400) return AqiReading.Category.VERY_POOR;
        return AqiReading.Category.SEVERE;
    }

    public Map<String, Integer> calculateAllSubIndices(
            Double pm25, Double pm10, Double no2, Double so2, Double co, Double o3) {
        Map<String, Integer> subIndices = new HashMap<>();
        if (pm25 != null) subIndices.put("PM2.5", calculatePM25SubIndex(pm25));
        if (pm10 != null) subIndices.put("PM10", calculatePM10SubIndex(pm10));
        if (no2 != null) subIndices.put("NO2", calculateNO2SubIndex(no2));
        if (so2 != null) subIndices.put("SO2", calculateSO2SubIndex(so2));
        if (co != null) subIndices.put("CO", calculateCOSubIndex(co));
        if (o3 != null) subIndices.put("O3", calculateO3SubIndex(o3));
        return subIndices;
    }

    public String determineDominantPollutant(Map<String, Integer> subIndices) {
        if (subIndices == null || subIndices.isEmpty()) return "PM2.5";
        return subIndices.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("PM2.5");
    }

    public int calculateOverallAqi(Map<String, Integer> subIndices) {
        if (subIndices == null || subIndices.isEmpty()) return 0;
        return Collections.max(subIndices.values());
    }

    private int interpolate(double cp, double bplo, double bphi, int ilo, int ihi) {
        double result = ((double) (ihi - ilo) / (bphi - bplo)) * (cp - bplo) + ilo;
        return (int) Math.round(result);
    }
}
