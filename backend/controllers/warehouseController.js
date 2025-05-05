const db = require('../config/db');

exports.getWarehouses = async (req, res) => {
    try {
        const [warehouses] = await db.query('SELECT * FROM Warehouse');
        res.json(warehouses);
    } catch (err) {
        console.error('Error fetching warehouses:', err);
        res.status(500).json({
            message: 'Failed to fetch warehouses',
            error: err.message
        });
    }
};

exports.createWarehouse = async (req, res) => {
    const { address, current_stock, capacity, storage_condition } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO Warehouse (address, current_Stock, capacity, storage_Condition) VALUES (?, ?, ?, ?)',
            [address, current_stock, capacity, storage_condition]
        );

        res.status(201).json({
            warehouse_ID: result.insertId,
            message: 'Warehouse created successfully'
        });
    } catch (err) {
        console.error('Error creating warehouse:', err);
        res.status(400).json({
            message: 'Failed to create warehouse',
            error: err.message
        });
    }
};
