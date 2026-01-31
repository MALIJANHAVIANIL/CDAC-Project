package com.elevateconnect.controller;

import com.elevateconnect.model.Notification;
import com.elevateconnect.model.User;
import com.elevateconnect.repository.NotificationRepository;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        // Auto-generate some dummy notifications if empty (for demo)
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        if (notifications.isEmpty()) {
            createDemoNotification(user, "Profile Complete", "You reached 85% profile completion!", "SUCCESS");
            createDemoNotification(user, "New Drive: Google", "Software Engineer Role posted.", "ALERT");
            notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        }

        return ResponseEntity.ok(notifications);
    }

    private void createDemoNotification(User user, String title, String message, String type) {
        Notification n = new Notification();
        n.setUser(user);
        n.setMessage(title + ": " + message);
        n.setType(type);
        notificationRepository.save(n);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok().build();
    }
}
