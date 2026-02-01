package com.elevateconnect.controller;

import com.elevateconnect.dto.MessageResponse;
import com.elevateconnect.model.User;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    UserRepository userRepository;

    private final Path fileStorageLocation;

    public FileController() {
        this.fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("File Controller is working");
    }

    @PostMapping("/upload/resume")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        System.out.println("Received file upload request: " + file.getOriginalFilename());
        try {
            // Get current user
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                    .getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

            // Convert to Base64
            String contentType = file.getContentType();
            if (contentType == null || contentType.isEmpty()) {
                contentType = "application/pdf"; // Default to PDF for resumes
            }

            String base64Content = java.util.Base64.getEncoder().encodeToString(file.getBytes());
            // Create Data URI: data:[<mediatype>][;base64],<data>
            String dataUri = "data:" + contentType + ";base64," + base64Content;

            // Save Base64 string to database
            user.setResumeData(dataUri);
            userRepository.save(user);
            System.out.println(">>> RESUME UPLOAD: Saved " + file.getOriginalFilename() + " as Base64 ("
                    + dataUri.length() + " chars)");

            return ResponseEntity.ok(new MessageResponse(dataUri));
        } catch (IOException ex) {
            return ResponseEntity.badRequest().body(new MessageResponse("Could not process file. Please try again!"));
        }
    }

    @DeleteMapping("/delete/resume")
    public ResponseEntity<?> deleteResume() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        user.setResumeData(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Resume removed successfully!"));
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> downloadFile(@PathVariable String fileName,
            jakarta.servlet.http.HttpServletRequest request) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(
                    java.util.Objects.requireNonNull(filePath.toUri()));

            if (resource.exists()) {
                String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
