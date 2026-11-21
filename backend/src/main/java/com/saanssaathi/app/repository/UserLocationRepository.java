package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.UserLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {
    List<UserLocation> findByUserId(Long userId);
    Optional<UserLocation> findByUserIdAndIsPrimaryTrue(Long userId);
}
