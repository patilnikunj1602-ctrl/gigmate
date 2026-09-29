package com.gigmate.backend.repositories;

import com.gigmate.backend.models.Gig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GigRepository extends JpaRepository<Gig, Long> {
    List<Gig> findByGigDateAndCategory(LocalDate gigDate, String category);
    List<Gig> findByRecruiterId(Long recruiterId);
}
