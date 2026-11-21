package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.FamilyGroup;
import com.saanssaathi.app.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FamilyGroupRepository extends JpaRepository<FamilyGroup, Long> {
    Optional<FamilyGroup> findByUser(User user);
    Optional<FamilyGroup> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
