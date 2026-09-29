package com.gigmate.backend.repositories;

import com.gigmate.backend.models.FreeDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface FreeDayRepository extends JpaRepository<FreeDay, Long> {
    // Finds all specific dates a user marked themselves free
    List<FreeDay> findByUserId(Long userId);

    // Finds if a specific student is free on a given gig date
    boolean existsByUserIdAndAvailableDate(Long userId, LocalDate date);
}
