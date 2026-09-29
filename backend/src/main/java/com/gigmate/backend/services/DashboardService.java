package com.gigmate.backend.services;

import com.gigmate.backend.models.*;
import com.gigmate.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FreeDayRepository freeDayRepository;
    private final GigRepository gigRepository;
    private final UserRepository userRepository;

    public FreeDay addFreeDay(String email, LocalDate date) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        FreeDay freeDay = FreeDay.builder()
                .user(user)
                .availableDate(date)
                .build();
        return freeDayRepository.save(freeDay);
    }

    public List<FreeDay> getStudentFreeDays(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return freeDayRepository.findByUserId(user.getId());
    }

    public Gig createGig(String recruiterEmail, Gig gigData) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        gigData.setRecruiter(recruiter);
        gigData.setStatus("OPEN");
        return gigRepository.save(gigData);
    }

    public List<Gig> findMatchingGigsForStudent(String email, LocalDate date, String category) {
        return gigRepository.findByGigDateAndCategory(date, category);
    }
    private final ApplicationRepository applicationRepository;

    public Application applyForGig(String studentEmail, Long gigId) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Gig gig = gigRepository.findById(gigId)
                .orElseThrow(() -> new RuntimeException("Gig campaign not found"));

        // Build and save the application record
        Application application = Application.builder()
                .student(student)
                .gig(gig)
                .status("PENDING")
                .build();

        return applicationRepository.save(application);
    }
    public Application updateApplicationStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application tracking record not found"));

        // Update to HIRED, APPROVED, REJECTED, etc.
        application.setStatus(status.toUpperCase());
        return applicationRepository.save(application);
    }

}
