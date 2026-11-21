package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {
    List<ChallengeParticipant> findByUserId(Long userId);
    List<ChallengeParticipant> findByUserIdAndIsCompletedFalse(Long userId);
    List<ChallengeParticipant> findByUserIdAndIsCompletedTrue(Long userId);
    Optional<ChallengeParticipant> findByUserIdAndChallengeId(Long userId, Integer challengeId);
    long countByUserIdAndIsCompletedTrue(Long userId);
}
