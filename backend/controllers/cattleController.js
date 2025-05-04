const db = require('../config/db');

// Get all cattle with their associated farm and processing unit details
exports.getAllCattle = async (req, res) => {
    try {
        const [cattle] = await db.query(`
            SELECT 
                c.*,
                f.farm_Name,
                f.livestock_Type,
                pu.facility_Name AS processing_facility,
                pu.processing_Capacity
            FROM cattle c
            JOIN farmfarmer f ON c.farm_ID = f.farm_ID
            JOIN processingunit pu ON c.unit_ID = pu.unit_ID
        `);
        res.json(cattle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get cattle by ID
exports.getCattleById = async (req, res) => {
    try {
        const [cattle] = await db.query(`
            SELECT 
                c.*,
                f.farm_Name,
                f.livestock_Type,
                pu.facility_Name AS processing_facility
            FROM cattle c
            JOIN farmfarmer f ON c.farm_ID = f.farm_ID
            JOIN processingunit pu ON c.unit_ID = pu.unit_ID
            WHERE c.cattle_ID = ?
        `, [req.params.id]);
        
        if (cattle.length === 0) {
            return res.status(404).json({ message: 'Cattle not found' });
        }
        
        res.json(cattle[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new cattle
exports.createCattle = async (req, res) => {
    const { animal_Type, breed, quantity, average_Weight, farm_ID, unit_ID } = req.body;

    try {
        // Validate farm existence
        const [farm] = await db.query('SELECT * FROM farmfarmer WHERE farm_ID = ?', [farm_ID]);
        if (farm.length === 0) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        // Validate processing unit existence
        const [unit] = await db.query('SELECT * FROM processingunit WHERE unit_ID = ?', [unit_ID]);
        if (unit.length === 0) {
            return res.status(404).json({ message: 'Processing unit not found' });
        }

        const [result] = await db.query(
            'INSERT INTO cattle (animal_Type, breed, quantity, average_Weight, farm_ID, unit_ID) VALUES (?, ?, ?, ?, ?, ?)',
            [animal_Type, breed, quantity, average_Weight, farm_ID, unit_ID]
        );

        res.status(201).json({ 
            cattle_ID: result.insertId,
            message: 'Cattle created successfully'
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update cattle
exports.updateCattle = async (req, res) => {
    const { cattle_ID } = req.params;
    const { animal_Type, breed, quantity, average_Weight, farm_ID, unit_ID } = req.body;

    try {
        // Check if cattle exists
        const [existingCattle] = await db.query('SELECT * FROM cattle WHERE cattle_ID = ?', [cattle_ID]);
        if (existingCattle.length === 0) {
            return res.status(404).json({ message: 'Cattle not found' });
        }

        // Validate farm if provided
        if (farm_ID) {
            const [farm] = await db.query('SELECT * FROM farmfarmer WHERE farm_ID = ?', [farm_ID]);
            if (farm.length === 0) {
                return res.status(404).json({ message: 'Farm not found' });
            }
        }

        // Validate processing unit if provided
        if (unit_ID) {
            const [unit] = await db.query('SELECT * FROM processingunit WHERE unit_ID = ?', [unit_ID]);
            if (unit.length === 0) {
                return res.status(404).json({ message: 'Processing unit not found' });
            }
        }

        const [result] = await db.query(
            'UPDATE cattle SET animal_Type = ?, breed = ?, quantity = ?, average_Weight = ?, farm_ID = ?, unit_ID = ? WHERE cattle_ID = ?',
            [animal_Type, breed, quantity, average_Weight, farm_ID, unit_ID, cattle_ID]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cattle not found or no changes made' });
        }

        res.json({ message: 'Cattle updated successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete cattle
exports.deleteCattle = async (req, res) => {
    const { cattle_ID } = req.params;

    try {
        const [result] = await db.query('DELETE FROM cattle WHERE cattle_ID = ?', [cattle_ID]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cattle not found' });
        }

        res.json({ message: 'Cattle deleted successfully' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(409).json({
                message: 'Cannot delete cattle - it is referenced by other records'
            });
        }
        res.status(500).json({ message: err.message });
    }
};

// Get cattle by processing unit
exports.getCattleByProcessingUnit = async (req, res) => {
    const { unit_ID } = req.params;

    try {
        const [cattle] = await db.query(`
            SELECT 
                c.*,
                f.farm_Name,
                f.livestock_Type,
                pu.facility_Name AS processing_facility
            FROM cattle c
            JOIN farmfarmer f ON c.farm_ID = f.farm_ID
            JOIN processingunit pu ON c.unit_ID = pu.unit_ID
            WHERE c.unit_ID = ?
        `, [unit_ID]);

        res.json(cattle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
