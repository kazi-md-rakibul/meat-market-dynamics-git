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

// Create new order
exports.createOrder = async (req, res) => {
    const { order_date, total_price, quantity, consumer_ID, products } = req.body;

    try {
        await db.query('START TRANSACTION');

        // Create order
        const [orderResult] = await db.query(
            'INSERT INTO `order` (order_date, total_price, quantity, consumer_ID) VALUES (?, ?, ?, ?)',
            [order_date, total_price, quantity, consumer_ID]
        );

        const order_ID = orderResult.insertId;

        // Add order products
        if (products && products.length > 0) {
            const productValues = products.map(p => [order_ID, p.product_ID, p.quantity]);
            await db.query(
                'INSERT INTO orderproduct (order_ID, product_ID, quantity) VALUES ?',
                [productValues]
            );
        }

        await db.query('COMMIT');

        res.status(201).json({ 
            order_ID: order_ID,
            message: 'Order created successfully'
        });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(400).json({ message: err.message });
    }
};