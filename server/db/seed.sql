-- VeloRent Seed Data
USE velorent;

-- ============================================
-- Admin User (password: Admin@123)
-- ============================================
INSERT INTO users (name, email, phone, password_hash, role, email_verified) VALUES
('Admin', 'admin@velorent.com', '+91-9000000001', '$2a$12$LJ3m4ys3GZxkGJvKP0jxCOqFg0mJYV.gSgtIPshnV5X5E3rczPJjO', 'admin', TRUE);

-- ============================================
-- Sample Customers
-- ============================================
INSERT INTO users (name, email, phone, password_hash, role, email_verified) VALUES
('Rahul Sharma', 'rahul@email.com', '+91-9876543210', '$2a$12$LJ3m4ys3GZxkGJvKP0jxCOqFg0mJYV.gSgtIPshnV5X5E3rczPJjO', 'customer', TRUE),
('Priya Patel', 'priya@email.com', '+91-9876543211', '$2a$12$LJ3m4ys3GZxkGJvKP0jxCOqFg0mJYV.gSgtIPshnV5X5E3rczPJjO', 'customer', TRUE),
('Arjun Kumar', 'arjun@email.com', '+91-9876543212', '$2a$12$LJ3m4ys3GZxkGJvKP0jxCOqFg0mJYV.gSgtIPshnV5X5E3rczPJjO', 'customer', TRUE);

-- ============================================
-- Sample Vehicle Owner
-- ============================================
INSERT INTO users (name, email, phone, password_hash, role, email_verified) VALUES
('Ahmed Khan', 'ahmed@email.com', '+91-9876543213', '$2a$12$LJ3m4ys3GZxkGJvKP0jxCOqFg0mJYV.gSgtIPshnV5X5E3rczPJjO', 'owner', TRUE);

-- ============================================
-- Sample Vehicles (15+ across categories)
-- ============================================
INSERT INTO vehicles (owner_id, brand, model, type, category, price_per_day, fuel_type, transmission, seats, rating, total_ratings, image_url, description, location, is_available, is_approved) VALUES
-- Sports Cars
(5, 'Porsche', '911 Carrera', 'sports', 'Sports', 15000.00, 'petrol', 'automatic', 2, 4.9, 120, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'The iconic Porsche 911 Carrera delivers pure driving exhilaration with its rear-engine layout and precision handling.', 'Mumbai', TRUE, TRUE),
(5, 'BMW', 'M4 Competition', 'sports', 'Sports', 12000.00, 'petrol', 'automatic', 4, 4.8, 95, 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', 'BMW M4 Competition combines aggressive styling with track-ready performance and everyday usability.', 'Delhi', TRUE, TRUE),
(5, 'Mercedes-Benz', 'AMG GT', 'sports', 'Sports', 18000.00, 'petrol', 'automatic', 2, 4.9, 78, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'The Mercedes-AMG GT is a masterpiece of engineering with breathtaking performance and luxurious comfort.', 'Bangalore', TRUE, TRUE),

-- Luxury
(5, 'Mercedes-Benz', 'S-Class', 'luxury', 'Luxury', 20000.00, 'petrol', 'automatic', 5, 4.9, 150, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800', 'The pinnacle of automotive luxury. The S-Class sets the standard for comfort, technology, and prestige.', 'Mumbai', TRUE, TRUE),
(5, 'BMW', '7 Series', 'luxury', 'Luxury', 18000.00, 'diesel', 'automatic', 5, 4.8, 110, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'BMW 7 Series offers an unparalleled blend of driving dynamics and rear-seat luxury.', 'Delhi', TRUE, TRUE),
(5, 'Audi', 'A8 L', 'luxury', 'Luxury', 17000.00, 'petrol', 'automatic', 5, 4.7, 85, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'The Audi A8 L represents the future of luxury with its cutting-edge technology and refined comfort.', 'Bangalore', TRUE, TRUE),

-- SUVs
(5, 'Toyota', 'Fortuner', 'suv', 'SUV', 5500.00, 'diesel', 'automatic', 7, 4.6, 200, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 'The Toyota Fortuner is the perfect companion for both city drives and off-road adventures.', 'Mumbai', TRUE, TRUE),
(5, 'Hyundai', 'Creta', 'suv', 'SUV', 3500.00, 'petrol', 'manual', 5, 4.5, 300, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'The Hyundai Creta offers a perfect balance of style, comfort, and performance for urban explorers.', 'Delhi', TRUE, TRUE),
(5, 'Mahindra', 'Thar', 'suv', 'SUV', 4500.00, 'diesel', 'manual', 4, 4.7, 250, 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', 'The Mahindra Thar is built for adventure. Conquer any terrain with style and confidence.', 'Pune', TRUE, TRUE),

-- Sedans
(5, 'Honda', 'City', 'sedan', 'Sedan', 2500.00, 'petrol', 'manual', 5, 4.4, 350, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800', 'Honda City delivers exceptional fuel efficiency and comfort for daily commutes and long drives.', 'Mumbai', TRUE, TRUE),
(5, 'Hyundai', 'Verna', 'sedan', 'Sedan', 2800.00, 'petrol', 'automatic', 5, 4.5, 280, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800', 'The Hyundai Verna combines sporty looks with premium features at an attractive price point.', 'Delhi', TRUE, TRUE),
(5, 'Maruti', 'Ciaz', 'sedan', 'Sedan', 2200.00, 'petrol', 'manual', 5, 4.3, 200, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 'The Maruti Ciaz offers spacious interiors and excellent fuel economy for value-conscious renters.', 'Bangalore', TRUE, TRUE),

-- Bikes
(5, 'Royal Enfield', 'Classic 350', 'bike', 'Bike', 800.00, 'petrol', 'manual', 2, 4.6, 500, 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800', 'The Royal Enfield Classic 350 is the perfect ride for highway cruising with its thumping engine.', 'Mumbai', TRUE, TRUE),
(5, 'KTM', 'Duke 390', 'bike', 'Bike', 1200.00, 'petrol', 'manual', 2, 4.7, 320, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', 'KTM Duke 390 delivers thrilling performance with its lightweight chassis and powerful engine.', 'Pune', TRUE, TRUE),

-- Scooters
(5, 'Honda', 'Activa 6G', 'scooter', 'Scooter', 400.00, 'petrol', 'automatic', 2, 4.3, 600, 'https://images.unsplash.com/photo-1571188654248-7a89013e5dc4?w=800', 'The Honda Activa 6G is India''s most trusted scooter - reliable, fuel-efficient, and easy to ride.', 'Mumbai', TRUE, TRUE),
(5, 'Ola', 'S1 Pro', 'scooter', 'Scooter', 500.00, 'electric', 'automatic', 2, 4.4, 180, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', 'The Ola S1 Pro is the future of urban mobility - zero emissions with impressive range and features.', 'Bangalore', TRUE, TRUE);

-- ============================================
-- Sample Bookings
-- ============================================
INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, total_amount, status, pickup_location) VALUES
(2, 1, '2026-07-25', '2026-07-28', 45000.00, 'completed', 'Mumbai Central'),
(2, 7, '2026-08-01', '2026-08-05', 22000.00, 'confirmed', 'Mumbai Airport'),
(3, 10, '2026-08-02', '2026-08-04', 5000.00, 'confirmed', 'Delhi Station'),
(4, 13, '2026-07-20', '2026-07-22', 1600.00, 'completed', 'Mumbai Bandra');

-- ============================================
-- Sample Payments
-- ============================================
INSERT INTO payments (booking_id, amount, method, transaction_id, status) VALUES
(1, 45000.00, 'card', 'TXN_VR_20260725_001', 'success'),
(2, 22000.00, 'upi', 'TXN_VR_20260801_002', 'success'),
(3, 5000.00, 'netbanking', 'TXN_VR_20260802_003', 'success'),
(4, 1600.00, 'upi', 'TXN_VR_20260720_004', 'success');
