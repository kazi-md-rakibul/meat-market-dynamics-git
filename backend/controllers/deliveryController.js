const db = require('../config/db');

// Get all deliveries with related information
exports.getAllDeliveries = async (req, res) => {
    try {
        const [deliveries] = await db.query(`
            SELECT 
                d.*,
                o.order_date,
                v.vendor_Name,
                mb.production_Date AS batch_production_date,
                mb.batch_Status,
                w.address AS warehouse_address,
                w.storage_Condition
            FROM delivery d
            LEFT JOIN \`order\` o ON d.order_ID = o.order_ID
            LEFT JOIN vendor v ON d.vendor_ID = v.vendor_ID
            LEFT JOIN meatbatch mb ON d.batch_ID = mb.batch_ID
            LEFT JOIN warehouse w ON d.warehouse_ID = w.warehouse_ID
        `);
        res.json(deliveries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get delivery by ID
exports.getDeliveryById = async (req, res) => {
    try {
        const [delivery] = await db.query(`
            SELECT 
                d.*,
                o.order_date,
                v.vendor_Name,
                mb.production_Date AS batch_production_date,
                mb.batch_Status,
                w.address AS warehouse_address,
                w.storage_Condition
            FROM delivery d
            LEFT JOIN \`order\` o ON d.order_ID = o.order_ID
            LEFT JOIN vendor v ON d.vendor_ID = v.vendor_ID
            LEFT JOIN meatbatch mb ON d.batch_ID = mb.batch_ID
            LEFT JOIN warehouse w ON d.warehouse_ID = w.warehouse_ID
            WHERE d.delivery_ID = ?
        `, [req.params.id]);

        if (delivery.length === 0) {
            return res.status(404).json({ message: 'Delivery not found' });
        }

        res.json(delivery[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create new delivery
exports.createDelivery = async (req, res) => {
    const { delivery_Type, date, delivery_Status, order_ID, vendor_ID, batch_ID, warehouse_ID } = req.body;

    try {
        await db.query('START TRANSACTION');

        // Validate order existence if provided
        if (order_ID) {
            const [order] = await db.query('SELECT * FROM `order` WHERE order_ID = ?', [order_ID]);
            if (order.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json({ message: 'Order not found' });
            }
        }

        // Validate batch existence
        const [batch] = await db.query('SELECT * FROM meatbatch WHERE batch_ID = ?', [batch_ID]);
        if (batch.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Batch not found' });
        }

        // Validate warehouse existence
        const [warehouse] = await db.query('SELECT * FROM warehouse WHERE warehouse_ID = ?', [warehouse_ID]);
        if (warehouse.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Warehouse not found' });
        }

        const [result] = await db.query(
            'INSERT INTO delivery (delivery_Type, date, delivery_Status, order_ID, vendor_ID, batch_ID, warehouse_ID) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [delivery_Type, date, delivery_Status, order_ID, vendor_ID, batch_ID, warehouse_ID]
        );

        // If order exists, update its delivery_ID
        if (order_ID) {
            await db.query('UPDATE `order` SET delivery_ID = ? WHERE order_ID = ?', [result.insertId, order_ID]);
        }

        await db.query('COMMIT');

        res.status(201).json({ 
            delivery_ID: result.insertId,
            message: 'Delivery created successfully'
        });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(400).json({ message: err.message });
    }
};

// Update delivery
exports.updateDelivery = async (req, res) => {
    const { delivery_ID } = req.params;
    const { delivery_Type, date, delivery_Status, order_ID, vendor_ID, batch_ID, warehouse_ID } = req.body;

    try {
        await db.query('START TRANSACTION');

        // Check if delivery exists
        const [existingDelivery] = await db.query('SELECT * FROM delivery WHERE delivery_ID = ?', [delivery_ID]);
        if (existingDelivery.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Validate order if provided
        if (order_ID) {
            const [order] = await db.query('SELECT * FROM `order` WHERE order_ID = ?', [order_ID]);
            if (order.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json({ message: 'Order not found' });
            }
        }

        // Update delivery
        const [result] = await db.query(
            'UPDATE delivery SET delivery_Type = ?, date = ?, delivery_Status = ?, order_ID = ?, vendor_ID = ?, batch_ID = ?, warehouse_ID = ? WHERE delivery_ID = ?',
            [delivery_Type, date, delivery_Status, order_ID, vendor_ID, batch_ID, warehouse_ID, delivery_ID]
        );

        // Update order's delivery_ID
        if (order_ID !== existingDelivery[0].order_ID) {
            // Remove delivery_ID from old order if exists
            if (existingDelivery[0].order_ID) {
                await db.query('UPDATE `order` SET delivery_ID = NULL WHERE order_ID = ?', [existingDelivery[0].order_ID]);
            }
            // Set delivery_ID for new order
            await db.query('UPDATE `order` SET delivery_ID = ? WHERE order_ID = ?', [delivery_ID, order_ID]);
        }

        await db.query('COMMIT');

        res.json({ message: 'Delivery updated successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(400).json({ message: err.message });
    }
};

// Delete delivery
exports.deleteDelivery = async (req, res) => {
    const { delivery_ID } = req.params;

    try {
        await db.query('START TRANSACTION');

        // Get delivery to check for order relationship
        const [delivery] = await db.query('SELECT * FROM delivery WHERE delivery_ID = ?', [delivery_ID]);
        if (delivery.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Delivery not found' });
        }

        // Update order to remove delivery_ID reference if exists
        if (delivery[0].order_ID) {
            await db.query('UPDATE `order` SET delivery_ID = NULL WHERE order_ID = ?', [delivery[0].order_ID]);
        }

        // Delete the delivery
        const [result] = await db.query('DELETE FROM delivery WHERE delivery_ID = ?', [delivery_ID]);

        await db.query('COMMIT');

        res.json({ message: 'Delivery deleted successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ message: err.message });
    }
};

// Get deliveries by warehouse
exports.getDeliveriesByWarehouse = async (req, res) => {
    const { warehouse_ID } = req.params;

    try {
        const [deliveries] = await db.query(`
            SELECT 
                d.*,
                o.order_date,
                v.vendor_Name,
                mb.production_Date AS batch_production_date,
                mb.batch_Status,
                w.address AS warehouse_address,
                w.storage_Condition
            FROM delivery d
            LEFT JOIN \`order\` o ON d.order_ID = o.order_ID
            LEFT JOIN vendor v ON d.vendor_ID = v.vendor_ID
            LEFT JOIN meatbatch mb ON d.batch_ID = mb.batch_ID
            LEFT JOIN warehouse w ON d.warehouse_ID = w.warehouse_ID
            WHERE d.warehouse_ID = ?
        `, [warehouse_ID]);

        res.json(deliveries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get deliveries by batch
exports.getDeliveriesByBatch = async (req, res) => {
    const { batch_ID } = req.params;

    try {
        const [deliveries] = await db.query(`
            SELECT 
                d.*,
                o.order_date,
                v.vendor_Name,
                mb.production_Date AS batch_production_date,
                mb.batch_Status,
                w.address AS warehouse_address,
                w.storage_Condition
            FROM delivery d
            LEFT JOIN \`order\` o ON d.order_ID = o.order_ID
            LEFT JOIN vendor v ON d.vendor_ID = v.vendor_ID
            LEFT JOIN meatbatch mb ON d.batch_ID = mb.batch_ID
            LEFT JOIN warehouse w ON d.warehouse_ID = w.warehouse_ID
            WHERE d.batch_ID = ?
        `, [batch_ID]);

        res.json(deliveries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
