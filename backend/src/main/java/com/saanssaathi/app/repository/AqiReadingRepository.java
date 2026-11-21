package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.AqiReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AqiReadingRepository extends JpaRepository<AqiReading, Long> {
    Optional<AqiReading> findTopByStationIdOrderByMeasuredAtDesc(Long stationId);
    List<AqiReading> findByStationIdAndMeasuredAtAfterOrderByMeasuredAtAsc(Long stationId, LocalDateTime after);
}
