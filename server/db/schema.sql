-- VeloRent Database Schema
-- PostgreSQL (Supabase Compatible)

-- ============================================
-- Users Table
-- ============================================
DROP TABLE IF EXISTS payments, bookings, vehicles, users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'customer',
    license_url VARCHAR(500),
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_role ON users(role);

-- ============================================
-- Vehicles Table
-- ============================================
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    owner_id INT,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    fuel_type VARCHAR(20) DEFAULT 'petrol',
    transmission VARCHAR(20) DEFAULT 'manual',
    seats INT DEFAULT 4,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    total_ratings INT DEFAULT 0,
    image_url VARCHAR(500),
    gallery_urls TEXT[],
    description TEXT,
    location VARCHAR(255),
    is_available BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_category ON vehicles(category);
CREATE INDEX idx_type ON vehicles(type);
CREATE INDEX idx_available ON vehicles(is_available);
CREATE INDEX idx_price ON vehicles(price_per_day);
CREATE INDEX idx_location ON vehicles(location);

-- ============================================
-- Bookings Table
-- ============================================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    vehicle_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    pickup_location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

CREATE INDEX idx_user ON bookings(user_id);
CREATE INDEX idx_vehicle ON bookings(vehicle_id);
CREATE INDEX idx_status_booking ON bookings(status);
CREATE INDEX idx_dates ON bookings(start_date, end_date);

-- ============================================
-- Payments Table
-- ============================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

CREATE INDEX idx_booking ON payments(booking_id);
CREATE INDEX idx_transaction ON payments(transaction_id);
CREATE INDEX idx_status_payment ON payments(status);
