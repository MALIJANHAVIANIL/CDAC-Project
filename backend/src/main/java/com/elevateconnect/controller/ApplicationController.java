package com.elevateconnect.controller;

import com.elevateconnect.model.Application;
import com.elevateconnect.model.ApplicationStatus;
import com.elevateconnect.model.PlacementDrive;
import com.elevateconnect.model.User;
import com.elevateconnect.repository.ApplicationRepository;
import com.elevateconnect.repository.PlacementDriveRepository;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PlacementDriveRepository driveRepository;

    @PostMapping("/apply")
    public ResponseEntity<?> applyForDrive(@RequestParam long userId, @RequestParam long driveId) {
        if (applicationRepository.findByUserIdAndDriveId(userId, driveId).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Already applied"));
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        Application app = new Application();
        app.setUser(user);
        app.setDrive(drive);
        app.setStatus(ApplicationStatus.Applied);

        applicationRepository.save(app);
        return ResponseEntity.ok(Map.of("message", "Applied successfully"));
    }

    @GetMapping("/user/{userId}")
    public List<Application> getUserApplications(@PathVariable long userId) {
        return applicationRepository.findByUserId(userId);
    }

    @GetMapping("/drive/{driveId}")
    public List<Application> getApplicationsByDrive(@PathVariable long driveId) {
        return applicationRepository.findByDriveId(driveId);
    }

    @GetMapping("/all")
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(@PathVariable long id, @RequestBody Map<String, String> payload) {
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(ApplicationStatus.valueOf(payload.get("status")));
            applicationRepository.save(app);
            return ResponseEntity.ok(app);
        }).orElse(ResponseEntity.notFound().build());
    }
}
