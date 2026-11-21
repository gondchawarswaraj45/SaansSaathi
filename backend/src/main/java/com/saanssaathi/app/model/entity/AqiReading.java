package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "aqi_readings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AqiReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id", nullable = false)
    private MonitoringStation station;

    @Column(name = "aqi_value", nullable = false)
    private Integer aqiValue;

    @Enumerated(EnumType.STRING)
    @Column(name = "aqi_category", nullable = false)
    private Category aqiCategory;

    @Column(name = "dominant_pollutant", length = 20)
    private String dominantPollutant;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String source = "OPENAQ";

    @Column(name = "measured_at", nullable = false)
    private LocalDateTime measuredAt;

    @CreationTimestamp
    @Column(name = "fetched_at", nullable = false, updatable = false)
    private LocalDateTime fetchedAt;

    public enum Category {
        GOOD,
        SATISFACTORY,
        MODERATE,
        POOR,
        VERY_POOR,
        SEVERE
    }
}
