package com.gigmate.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Connects this profile directly to a User account
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "college_name", nullable = false)
    private String collegeName;

    // Stores student interest categories (e.g., "Concerts, Tech Expos, NGOs")
    @Column(columnDefinition = "TEXT")
    private String interests;
}
