const db = require('../config/db');

// Get all orders with delivery information
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT 
                o.*,
                c.preferred_Meat_Type,
                c.preferred_Cut,
                d.delivery_Type,
                d.delivery_Status,
                d.date AS delivery_date
            FROM \`order\` o
            LEFT JOIN consumer c ON o.consumer_ID = c.consumer_ID
            LEFT JOIN delivery d ON o.delivery_ID = d.delivery_ID
        `);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

