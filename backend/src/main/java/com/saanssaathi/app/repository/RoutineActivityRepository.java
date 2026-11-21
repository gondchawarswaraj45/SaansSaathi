package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.RoutineActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoutineActivityRepository extends JpaRepository<RoutineActivity, Long> {
    List<RoutineActivity> findByRoutineIdOrderByStartTimeAsc(Long routineId);
    Optional<RoutineActivity> findByIdAndRoutineId(Long id, Long routineId);
}
