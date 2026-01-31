package com.elevateconnect.controller;

import com.elevateconnect.model.PlacementDrive;
import com.elevateconnect.repository.PlacementDriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/drives")
public class DriveController {

    @Autowired
    PlacementDriveRepository driveRepository;

    @GetMapping
    public List<PlacementDrive> getAllDrives() {
        // Only return approved drives for students
        return driveRepository.findAll().stream()
                .filter(drive -> drive.getApprovalStatus() == com.elevateconnect.model.ApprovalStatus.APPROVED)
                .toList();
    }

    @GetMapping("/all")
    public List<PlacementDrive> getAllDrivesForAdmin() {
        // Return all drives for HR/TPO
        return driveRepository.findAll();
    }

    @GetMapping("/active")
    public List<PlacementDrive> getActiveDrives() {
        // Only return approved and active drives
        return driveRepository.findByDeadlineAfter(LocalDate.now().minusDays(1)).stream()
                .filter(drive -> drive.getApprovalStatus() == com.elevateconnect.model.ApprovalStatus.APPROVED)
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
    public ResponseEntity<?> deleteDrive(@PathVariable long id) {
        return driveRepository.findById(id)
                .map(drive -> {
                    driveRepository.delete(drive);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
