package com.gigmate.backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "free_days")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreeDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Connects this date to a specific student
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The calendar date the student toggled as "Free"
    @Column(name = "available_date", nullable = false)
    private LocalDate availableDate;
}
