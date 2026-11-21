package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "pollutants")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pollutant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "full_name", length = 200)
    private String fullName;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "cpcb_safe_limit", precision = 8, scale = 2)
    private BigDecimal cpcbSafeLimit;

    @Column(name = "who_guideline", precision = 8, scale = 2)
    private BigDecimal whoGuideline;

    @Column(columnDefinition = "TEXT")
    private String description;
}
