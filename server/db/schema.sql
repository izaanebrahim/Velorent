-- VeloRent Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS velorent;
USE velorent;

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'owner', 'admin') DEFAULT 'customer',
    license_url VARCHAR(500),
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Vehicles Table
-- ============================================
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    type ENUM('sedan', 'suv', 'sports', 'hatchback', 'bike', 'scooter', 'luxury') NOT NULL,
    category VARCHAR(50) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    fuel_type ENUM('petrol', 'diesel', 'electric', 'hybrid') DEFAULT 'petrol',
    transmission ENUM('manual', 'automatic') DEFAULT 'manual',
    seats INT DEFAULT 4,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    total_ratings INT DEFAULT 0,
    image_url VARCHAR(500),
    description TEXT,
    location VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_type (type),
    INDEX idx_available (is_available),
    INDEX idx_price (price_per_day),
    INDEX idx_location (location)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Bookings Table
-- ============================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    pickup_location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Payments Table
-- ============================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method ENUM('upi', 'card', 'netbanking') NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_transaction (transaction_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
