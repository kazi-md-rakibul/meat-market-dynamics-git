const express = require('express');
const router = express.Router();
const cattleController = require('../controllers/cattleController');

// Get all cattle
router.get('/', cattleController.getAllCattle);

// Get cattle by ID
router.get('/:id', cattleController.getCattleById);

// Create new cattle
router.post('/', cattleController.createCattle);

// Update cattle
router.put('/:cattle_ID', cattleController.updateCattle);

// Delete cattle
router.delete('/:cattle_ID', cattleController.deleteCattle);

// Get cattle by processing unit
router.get('/processing-unit/:unit_ID', cattleController.getCattleByProcessingUnit);

module.exports = router;
