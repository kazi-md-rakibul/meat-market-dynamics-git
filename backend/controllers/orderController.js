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

// Update order
exports.updateOrder = async (req, res) => {
    const { order_ID } = req.params;
    const { order_date, total_price, quantity, consumer_ID, delivery_ID, products } = req.body;

    try {
        await db.query('START TRANSACTION');

        // Check if order exists
        const [existingOrder] = await db.query('SELECT * FROM `order` WHERE order_ID = ?', [order_ID]);
        if (existingOrder.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order
        await db.query(
            'UPDATE `order` SET order_date = ?, total_price = ?, quantity = ?, consumer_ID = ?, delivery_ID = ? WHERE order_ID = ?',
            [order_date, total_price, quantity, consumer_ID, delivery_ID, order_ID]
        );

        // Update order products if provided
        if (products) {
            // Remove existing products
            await db.query('DELETE FROM orderproduct WHERE order_ID = ?', [order_ID]);

            // Add new products
            if (products.length > 0) {
                const productValues = products.map(p => [order_ID, p.product_ID, p.quantity]);
                await db.query(
                    'INSERT INTO orderproduct (order_ID, product_ID, quantity) VALUES ?',
                    [productValues]
                );
            }
        }

        await db.query('COMMIT');

        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(400).json({ message: err.message });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    const { order_ID } = req.params;

    try {
        await db.query('START TRANSACTION');

        // Delete order products first (cascade will handle this, but being explicit)
        await db.query('DELETE FROM orderproduct WHERE order_ID = ?', [order_ID]);

        // Delete the order
        const [result] = await db.query('DELETE FROM `order` WHERE order_ID = ?', [order_ID]);

        if (result.affectedRows === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Order not found' });
        }

        await db.query('COMMIT');

        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ message: err.message });
    }
};

// Get orders by delivery
exports.getOrdersByDelivery = async (req, res) => {
    const { delivery_ID } = req.params;

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
            WHERE o.delivery_ID = ?
        `, [delivery_ID]);

        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
