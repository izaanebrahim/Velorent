-- VeloRent Seed Data

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
INSERT INTO vehicles (owner_id, brand, model, type, category, price_per_day, fuel_type, transmission, seats, rating, total_ratings, image_url, gallery_urls, description, location, is_available, is_approved) VALUES
-- Sports Cars
(5, 'Porsche', '911 Carrera', 'sports', 'Sports', 15000.00, 'petrol', 'automatic', 2, 4.9, 120,
  '/images/vehicles/porsche_911.jpg',
  ARRAY[
    '/images/vehicles/porsche_911.jpg',
    '/images/vehicles/porsche_911.jpg'
  ],
  'The iconic Porsche 911 Carrera delivers pure driving exhilaration with its rear-engine layout and precision handling.', 'Mumbai', TRUE, TRUE),

(5, 'BMW', 'M4 Competition', 'sports', 'Sports', 12000.00, 'petrol', 'automatic', 4, 4.8, 95,
  '/images/vehicles/bmw_m4.jpg',
  ARRAY[
    '/images/vehicles/bmw_m4.jpg',
    '/images/vehicles/bmw_m4.jpg'
  ],
  'BMW M4 Competition combines aggressive styling with track-ready performance and everyday usability.', 'Delhi', TRUE, TRUE),

(5, 'Mercedes-Benz', 'AMG GT', 'sports', 'Sports', 18000.00, 'petrol', 'automatic', 2, 4.9, 78,
  '/images/vehicles/mercedes_amg_gt.jpg',
  ARRAY[
    '/images/vehicles/mercedes_amg_gt.jpg',
    '/images/vehicles/bmw_m4.jpg'
  ],
  'The Mercedes-AMG GT is a masterpiece of engineering with breathtaking performance and luxurious comfort.', 'Bangalore', TRUE, TRUE),

-- Luxury
(5, 'Mercedes-Benz', 'S-Class', 'luxury', 'Luxury', 20000.00, 'petrol', 'automatic', 5, 4.9, 150,
  '/images/vehicles/mercedes_s_class.jpg',
  ARRAY[
    '/images/vehicles/mercedes_s_class.jpg',
    '/images/vehicles/mercedes_s_class.jpg'
  ],
  'The pinnacle of automotive luxury. The S-Class sets the standard for comfort, technology, and prestige.', 'Mumbai', TRUE, TRUE),

(5, 'BMW', '7 Series', 'luxury', 'Luxury', 18000.00, 'diesel', 'automatic', 5, 4.8, 110,
  '/images/vehicles/bmw_7_series.jpg',
  ARRAY[
    '/images/vehicles/bmw_m4.jpg',
    '/images/vehicles/bmw_7_series.jpg'
  ],
  'BMW 7 Series offers an unparalleled blend of driving dynamics and rear-seat luxury.', 'Delhi', TRUE, TRUE),

(5, 'Audi', 'A8 L', 'luxury', 'Luxury', 17000.00, 'petrol', 'automatic', 5, 4.7, 85,
  '/images/vehicles/audi_a8.jpg',
  ARRAY[
    '/images/vehicles/audi_a8.jpg',
    '/images/vehicles/audi_a8.jpg'
  ],
  'The Audi A8 L represents the future of luxury with its cutting-edge technology and refined comfort.', 'Bangalore', TRUE, TRUE),

-- SUVs
(5, 'Toyota', 'Fortuner', 'suv', 'SUV', 5500.00, 'diesel', 'automatic', 7, 4.6, 200,
  '/images/vehicles/toyota_fortuner.jpg',
  ARRAY[
    '/images/vehicles/toyota_fortuner.jpg'
  ],
  'The Toyota Fortuner is the perfect companion for both city drives and off-road adventures.', 'Mumbai', TRUE, TRUE),

(5, 'Hyundai', 'Creta', 'suv', 'SUV', 3500.00, 'petrol', 'manual', 5, 4.5, 300,
  '/images/vehicles/hyundai_creta.jpg',
  ARRAY[
    '/images/vehicles/hyundai_creta.jpg'
  ],
  'The Hyundai Creta offers a perfect balance of style, comfort, and performance for urban explorers.', 'Delhi', TRUE, TRUE),

(5, 'Mahindra', 'Thar', 'suv', 'SUV', 4500.00, 'diesel', 'manual', 4, 4.7, 250,
  '/images/vehicles/mahindra_thar.jpg',
  ARRAY[
    '/images/vehicles/mahindra_thar.jpg'
  ],
  'The Mahindra Thar is built for adventure. Conquer any terrain with style and confidence.', 'Pune', TRUE, TRUE),

-- Sedans
(5, 'Honda', 'City', 'sedan', 'Sedan', 2500.00, 'petrol', 'manual', 5, 4.4, 350,
  '/images/vehicles/honda_city.jpg',
  ARRAY[
    '/images/vehicles/honda_city.jpg'
  ],
  'Honda City delivers exceptional fuel efficiency and comfort for daily commutes and long drives.', 'Mumbai', TRUE, TRUE),

(5, 'Hyundai', 'Verna', 'sedan', 'Sedan', 2800.00, 'petrol', 'automatic', 5, 4.5, 280,
  '/images/vehicles/hyundai_verna.jpg',
  ARRAY[
    '/images/vehicles/hyundai_verna.jpg'
  ],
  'The Hyundai Verna combines sporty looks with premium features at an attractive price point.', 'Delhi', TRUE, TRUE),

(5, 'Maruti', 'Ciaz', 'sedan', 'Sedan', 2200.00, 'petrol', 'manual', 5, 4.3, 200,
  '/images/vehicles/maruti_ciaz.jpg',
  ARRAY[
    '/images/vehicles/maruti_ciaz.jpg'
  ],
  'The Maruti Ciaz offers spacious interiors and excellent fuel economy for value-conscious renters.', 'Bangalore', TRUE, TRUE),

-- Bikes
(5, 'Royal Enfield', 'Classic 350', 'bike', 'Bike', 800.00, 'petrol', 'manual', 2, 4.6, 500,
  '/images/vehicles/royal_enfield_classic.jpg',
  ARRAY[
    '/images/vehicles/royal_enfield_classic.jpg'
  ],
  'The Royal Enfield Classic 350 is the perfect ride for highway cruising with its thumping engine.', 'Mumbai', TRUE, TRUE),

(5, 'KTM', 'Duke 390', 'bike', 'Bike', 1200.00, 'petrol', 'manual', 2, 4.7, 320,
  '/images/vehicles/ktm_duke.jpg',
  ARRAY[
    '/images/vehicles/ktm_duke.jpg'
  ],
  'KTM Duke 390 delivers thrilling performance with its lightweight chassis and powerful engine.', 'Pune', TRUE, TRUE),

-- Scooters
(5, 'Honda', 'Activa 6G', 'scooter', 'Scooter', 400.00, 'petrol', 'automatic', 2, 4.3, 600,
  '/images/vehicles/honda_activa.jpg',
  ARRAY[
    '/images/vehicles/honda_activa.jpg'
  ],
  'The Honda Activa 6G is India''s most trusted scooter - reliable, fuel-efficient, and easy to ride.', 'Mumbai', TRUE, TRUE);

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
