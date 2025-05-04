const db = require('../config/db');

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
