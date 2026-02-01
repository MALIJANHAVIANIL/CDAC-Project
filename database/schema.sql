-- ElevateConnect Database Schema
-- Generated for project setup and portability

CREATE DATABASE IF NOT EXISTS elevateconnect;
USE elevateconnect;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'ADMIN', 'TPO', 'ALUMNI', 'HR') NOT NULL,
    branch VARCHAR(255),
    cgpa DOUBLE,
    phone VARCHAR(20),
    about TEXT,
    skills TEXT,
    experience TEXT,
    account_status ENUM('ACTIVE', 'BANNED', 'SUSPENDED') DEFAULT 'ACTIVE',
    student_id VARCHAR(50) UNIQUE,
    resume_url VARCHAR(255),
    backlogs INT DEFAULT 0,
    attendance DOUBLE,
    tenth_marks DOUBLE,
    twelfth_marks DOUBLE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    credits INT,
    semester INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. User-Courses Join Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS user_courses (
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. Placement Drives Table
CREATE TABLE IF NOT EXISTS placement_drives (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    package_value VARCHAR(100),
    deadline DATE,
    type VARCHAR(100),
    approval_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    description TEXT,
    eligibility TEXT,
    created_by BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(50) DEFAULT 'Applied',
    resume VARCHAR(255),
    user_id BIGINT NOT NULL,
    drive_id BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (drive_id) REFERENCES placement_drives(id) ON DELETE CASCADE
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Chats Table
CREATE TABLE IF NOT EXISTS chats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    media_url VARCHAR(255),
    media_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255),
    role VARCHAR(255),
    question TEXT,
    answer TEXT,
    difficulty VARCHAR(50),
    category VARCHAR(255),
    helpful_count INT DEFAULT 0,
    user_id BIGINT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Question Liked By Users (ElementCollection)
CREATE TABLE IF NOT EXISTS question_liked_by_users (
    question_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    PRIMARY KEY (question_id, user_id),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Initial Seed Data
INSERT INTO users (name, email, password, role) VALUES 
('System Admin', 'admin@elevateconnect.com', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2NvEhK1C.T2m96YfP3z.V6/Pzmx.E/a', 'ADMIN'),
('TPO Officer', 'tpo@elevateconnect.com', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2NvEhK1C.T2m96YfP3z.V6/Pzmx.E/a', 'TPO'),
('Google HR', 'hr@google.com', '$2a$10$8.UnVuG9HHgffUDAlk8Kn.2NvEhK1C.T2m96YfP3z.V6/Pzmx.E/a', 'HR');

INSERT INTO courses (name, code, description, credits, semester) VALUES 
('Advanced Java', 'CS-401', 'Spring Boot and Hibernate', 4, 7),
('Cloud Computing', 'CS-402', 'AWS and Azure fundamentals', 3, 7);
