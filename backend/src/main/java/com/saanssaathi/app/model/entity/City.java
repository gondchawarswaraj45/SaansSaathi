package com.saanssaathi.app.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String country = "India";

    @Column(nullable = false, precision = 9, scale = 6)
    private Double latitude;

    @Column(nullable = false, precision = 9, scale = 6)
    private Double longitude;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
