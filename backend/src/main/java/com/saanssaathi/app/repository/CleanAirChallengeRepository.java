package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.CleanAirChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CleanAirChallengeRepository extends JpaRepository<CleanAirChallenge, Integer> {
    List<CleanAirChallenge> findByIsActiveTrue();
    List<CleanAirChallenge> findByCategoryAndIsActiveTrue(CleanAirChallenge.ChallengeCategory category);
}
