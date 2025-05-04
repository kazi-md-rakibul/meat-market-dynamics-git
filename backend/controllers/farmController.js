const db = require('../config/db');

// Get all farms
const getFarms = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM FarmFarmer ORDER BY farm_ID');
        res.json(rows);
    } catch (error) {
        console.error('Error getting farms:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a single farm by ID
const getFarmById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query('SELECT * FROM FarmFarmer WHERE farm_ID = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Farm not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error getting farm:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create a new farm
const createFarm = async (req, res) => {
    try {
        const {
            farm_Name,
            livestock_Type,
            available_Stock,
            address,
            number_of_Livestock,
            contact_info
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO FarmFarmer (
                farm_Name,
                livestock_Type,
                available_Stock,
                address,
                number_of_Livestock,
                contact_info
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [farm_Name, livestock_Type, available_Stock, address, number_of_Livestock, contact_info]
        );

        const [newFarm] = await db.query('SELECT * FROM FarmFarmer WHERE farm_ID = ?', [result.insertId]);
        res.status(201).json(newFarm[0]);
    } catch (error) {
        console.error('Error creating farm:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a farm
const updateFarm = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            farm_Name,
            livestock_Type,
            available_Stock,
            address,
            number_of_Livestock,
            contact_info
        } = req.body;

        const [result] = await db.query(
            `UPDATE FarmFarmer SET
                farm_Name = ?,
                livestock_Type = ?,
                available_Stock = ?,
                address = ?,
                number_of_Livestock = ?,
                contact_info = ?
            WHERE farm_ID = ?`,
            [farm_Name, livestock_Type, available_Stock, address, number_of_Livestock, contact_info, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        const [updatedFarm] = await db.query('SELECT * FROM FarmFarmer WHERE farm_ID = ?', [id]);
        res.json(updatedFarm[0]);
    } catch (error) {
        console.error('Error updating farm:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a farm
const deleteFarm = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query('DELETE FROM FarmFarmer WHERE farm_ID = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        res.json({ message: 'Farm deleted successfully' });
    } catch (error) {
        console.error('Error deleting farm:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getFarms,
    getFarmById,
    createFarm,
    updateFarm,
    deleteFarm
};
