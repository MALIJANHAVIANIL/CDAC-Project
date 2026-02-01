package com.elevateconnect.controller;

import com.elevateconnect.model.PlacementDrive;
import com.elevateconnect.model.Application;
import com.elevateconnect.repository.PlacementDriveRepository;
import com.elevateconnect.repository.ApplicationRepository;
import com.elevateconnect.model.ApprovalStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/drives")
public class DriveController {

    @Autowired
    PlacementDriveRepository driveRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    @GetMapping
    public List<PlacementDrive> getAllDrives() {
        // Only return approved drives for students
        return driveRepository.findAll().stream()
                .filter(drive -> drive.getApprovalStatus() == ApprovalStatus.APPROVED)
                .toList();
    }

    @GetMapping("/all")
    public List<PlacementDrive> getAllDrivesForAdmin() {
        org.springframework.security.core.userdetails.UserDetails userDetails = (org.springframework.security.core.userdetails.UserDetails) org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        if (currentUser.getRole() == com.elevateconnect.model.Role.HR) {
            return driveRepository.findByCreatedBy(currentUser);
        }
        // TPO/ADMIN see all
        return driveRepository.findAll();
    }

    @GetMapping("/active")
    public List<PlacementDrive> getActiveDrives() {
        // Only return approved and active drives
        return driveRepository.findByDeadlineAfter(LocalDate.now().minusDays(1)).stream()
                .filter(drive -> drive.getApprovalStatus() == ApprovalStatus.APPROVED)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlacementDrive> getDriveById(@PathVariable long id) {
        return driveRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public PlacementDrive createDrive(@RequestBody PlacementDrive drive) {
        org.springframework.security.core.userdetails.UserDetails userDetails = (org.springframework.security.core.userdetails.UserDetails) org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        drive.setCreatedBy(currentUser);
        return driveRepository.save(drive);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlacementDrive> updateDrive(@PathVariable long id, @RequestBody PlacementDrive driveDetails) {
        return driveRepository.findById(id)
                .map(drive -> {
                    drive.setCompanyName(driveDetails.getCompanyName());
                    drive.setRole(driveDetails.getRole());
                    drive.setPackageValue(driveDetails.getPackageValue());
                    drive.setLocation(driveDetails.getLocation());
                    drive.setDate(driveDetails.getDate());
                    drive.setDeadline(driveDetails.getDeadline());
                    drive.setDescription(driveDetails.getDescription());
                    drive.setEligibility(driveDetails.getEligibility());
                    drive.setType(driveDetails.getType());
                    return ResponseEntity.ok(driveRepository.save(drive));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteDrive(@PathVariable long id) {
        return driveRepository.findById(id)
                .map(drive -> {
                    // Delete all applications for this drive first
                    List<Application> applications = applicationRepository.findByDriveId(id);
                    if (!applications.isEmpty()) {
                        applicationRepository.deleteAll(applications);
                        applicationRepository.flush(); // Ensure they are deleted from DB
                    }

                    driveRepository.delete(drive);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
