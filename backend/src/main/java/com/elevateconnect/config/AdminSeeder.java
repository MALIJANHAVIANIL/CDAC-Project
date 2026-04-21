package com.elevateconnect.config;

import com.elevateconnect.model.Role;
import com.elevateconnect.model.User;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String email = "econnectelevate@gmail.com";
        String password = "tpo@123";

        try {
            User admin = userRepository.findByEmail(email).orElse(new User());

            admin.setEmail(email);
            // set name if new
            if (admin.getId() == null) {
                admin.setName("Main TPO Admin");
            }

            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole(Role.TPO);
            // Also give ADMIN access if needed, but the user said "tpo admin" and the
            // restricted login allows TPO or ADMIN.
            // Using TPO role is consistent with the "TPO Dashboard".

            userRepository.save(admin);
            System.out.println(">>> SEEDER: TPO Admin account synced: " + email);
        } catch (Exception e) {
            System.err.println(">>> SEEDER ERROR: Failed to seed admin account. " + e.getMessage());
        }
    }
}
