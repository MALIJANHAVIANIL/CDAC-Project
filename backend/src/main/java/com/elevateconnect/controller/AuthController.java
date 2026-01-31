package com.elevateconnect.controller;

import com.elevateconnect.config.JwtUtils;
import com.elevateconnect.dto.JwtResponse;
import com.elevateconnect.dto.LoginRequest;
import com.elevateconnect.dto.MessageResponse;
import com.elevateconnect.dto.SignupRequest;
import com.elevateconnect.model.User;
import com.elevateconnect.repository.UserRepository;
import com.elevateconnect.repository.PlacementDriveRepository;
import com.elevateconnect.repository.ApplicationRepository;
import java.util.Map;
import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    PlacementDriveRepository placementDriveRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getPublicStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("drives", placementDriveRepository.count());
        stats.put("placed", applicationRepository.countByStatus(com.elevateconnect.model.ApplicationStatus.Selected));
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal(); // This is the Spring Security User
            // We need the actual User entity to get extra fields like branch, cgpa
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.getBranch(),
                    user.getCgpa(),
                    user.getStudentId(),
                    user.getResumeUrl()));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            // Distinguish between empty DB (User not found) and wrong password?
            // Spring Security's DaoAuthenticationProvider throws BadCredentialsException
            // for both by default to prevent enumeration.
            // But we can check if user exists to provide "User not found" hint if desired
            // (less secure but requested by user)
            if (!userRepository.existsByEmail(loginRequest.getEmail())) {
                return ResponseEntity.status(401).body(new MessageResponse("Error: User not found! Please register."));
            }
            return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid password!"));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody SignupRequest updateRequest) {
        // In a real app, get user from SecurityContext
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updateRequest.getName());
        user.setBranch(updateRequest.getBranch());
        user.setCgpa(updateRequest.getCgpa());
        user.setPhone(updateRequest.getPhone());
        if (updateRequest.getStudentId() != null)
            user.setStudentId(updateRequest.getStudentId());
        if (updateRequest.getResumeUrl() != null)
            user.setResumeUrl(updateRequest.getResumeUrl());

        // Optional: Update password if provided
        if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(updateRequest.getPassword()));
        }

        userRepository.save(user);

        return ResponseEntity.ok(new JwtResponse(
                null,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getBranch(),
                user.getCgpa(),
                user.getStudentId(),
                user.getResumeUrl()));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole());
        user.setBranch(signUpRequest.getBranch());
        user.setCgpa(signUpRequest.getCgpa());
        user.setPhone(signUpRequest.getPhone());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
