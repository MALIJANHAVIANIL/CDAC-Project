package com.elevateconnect.service;

import com.elevateconnect.model.Notification;
import com.elevateconnect.model.Role;
import com.elevateconnect.model.User;
import com.elevateconnect.repository.NotificationRepository;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void notifyAllStudents(String message, String type) {
        List<User> students = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .toList();

        for (User student : students) {
            Notification notification = new Notification();
            notification.setUser(student);
            notification.setMessage(message);
            notification.setType(type);
            notificationRepository.save(notification);
        }
    }

    public void notifyUser(User user, String message, String type) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);
    }
}
