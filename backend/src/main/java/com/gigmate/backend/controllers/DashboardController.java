package com.gigmate.backend.controllers;

import com.gigmate.backend.models.Application;
import com.gigmate.backend.models.FreeDay;
import com.gigmate.backend.models.Gig;
import com.gigmate.backend.models.User;
import com.gigmate.backend.repositories.ApplicationRepository;
import com.gigmate.backend.repositories.GigRepository;
import com.gigmate.backend.repositories.UserRepository;
import com.gigmate.backend.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final GigRepository gigRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    // ==========================================
    // 📅 STUDENT ENDPOINTS (Calendar & Gigs)
    // ==========================================

    /**
     * Endpoint 1: Toggle an available free day for a student calendar matrix.
     */
    @PostMapping("/student/free-days")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> toggleFreeDay(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        try {
            FreeDay freeDay = dashboardService.addFreeDay(userDetails.getUsername(), date);
            return ResponseEntity.ok(freeDay);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint 2: Retrieves the list of all registered free availability dates for the active student.
     */
    @GetMapping("/student/free-days")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<List<FreeDay>> getMyFreeDays(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(dashboardService.getStudentFreeDays(userDetails.getUsername()));
    }

    /**
     * Endpoint 3: Core Matching Engine. Fetches published gigs matching specific date and domain category parameters.
     */
    @GetMapping("/student/gigs/match")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<List<Gig>> getMatchedGigs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam String category
    ) {
        return ResponseEntity.ok(dashboardService.findMatchingGigsForStudent(null, date, category));
    }

    /**
     * Endpoint 4: Submits a structural job application string payload, mapping student profile row indexes directly to a gig ID.
     */
    @PostMapping("/student/gigs/{gigId}/apply")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> applyToGig(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long gigId
    ) {
        try {
            Application application = dashboardService.applyForGig(userDetails.getUsername(), gigId);
            return ResponseEntity.ok(application);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==========================================
    // 💼 RECRUITER ENDPOINTS (Campaign Tracking)
    // ==========================================

    /**
     * Endpoint 5: Publishes an active recruiter performance shift listing onto the ecosystem match engines.
     */
    @PostMapping("/recruiter/gigs")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<?> postGig(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Gig gig
    ) {
        try {
            Gig newGig = dashboardService.createGig(userDetails.getUsername(), gig);
            return ResponseEntity.ok(newGig);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Endpoint 6: Fetches all gig campaigns explicitly published by the logging recruiter entity context.
     */
    @GetMapping("/recruiter/gigs")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<List<Gig>> getRecruiterGigs(@AuthenticationPrincipal UserDetails userDetails) {
        User recruiter = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Recruiter session details mapping failure"));
        return ResponseEntity.ok(gigRepository.findByRecruiterId(recruiter.getId()));
    }

    /**
     * Endpoint 7: Live Applicant Tracking Engine. Streams incoming student row data mappings and unique Application IDs.
     */
    @GetMapping("/recruiter/gigs/{gigId}/applications")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<List<Application>> getGigApplications(@PathVariable Long gigId) {
        return ResponseEntity.ok(applicationRepository.findByGigId(gigId));
    }
    /**
     * Endpoint 8: Updates a student's gig application status (e.g., PENDING -> HIRED / APPROVED).
     */
    @PutMapping("/recruiter/applications/{applicationId}/status")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long applicationId,
            @RequestParam String status
    ) {
        try {
            Application updatedApp = dashboardService.updateApplicationStatus(applicationId, status);
            return ResponseEntity.ok(updatedApp);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    /**
     * Endpoint 9: Retrieves all gig applications submitted by the logged-in student to check hiring status.
     */
    @GetMapping("/student/applications")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        User student = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Student context not found"));
        return ResponseEntity.ok(applicationRepository.findByStudentId(student.getId()));
    }

}
