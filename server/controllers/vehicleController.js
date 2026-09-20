const pool = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

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

    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (include_unapproved !== 'true') {
      conditions.push('v.is_approved = TRUE');
    }

    if (available !== 'false') {
      conditions.push('v.is_available = TRUE');
    }

    if (category && category !== 'All') {
      conditions.push('v.category = ?');
      params.push(category);
    }

    if (type) {
      conditions.push('v.type = ?');
      params.push(type);
    }

    if (fuel_type) {
      conditions.push('v.fuel_type = ?');
      params.push(fuel_type);
    }

    if (transmission) {
      conditions.push('v.transmission = ?');
      params.push(transmission);
    }

    if (min_price) {
      conditions.push('v.price_per_day >= ?');
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      conditions.push('v.price_per_day <= ?');
      params.push(parseFloat(max_price));
    }

    if (location) {
      conditions.push('v.location LIKE ?');
      params.push(`%${location}%`);
    }

    if (search) {
      conditions.push('(v.brand LIKE ? OR v.model LIKE ? OR v.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    // Sort
    let orderClause;
    switch (sort) {
      case 'price_low': orderClause = 'ORDER BY v.price_per_day ASC'; break;
      case 'price_high': orderClause = 'ORDER BY v.price_per_day DESC'; break;
      case 'rating': orderClause = 'ORDER BY v.rating DESC'; break;
      case 'name': orderClause = 'ORDER BY v.brand ASC, v.model ASC'; break;
      default: orderClause = 'ORDER BY v.created_at DESC';
    }

    // Count total
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM vehicles v ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get vehicles
    const [vehicles] = await pool.query(
      `SELECT v.* FROM vehicles v ${whereClause} ${orderClause} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single vehicle by ID
const getVehicleById = async (req, res, next) => {
  try {
    const [vehicles] = await pool.query(
      'SELECT v.*, u.name as owner_name FROM vehicles v LEFT JOIN users u ON v.owner_id = u.id WHERE v.id = ?',
      [req.params.id]
    );

    if (vehicles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.'
      });
    }

    res.json({
      success: true,
      data: vehicles[0]
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
    const { start_date, end_date } = req.query;

    const [bookings] = await pool.query(
      `SELECT id, start_date, end_date, status FROM bookings
       WHERE vehicle_id = ? AND status IN ('confirmed', 'active')
       AND start_date <= ? AND end_date >= ?`,
      [id, end_date || '2099-12-31', start_date || '2000-01-01']
    );

    res.json({
      success: true,
      data: {
        vehicle_id: parseInt(id),
        is_available: bookings.length === 0,
        conflicting_bookings: bookings.length,
        booked_dates: bookings.map(b => ({
          start: b.start_date,
          end: b.end_date
        }))
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
