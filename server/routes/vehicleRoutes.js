const express = require('express');
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailability
} = require('../controllers/vehicleController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

// Public routes
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.get('/:id/availability', getAvailability);

// Protected routes (admin/owner)
router.post('/', auth, authorize('admin', 'owner'), createVehicle);
router.put('/:id', auth, authorize('admin', 'owner'), updateVehicle);
router.delete('/:id', auth, authorize('admin'), deleteVehicle);

module.exports = router;
