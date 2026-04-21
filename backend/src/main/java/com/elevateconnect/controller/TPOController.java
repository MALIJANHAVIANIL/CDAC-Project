package com.elevateconnect.controller;

import com.elevateconnect.dto.MessageResponse;
import com.elevateconnect.model.*;
import com.elevateconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/tpo")
public class TPOController {

    @Autowired
    PlacementDriveRepository driveRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private com.elevateconnect.service.NotificationService notificationService;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    // ==================== JOB APPROVAL ====================

    @GetMapping("/drives/pending")
    public ResponseEntity<?> getPendingDrives() {
        List<PlacementDrive> pendingDrives = driveRepository.findAll().stream()
                .filter(drive -> drive.getApprovalStatus() == ApprovalStatus.PENDING)
                .toList();
        return ResponseEntity.ok(pendingDrives);
    }

    @PutMapping("/drives/{id}/approve")
    public ResponseEntity<?> approveDrive(@PathVariable Long id) {
        PlacementDrive drive = driveRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        // Get current TPO user
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User tpo = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("TPO user not found"));

        drive.setApprovalStatus(ApprovalStatus.APPROVED);
        drive.setReviewedBy(tpo);
        drive.setReviewedAt(LocalDateTime.now());
        driveRepository.save(drive);

        notificationService.notifyAllStudents(
                "New Drive: " + drive.getCompanyName() + " - " + drive.getRole() + " posted.",
                "INFO");

        return ResponseEntity.ok(new MessageResponse("Drive approved successfully!"));
    }

    @PutMapping("/drives/{id}/reject")
    public ResponseEntity<?> rejectDrive(@PathVariable Long id, @RequestBody Map<String, String> body) {
        PlacementDrive drive = driveRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Drive not found"));

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User tpo = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("TPO user not found"));

        drive.setApprovalStatus(ApprovalStatus.REJECTED);
        drive.setReviewedBy(tpo);
        drive.setReviewedAt(LocalDateTime.now());
        drive.setRejectionReason(body.get("reason"));
        driveRepository.save(drive);

        return ResponseEntity.ok(new MessageResponse("Drive rejected successfully!"));
    }

    // ==================== STUDENT MANAGEMENT ====================

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents(@RequestParam(required = false) String status) {
        List<User> students;
        if (status != null) {
            AccountStatus accountStatus = AccountStatus.valueOf(status.toUpperCase());
            students = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == Role.STUDENT && user.getAccountStatus() == accountStatus)
                    .toList();
        } else {
            students = userRepository.findAll().stream()
                    .filter(user -> user.getRole() == Role.STUDENT)
                    .toList();
        }
        return ResponseEntity.ok(students);
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<?> getStudentDetails(@PathVariable Long id) {
        User student = userRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Map<String, Object> details = new HashMap<>();
        details.put("student", student);
        details.put("applications", applicationRepository.findByUserId(java.util.Objects.requireNonNull(id)));
        details.put("assignedCourses", student.getAssignedCourses());

        return ResponseEntity.ok(details);
    }

    @PutMapping("/students/{id}/ban")
    public ResponseEntity<?> banStudent(@PathVariable Long id,
            @RequestBody(required = false) Map<String, String> body) {
        User student = userRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setAccountStatus(AccountStatus.BANNED);
        userRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Student account banned successfully!"));
    }

    @PutMapping("/students/{id}/activate")
    public ResponseEntity<?> activateStudent(@PathVariable Long id) {
        User student = userRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setAccountStatus(AccountStatus.ACTIVE);
        userRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Student account activated successfully!"));
    }

    // ==================== COURSE MANAGEMENT ====================

    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        if (courseRepository.findByCode(course.getCode()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Course code already exists!"));
        }

        Course savedCourse = courseRepository.save(course);
        return ResponseEntity.ok(savedCourse);
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getAllCourses(@RequestParam(required = false) Integer semester) {
        if (semester != null) {
            return ResponseEntity.ok(courseRepository.findBySemester(semester));
        }
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable Long id, @RequestBody Course courseUpdate) {
        Course course = courseRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setName(courseUpdate.getName());
        course.setDescription(courseUpdate.getDescription());
        course.setCredits(courseUpdate.getCredits());
        course.setSemester(courseUpdate.getSemester());

        courseRepository.save(course);
        return ResponseEntity.ok(course);
    }

    @DeleteMapping("/courses/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseRepository.deleteById(java.util.Objects.requireNonNull(id));
        return ResponseEntity.ok(new MessageResponse("Course deleted successfully!"));
    }

    @PostMapping("/courses/{courseId}/assign/{studentId}")
    public ResponseEntity<?> assignCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        Course course = courseRepository.findById(java.util.Objects.requireNonNull(courseId))
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User student = userRepository.findById(java.util.Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.getAssignedCourses().add(course);
        userRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Course assigned successfully!"));
    }

    @DeleteMapping("/courses/{courseId}/unassign/{studentId}")
    public ResponseEntity<?> unassignCourse(@PathVariable Long courseId, @PathVariable Long studentId) {
        Course course = courseRepository.findById(java.util.Objects.requireNonNull(courseId))
                .orElseThrow(() -> new RuntimeException("Course not found"));
        User student = userRepository.findById(java.util.Objects.requireNonNull(studentId))
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.getAssignedCourses().remove(course);
        userRepository.save(student);

        return ResponseEntity.ok(new MessageResponse("Course unassigned successfully!"));
    }
}
