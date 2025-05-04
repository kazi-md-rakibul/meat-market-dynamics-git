const express = require('express');
const router = express.Router();
const {
    getFarms,
    getFarmById,
    createFarm,
    updateFarm,
    deleteFarm
} = require('../controllers/farmController');

router.get('/', getFarms);
router.get('/:id', getFarmById);
router.post('/', createFarm);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

module.exports = router;
