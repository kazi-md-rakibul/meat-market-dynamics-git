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

exports.updateWarehouse = async (req, res) => {
    console.log('Update warehouse request received:', { params: req.params, body: req.body });
    const { id } = req.params;
    const { address, current_stock, capacity, storage_condition } = req.body;

    if (!address || current_stock === undefined || !capacity || !storage_condition) {
        console.log('Missing required fields:', { address, current_stock, capacity, storage_condition });
        return res.status(400).json({
            message: 'Missing required fields',
            error: 'All fields are required'
        });
    }

    try {
        console.log('Attempting to update warehouse:', { id, address, current_stock, capacity, storage_condition });
        const [result] = await db.query(
            'UPDATE Warehouse SET address = ?, current_Stock = ?, capacity = ?, storage_Condition = ? WHERE warehouse_ID = ?',
            [address, current_stock, capacity, storage_condition, id]
        );

        console.log('Update result:', result);
        if (result.affectedRows === 0) {
            console.log('No warehouse found with ID:', id);
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        const [updatedWarehouse] = await db.query('SELECT * FROM Warehouse WHERE warehouse_ID = ?', [id]);
        console.log('Updated warehouse:', updatedWarehouse[0]);
        res.json({
            message: 'Warehouse updated successfully',
            warehouse: updatedWarehouse[0]
        });
    } catch (err) {
        console.error('Error updating warehouse:', err);
        res.status(400).json({
            message: 'Failed to update warehouse',
            error: err.message
        });
    }
};

exports.deleteWarehouse = async (req, res) => {
    // Get the ID from either params or body
    const id = req.params.id || req.body.id;
    console.log('Delete warehouse request received:', { params: req.params, body: req.body, id });

    if (!id) {
        return res.status(400).json({ message: 'Warehouse ID is required' });
    }

    try {
        // First check if the warehouse even exists
        const [warehouse] = await db.query('SELECT * FROM Warehouse WHERE warehouse_ID = ?', [id]);
        if (warehouse.length === 0) {
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        // Check if the warehouse is referenced by any deliveries
        const [deliveries] = await db.query('SELECT COUNT(*) as count FROM Delivery WHERE warehouse_ID = ?', [id]);
        console.log('Related deliveries check:', deliveries[0]);
        
        if (deliveries[0].count > 0) {
            return res.status(400).json({
                message: 'Cannot delete warehouse - it is referenced by deliveries'
            });
        }

        console.log('Attempting to delete warehouse with ID:', id);
        const [result] = await db.query('DELETE FROM Warehouse WHERE warehouse_ID = ?', [id]);
        console.log('Delete result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Warehouse not found or could not be deleted' });
        }

        res.json({ message: 'Warehouse deleted successfully' });
    } catch (err) {
        console.error('Error deleting warehouse:', err);
        res.status(500).json({
            message: 'Failed to delete warehouse',
            error: err.message
        });
    }
};
