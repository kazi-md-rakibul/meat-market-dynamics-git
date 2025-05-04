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


// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const [order] = await db.query(`
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
            WHERE o.order_ID = ?
        `, [req.params.id]);

        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Get order products
        const [products] = await db.query(`
            SELECT 
                op.*,
                mp.product_name,
                mp.meat_Type,
                mp.cut_Type,
                mp.price_Per_Unit
            FROM orderproduct op
            JOIN meatproduct mp ON op.product_ID = mp.product_ID
            WHERE op.order_ID = ?
        `, [req.params.id]);

        order[0].products = products;
        res.json(order[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};