package com.gigmate.backend.controllers;

import com.gigmate.backend.models.Application;
import com.gigmate.backend.repositories.ApplicationRepository;
import com.gigmate.backend.repositories.UserRepository;
import com.gigmate.backend.services.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reporting")
@RequiredArgsConstructor
public class ReportingController {

    private final CertificateService certificateService;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    // Endpoint 1: Fetches analytical history summary list for student dashboard statistics
    @GetMapping("/student/summary")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<List<Application>> getStudentGigHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false, defaultValue = "COMPLETED") String status
    ) {
        var user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User context context failed"));
        return ResponseEntity.ok(applicationRepository.findByStudentIdAndStatus(user.getId(), status));
    }

    // Endpoint 2: Generates and streams raw PDF binary bytes layout straight into active user sessions
    @GetMapping("/certificate/{applicationId}")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<byte[]> downloadCertificate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long applicationId
    ) {
        try {
            byte[] contents = certificateService.generateGigCertificate(userDetails.getUsername(), applicationId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "GigMate_Certificate_" + applicationId + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return ResponseEntity.ok().headers(headers).body(contents);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage().getBytes());
        }
    }
}
