const pool = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

// Global mock fallback data to prevent Supabase connection timeouts
const mockVehicles = [
  { id: 1, brand: 'Porsche', model: '911 Carrera', type: 'sports', category: 'Sports', price_per_day: 15000, fuel_type: 'petrol', transmission: 'automatic', seats: 2, rating: 4.9, image_url: '/images/vehicles/porsche_911.jpg', location: 'Mumbai', is_approved: true, is_available: true, description: 'Experience the thrill of a classic sports car with the Porsche 911 Carrera.' },
  { id: 2, brand: 'BMW', model: 'M4 Competition', type: 'sports', category: 'Sports', price_per_day: 12000, fuel_type: 'petrol', transmission: 'automatic', seats: 4, rating: 4.8, image_url: '/images/vehicles/bmw_m4.jpg', location: 'Delhi', is_approved: true, is_available: true, description: 'The BMW M4 Competition offers unmatched performance and style.' },
  { id: 3, brand: 'Mercedes-Benz', model: 'AMG GT', type: 'sports', category: 'Sports', price_per_day: 18000, fuel_type: 'petrol', transmission: 'automatic', seats: 2, rating: 4.9, image_url: '/images/vehicles/mercedes_amg_gt.jpg', location: 'Bangalore', is_approved: true, is_available: true, description: 'Luxury meets raw power in the Mercedes-Benz AMG GT.' },
  { id: 4, brand: 'Mercedes-Benz', model: 'S-Class', type: 'luxury', category: 'Luxury', price_per_day: 20000, fuel_type: 'petrol', transmission: 'automatic', seats: 5, rating: 4.9, image_url: '/images/vehicles/mercedes_s_class.jpg', location: 'Mumbai', is_approved: true, is_available: true, description: 'The pinnacle of luxury sedans, the S-Class delivers exceptional comfort.' },
  { id: 5, brand: 'BMW', model: '7 Series', type: 'luxury', category: 'Luxury', price_per_day: 18000, fuel_type: 'diesel', transmission: 'automatic', seats: 5, rating: 4.8, image_url: '/images/vehicles/bmw_7_series.jpg', location: 'Delhi', is_approved: true, is_available: true, description: 'Executive luxury and performance combined in the 7 Series.' },
  { id: 6, brand: 'Audi', model: 'A8 L', type: 'luxury', category: 'Luxury', price_per_day: 17000, fuel_type: 'petrol', transmission: 'automatic', seats: 5, rating: 4.7, image_url: '/images/vehicles/audi_a8.jpg', location: 'Bangalore', is_approved: true, is_available: true, description: 'Sophisticated design and cutting-edge technology.' },
  { id: 7, brand: 'Toyota', model: 'Fortuner', type: 'suv', category: 'SUV', price_per_day: 5500, fuel_type: 'diesel', transmission: 'automatic', seats: 7, rating: 4.6, image_url: '/images/vehicles/toyota_fortuner.jpg', location: 'Mumbai', is_approved: true, is_available: true, description: 'A rugged and reliable SUV for all your adventures.' },
  { id: 8, brand: 'Hyundai', model: 'Creta', type: 'suv', category: 'SUV', price_per_day: 3500, fuel_type: 'petrol', transmission: 'manual', seats: 5, rating: 4.5, image_url: '/images/vehicles/hyundai_creta.jpg', location: 'Delhi', is_approved: true, is_available: true, description: 'Compact, stylish, and perfect for the city.' },
  { id: 9, brand: 'Mahindra', model: 'Thar', type: 'suv', category: 'SUV', price_per_day: 4500, fuel_type: 'diesel', transmission: 'manual', seats: 4, rating: 4.7, image_url: '/images/vehicles/mahindra_thar.jpg', location: 'Pune', is_approved: true, is_available: true, description: 'The ultimate off-roader to conquer any terrain.' },
  { id: 10, brand: 'Honda', model: 'City', type: 'sedan', category: 'Sedan', price_per_day: 2500, fuel_type: 'petrol', transmission: 'manual', seats: 5, rating: 4.4, image_url: '/images/vehicles/honda_city.jpg', location: 'Mumbai', is_approved: true, is_available: true, description: 'Elegant design and comfortable ride.' },
  { id: 11, brand: 'Hyundai', model: 'Verna', type: 'sedan', category: 'Sedan', price_per_day: 2800, fuel_type: 'petrol', transmission: 'automatic', seats: 5, rating: 4.5, image_url: '/images/vehicles/hyundai_verna.jpg', location: 'Delhi', is_approved: true, is_available: true, description: 'Modern aesthetics with advanced features.' },
  { id: 12, brand: 'Maruti', model: 'Ciaz', type: 'sedan', category: 'Sedan', price_per_day: 2200, fuel_type: 'petrol', transmission: 'manual', seats: 5, rating: 4.3, image_url: '/images/vehicles/maruti_ciaz.jpg', location: 'Bangalore', is_approved: true, is_available: true, description: 'Spacious and fuel-efficient premium sedan.' },
  { id: 13, brand: 'Royal Enfield', model: 'Classic 350', type: 'bike', category: 'Bike', price_per_day: 800, fuel_type: 'petrol', transmission: 'manual', seats: 2, rating: 4.6, image_url: '/images/vehicles/royal_enfield_classic.jpg', location: 'Mumbai', is_approved: true, is_available: true, description: 'A classic cruiser for a timeless riding experience.' },
  { id: 14, brand: 'KTM', model: 'Duke 390', type: 'bike', category: 'Bike', price_per_day: 1200, fuel_type: 'petrol', transmission: 'manual', seats: 2, rating: 4.7, image_url: '/images/vehicles/ktm_duke.jpg', location: 'Pune', is_approved: true, is_available: true, description: 'Aggressive styling and thrilling performance.' }
];

// Get all vehicles with filtering, search, and pagination
const getAllVehicles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      fuel_type,
      transmission,
      min_price,
      max_price,
      location,
      search,
      sort = 'newest',
      available,
      include_unapproved
    } = req.query;

    let filteredVehicles = [...mockVehicles];

    if (include_unapproved !== 'true') {
      filteredVehicles = filteredVehicles.filter(v => v.is_approved);
    }

    if (available !== 'false') {
      filteredVehicles = filteredVehicles.filter(v => v.is_available);
    }

    if (category && category !== 'All') {
      filteredVehicles = filteredVehicles.filter(v => v.category === category);
    }

    if (type) {
      filteredVehicles = filteredVehicles.filter(v => v.type === type);
    }

    if (fuel_type) {
      filteredVehicles = filteredVehicles.filter(v => v.fuel_type === fuel_type);
    }

    if (transmission) {
      filteredVehicles = filteredVehicles.filter(v => v.transmission === transmission);
    }

    if (min_price) {
      filteredVehicles = filteredVehicles.filter(v => v.price_per_day >= parseFloat(min_price));
    }

    if (max_price) {
      filteredVehicles = filteredVehicles.filter(v => v.price_per_day <= parseFloat(max_price));
    }

    if (location) {
      filteredVehicles = filteredVehicles.filter(v => v.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredVehicles = filteredVehicles.filter(v => 
        v.brand.toLowerCase().includes(searchLower) || 
        v.model.toLowerCase().includes(searchLower) || 
        v.description.toLowerCase().includes(searchLower)
      );
    }

    if (sort === 'price_low') {
      filteredVehicles.sort((a, b) => a.price_per_day - b.price_per_day);
    } else if (sort === 'price_high') {
      filteredVehicles.sort((a, b) => b.price_per_day - a.price_per_day);
    } else if (sort === 'rating') {
      filteredVehicles.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'name') {
      filteredVehicles.sort((a, b) => a.brand.localeCompare(b.brand));
    } else {
      // newest
      filteredVehicles.sort((a, b) => b.id - a.id);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedVehicles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: filteredVehicles.length,
        pages: Math.ceil(filteredVehicles.length / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single vehicle by ID
const getVehicleById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const vehicle = mockVehicles.find(v => v.id === id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.'
      });
    }

    res.json({
      success: true,
      data: { ...vehicle, owner_name: 'VeloRent Fleet' } // Mock owner name
    });
  } catch (error) {
    next(error);
  }
};

// Create vehicle (admin/owner)
const createVehicle = async (req, res, next) => {
  try {
    const {
      brand, model, type, category, price_per_day,
      fuel_type, transmission, seats, image_url,
      description, location
    } = req.body;

    const isAdmin = req.user.role === 'admin';

    const [result] = await pool.query(
      `INSERT INTO vehicles (owner_id, brand, model, type, category, price_per_day, fuel_type, transmission, seats, image_url, description, location, is_approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, brand, model, type, category, price_per_day, fuel_type || 'petrol', transmission || 'manual', seats || 4, image_url, description, location, isAdmin]
    );

    const [vehicle] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: isAdmin ? 'Vehicle added successfully' : 'Vehicle submitted for approval',
      data: vehicle[0]
    });
  } catch (error) {
    next(error);
  }
};

// Update vehicle
const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check ownership or admin
    const [vehicles] = await pool.query('SELECT owner_id FROM vehicles WHERE id = ?', [id]);
    if (vehicles.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    if (req.user.role !== 'admin' && vehicles[0].owner_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this vehicle.' });
    }

    // Only admins are allowed to approve/unapprove listings
    if (updates.is_approved !== undefined && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can approve or unapprove vehicles.'
      });
    }

    const allowedFields = ['brand', 'model', 'type', 'category', 'price_per_day', 'fuel_type', 'transmission', 'seats', 'image_url', 'description', 'location', 'is_available', 'is_approved'];
    const updateParts = [];
    const values = [];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateParts.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (updateParts.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update.' });
    }

    values.push(id);
    await pool.query(`UPDATE vehicles SET ${updateParts.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Vehicle updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// Delete vehicle (admin only)
const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [vehicles] = await pool.query('SELECT id FROM vehicles WHERE id = ?', [id]);
    if (vehicles.length === 0) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get vehicle availability (check for booking conflicts)
const getAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Always return available since this is mock data
    res.json({
      success: true,
      data: {
        vehicle_id: parseInt(id),
        is_available: true,
        conflicting_bookings: 0,
        booked_dates: []
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailability
};
