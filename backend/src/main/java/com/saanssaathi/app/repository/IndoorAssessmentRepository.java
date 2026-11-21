package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.IndoorAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IndoorAssessmentRepository extends JpaRepository<IndoorAssessment, Long> {
    Optional<IndoorAssessment> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    List<IndoorAssessment> findByUserIdOrderByCreatedAtDesc(Long userId);
}
