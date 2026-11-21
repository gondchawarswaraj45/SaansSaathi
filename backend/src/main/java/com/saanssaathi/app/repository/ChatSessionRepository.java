package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUserIdOrderByLastActiveDesc(Long userId);
    Optional<ChatSession> findByIdAndUserId(Long id, Long userId);
}
