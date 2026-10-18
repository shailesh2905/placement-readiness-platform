-- ==========================================================
-- AI-Powered Placement Readiness & Skill Gap Recommendation Platform
-- Complete MySQL Workbench Database Initialization Script
-- ==========================================================

DROP DATABASE IF EXISTS placement_readiness_db;
CREATE DATABASE placement_readiness_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE placement_readiness_db;

-- 1. Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'MENTOR', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- 2. Student Profiles Table
CREATE TABLE profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    phone VARCHAR(20),
    location VARCHAR(255),
    target_role VARCHAR(255) DEFAULT 'Software Development Engineer',
    readiness_score DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_target_role (target_role),
    INDEX idx_readiness_score (readiness_score)
) ENGINE=InnoDB;

-- 3. Academic Education Table
CREATE TABLE educations (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL,
    degree VARCHAR(255) NOT NULL,
    university VARCHAR(255) NOT NULL,
    cgpa DECIMAL(4,2) NOT NULL,
    graduation_year INT NOT NULL,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    INDEX idx_cgpa (cgpa)
) ENGINE=InnoDB;

-- 4. Skills Catalog Table
CREATE TABLE skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('TECHNICAL', 'APTITUDE', 'COMMUNICATION') DEFAULT 'TECHNICAL',
    INDEX idx_skill_name (name)
) ENGINE=InnoDB;

-- 5. Student Skills Mapping
CREATE TABLE student_skills (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL,
    skill_id VARCHAR(36) NOT NULL,
    level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'INTERMEDIATE',
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    UNIQUE KEY unique_profile_skill (profile_id, skill_id)
) ENGINE=InnoDB;

-- 6. Assessments Table
CREATE TABLE assessments (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('TECHNICAL', 'APTITUDE', 'COMMUNICATION') NOT NULL,
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    time_limit INT DEFAULT 30, -- minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Assessment Attempts Table
CREATE TABLE attempts (
    id VARCHAR(36) PRIMARY KEY,
    profile_id VARCHAR(36) NOT NULL,
    assessment_id VARCHAR(36) NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    status ENUM('IN_PROGRESS', 'COMPLETED') DEFAULT 'IN_PROGRESS',
    total_score DECIMAL(5,2) DEFAULT 0.00,
    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Mentor Mock Reviews & Feedback Table
CREATE TABLE mentor_feedbacks (
    id VARCHAR(36) PRIMARY KEY,
    student_id VARCHAR(36) NOT NULL,
    mentor_id VARCHAR(36) NOT NULL,
    technical_rating INT NOT NULL CHECK (technical_rating BETWEEN 1 AND 5),
    communication_rating INT NOT NULL CHECK (communication_rating BETWEEN 1 AND 5),
    remarks TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- Sample Seed Data (For Testing in MySQL Workbench)
-- ==========================================================

-- Insert Users (Password: password123 with bcrypt hash)
INSERT INTO users (id, name, email, password, role) VALUES
('u-admin-1', 'Placement Officer (TPO)', 'admin@nexcart.ai', '$2b$10$poTDg6Jq2S448mnf05f5Fu.KG1irmQzxQ6N0yPFKRGJLjuFE5HvMC', 'ADMIN'),
('u-student-1', 'Demo Student', 'student@demo.com', '$2b$10$poTDg6Jq2S448mnf05f5Fu.KG1irmQzxQ6N0yPFKRGJLjuFE5HvMC', 'STUDENT'),
('u-student-2', 'Rohan Sharma', 'rohan.sharma@demo.com', '$2b$10$poTDg6Jq2S448mnf05f5Fu.KG1irmQzxQ6N0yPFKRGJLjuFE5HvMC', 'STUDENT'),
('u-student-3', 'Ananya Iyer', 'ananya.iyer@demo.com', '$2b$10$poTDg6Jq2S448mnf05f5Fu.KG1irmQzxQ6N0yPFKRGJLjuFE5HvMC', 'STUDENT'),
('u-student-4', 'Karthik Raja', 'karthik.raja@demo.com', '$2b$10$poTDg6Jq2S448mnf05f5Fu.KG1irmQzxQ6N0yPFKRGJLjuFE5HvMC', 'STUDENT');

-- Insert Profiles
INSERT INTO profiles (id, user_id, phone, location, target_role, readiness_score) VALUES
('p-1', 'u-student-1', '+91 9876543210', 'Chennai, India', 'Software Development Engineer', 78.50),
('p-2', 'u-student-2', '+91 9840123456', 'Chennai, India', 'Software Development Engineer', 88.50),
('p-3', 'u-student-3', '+91 9884567890', 'Bangalore, India', 'Data Scientist / Machine Learning', 82.00),
('p-4', 'u-student-4', '+91 9790112233', 'Hyderabad, India', 'Frontend Engineer', 74.20);

-- Insert Educations
INSERT INTO educations (id, profile_id, degree, university, cgpa, graduation_year) VALUES
('edu-1', 'p-1', 'M.Tech CSE (Data Science)', 'Hindustan University', 8.85, 2026),
('edu-2', 'p-2', 'B.Tech Computer Science', 'Hindustan University', 8.92, 2026),
('edu-3', 'p-3', 'B.Tech AI & Data Science', 'Hindustan University', 8.64, 2026),
('edu-4', 'p-4', 'B.Tech IT', 'Hindustan University', 7.85, 2026);

-- Insert Technical Skills
INSERT INTO skills (id, name, category) VALUES
('s-1', 'Python', 'TECHNICAL'),
('s-2', 'Data Structures & Algorithms', 'TECHNICAL'),
('s-3', 'React', 'TECHNICAL'),
('s-4', 'Node.js', 'TECHNICAL'),
('s-5', 'SQL', 'TECHNICAL'),
('s-6', 'Docker', 'TECHNICAL'),
('s-7', 'Machine Learning', 'TECHNICAL'),
('s-8', 'Git', 'TECHNICAL');

-- Insert Student Skills
INSERT INTO student_skills (id, profile_id, skill_id, level) VALUES
('ss-1', 'p-1', 's-1', 'ADVANCED'),
('ss-2', 'p-1', 's-2', 'INTERMEDIATE'),
('ss-3', 'p-1', 's-3', 'ADVANCED'),
('ss-4', 'p-1', 's-5', 'ADVANCED'),
('ss-5', 'p-2', 's-2', 'ADVANCED'),
('ss-6', 'p-2', 's-6', 'INTERMEDIATE'),
('ss-7', 'p-3', 's-1', 'ADVANCED'),
('ss-8', 'p-3', 's-7', 'ADVANCED');

-- Commit Verification
SELECT 'Database schema and seed successfully generated!' AS Status;
