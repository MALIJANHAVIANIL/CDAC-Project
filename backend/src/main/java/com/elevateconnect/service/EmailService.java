package com.elevateconnect.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void sendDriveAlert(List<String> recipients, String companyName, String role) {
        System.out.println(">>> EMAIL SERVICE: Attempting to send emails to " + recipients.size() + " recipients");

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(senderEmail);
        message.setSubject("New Placement Drive Alert: " + companyName);
        message.setText("Dear Student,\n\n" +
                "A new placement drive has been announced!\n\n" +
                "Company: " + companyName + "\n" +
                "Role: " + role + "\n\n" +
                "Login to your portal to view details and apply.\n\n" +
                "Best Regards,\n" +
                "ElevateConnect Placement Cell");

        // Send to each recipient
        // In production, BCC or batch sending is better, but this is simple for now
        for (String recipient : recipients) {
            try {
                System.out.println(">>> EMAIL SERVICE: Sending to " + recipient);
                message.setTo(recipient);
                javaMailSender.send(message);
                System.out.println(">>> EMAIL SERVICE: Successfully sent to " + recipient);
            } catch (Exception e) {
                System.err.println(
                        ">>> EMAIL SERVICE ERROR: Failed to send email to: " + recipient + " Error: " + e.getMessage());
                e.printStackTrace();
            }
        }
        System.out.println(">>> EMAIL SERVICE: Finished sending all emails");
    }
}
