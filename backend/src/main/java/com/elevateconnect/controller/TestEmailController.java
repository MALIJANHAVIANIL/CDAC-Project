package com.elevateconnect.controller;

import com.elevateconnect.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestEmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-email")
    public String testEmail(@RequestBody TestEmailRequest request) {
        try {
            System.out.println(">>> TEST EMAIL: Sending test email to " + request.getEmail());
            emailService.sendDriveAlert(
                    List.of(request.getEmail()),
                    "Test Company",
                    "Test Role");
            return "Email sent successfully to " + request.getEmail();
        } catch (Exception e) {
            System.err.println(">>> TEST EMAIL ERROR: " + e.getMessage());
            e.printStackTrace();
            return "Failed to send email: " + e.getMessage();
        }
    }
}

class TestEmailRequest {
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
