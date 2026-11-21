package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "pollutant_readings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PollutantReading {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aqi_reading_id", nullable = false)
    private AqiReading aqiReading;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pollutant_id", nullable = false)
    private Pollutant pollutant;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal value;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "sub_index")
    private Integer subIndex;
}
