package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.Pollutant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PollutantRepository extends JpaRepository<Pollutant, Integer> {
    Optional<Pollutant> findByCodeIgnoreCase(String code);
}
