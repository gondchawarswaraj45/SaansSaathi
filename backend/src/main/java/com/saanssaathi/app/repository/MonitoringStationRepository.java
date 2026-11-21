package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.MonitoringStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MonitoringStationRepository extends JpaRepository<MonitoringStation, Long> {
    List<MonitoringStation> findByCityId(Integer cityId);
    Optional<MonitoringStation> findByOpenaqId(String openaqId);
    List<MonitoringStation> findByIsActiveTrue();
    List<MonitoringStation> findByLatitudeBetweenAndLongitudeBetween(Double swLat, Double neLat, Double swLng, Double neLng);
}
