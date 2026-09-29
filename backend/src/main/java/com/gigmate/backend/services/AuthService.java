package com.gigmate.backend.services;

import com.gigmate.backend.dto.LoginRequest;
import com.gigmate.backend.dto.JwtResponse;
import com.gigmate.backend.dto.RegisterRequest;
import com.gigmate.backend.models.Role;
import com.gigmate.backend.models.StudentProfile;
import com.gigmate.backend.models.User;
import com.gigmate.backend.repositories.StudentProfileRepository;
import com.gigmate.backend.repositories.UserRepository;
import com.gigmate.backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional
    public String registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .isVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        if (registerRequest.getRole() == Role.ROLE_STUDENT) {
            StudentProfile profile = StudentProfile.builder()
                    .user(savedUser)
                    .collegeName(registerRequest.getCollegeName() != null ? registerRequest.getCollegeName() : "Unknown College")
                    .interests(registerRequest.getInterests())
                    .build();
            studentProfileRepository.save(profile);
        }

        return "User registered successfully!";
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Error: Invalid credentials!");
        }

        String token = jwtUtils.generateTokenFromUsername(user.getEmail());

        return new JwtResponse(token, user.getEmail(), user.getRole().name());
    }
}
