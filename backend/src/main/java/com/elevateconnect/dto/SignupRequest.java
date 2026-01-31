package com.elevateconnect.dto;

import com.elevateconnect.model.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String branch;
    private Double cgpa;
    private String phone;
    private String studentId;
    private String resumeUrl;
}
