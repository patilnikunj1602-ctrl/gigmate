package com.gigmate.backend.repositories;

import com.gigmate.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Used during login to look up account credentials
    Optional<User> findByEmail(String email);

    // Used during registration to check for duplicate accounts
    Boolean existsByEmail(String email);
}
