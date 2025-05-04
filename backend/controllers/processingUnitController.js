// Import the database configuration
const db = require('../config/db');
// CREATE: Add a new processing unit to the database
exports.createProcessingUnit = async (req, res) => {
    const { facility_Name, processing_Capacity, processing_Date } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO ProcessingUnit (facility_Name, processing_Capacity, processing_Date) VALUES (?, ?, ?)',
            [facility_Name, processing_Capacity, processing_Date]
        );

        res.status(201).json({
            unit_ID: result.insertId,
            message: 'Processing unit created successfully'
        });
    } catch (err) {
        console.error('Error creating processing unit:', err);
        res.status(400).json({
            message: 'Failed to create processing unit',
            error: err.message
        });
    }
};

// READ: Fetch all processing units from the database
exports.getProcessingUnits = async (req, res) => {
    try {
        const [units] = await db.query('SELECT * FROM ProcessingUnit');
        res.json(units);
    } catch (err) {
        console.error('Error fetching processing units:', err);
        res.status(500).json({
            message: 'Failed to fetch processing units',
            error: err.message
        });
    }
};

// DELETE: Remove a processing unit by ID
exports.deleteProcessingUnit = async (req, res) => {
    const { id } = req.body;

    try {
        const [result] = await db.query('DELETE FROM ProcessingUnit WHERE unit_ID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Processing unit not found' });
        }

        res.json({ message: 'Processing unit deleted successfully' });
    } catch (err) {
        console.error('Error deleting processing unit:', err);

        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                message: 'Cannot delete - this unit is referenced by meat batches',
                error: err.message
            });
        }

        res.status(500).json({
            message: 'Failed to delete processing unit',
            error: err.message
        });
    }
};

// UPDATE: Modify an existing processing unit's details

exports.updateProcessingUnit = async (req, res) => {
    const { id } = req.params;
    const { facility_Name, processing_Capacity, processing_Date } = req.body;

    if (!facility_Name || !processing_Capacity || !processing_Date) {
        return res.status(400).json({
            message: 'Missing required fields',
            error: 'facility_Name, processing_Capacity, and processing_Date are required'
        });
    }

    try {
        const [result] = await db.query(
            'UPDATE ProcessingUnit SET facility_Name = ?, processing_Capacity = ?, processing_Date = ? WHERE unit_ID = ?',
            [facility_Name, processing_Capacity, processing_Date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Processing unit not found' });
        }

        const [updatedUnit] = await db.query('SELECT * FROM ProcessingUnit WHERE unit_ID = ?', [id]);

        res.json({
            message: 'Processing unit updated successfully',
            unit: updatedUnit[0]
        });
    } catch (err) {
        console.error('Error updating processing unit:', err);
        res.status(400).json({
            message: 'Failed to update processing unit',
            error: err.message
        });
    }
};
// READ: Fetch a single processing unit by its ID
exports.getProcessingUnitById = async (req, res) => {
    const { id } = req.params;

    try {
        const [unit] = await db.query('SELECT * FROM ProcessingUnit WHERE unit_ID = ?', [id]);

        if (unit.length === 0) {
            return res.status(404).json({ message: 'Processing unit not found' });
        }

        res.json(unit[0]);
    } catch (err) {
        console.error('Error fetching processing unit:', err);
        res.status(500).json({
            message: 'Failed to fetch processing unit',
            error: err.message
        });
    }
};
