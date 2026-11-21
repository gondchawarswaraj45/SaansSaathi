package com.saanssaathi.app.repository;

import com.saanssaathi.app.model.entity.DailyRoutine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyRoutineRepository extends JpaRepository<DailyRoutine, Long> {
    Optional<DailyRoutine> findByUserIdAndRoutineDate(Long userId, LocalDate routineDate);
    List<DailyRoutine> findByUserIdAndRoutineDateBetweenOrderByRoutineDateAsc(Long userId, LocalDate startDate, LocalDate endDate);
    List<DailyRoutine> findByUserIdOrderByRoutineDateDesc(Long userId);
}
