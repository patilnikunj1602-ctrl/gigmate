package com.gigmate.backend.repositories;

import com.gigmate.backend.models.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByGigId(Long gigId);

    // Core Reporting Lookups
    List<Application> findByStudentIdAndStatus(Long studentId, String status);
    Optional<Application> findByIdAndStudentId(Long id, Long studentId);
}
