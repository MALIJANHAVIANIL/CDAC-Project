package com.elevateconnect.controller;

import com.elevateconnect.model.ApplicationStatus;
import com.elevateconnect.model.Role;

import com.elevateconnect.repository.ApplicationRepository;
import com.elevateconnect.repository.PlacementDriveRepository;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PlacementDriveRepository driveRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        return getStudentStats(); // Re-use logic or keep separate admin stats
    }

    @GetMapping("/student-stats")
    public ResponseEntity<?> getStudentStats() {
        Map<String, Object> stats = new HashMap<>();

        // Basic stats for student dashboard
        stats.put("totalApplications", applicationRepository.count()); // Should filter by User ID in real app
        stats.put("drivesEligible", driveRepository.count()); // Simplified
        stats.put("interviewsScheduled", 0);
        stats.put("offersReceived", applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == ApplicationStatus.Selected)
                .count());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/tpo-stats")
    public ResponseEntity<?> getTpoStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total students with STUDENT role
        long totalStudents = userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole() == Role.STUDENT)
                .count();

        // Placed students (those with Selected applications)
        long placedStudents = applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == ApplicationStatus.Selected)
                .map(a -> a.getUser().getId())
                .distinct()
                .count();

        // Active drives
        long activeDrives = driveRepository.count();

        // Average package (simplified - you might want to add package field to
        // PlacementDrive)
        String avgPackage = "0 LPA"; // Placeholder - implement based on your data model

        stats.put("totalStudents", totalStudents);
        stats.put("placedStudents", placedStudents);
        stats.put("activeDrives", activeDrives);
        stats.put("avgPackage", avgPackage);

        return ResponseEntity.ok(stats);
    }
}
