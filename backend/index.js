const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const routes = require('./routes/routes');
const farmRoutes = require('./routes/farmRoutes');
const consumerRoutes = require('./routes/consumerRoutes');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api/farms', farmRoutes);
app.use('/api/consumers-direct', consumerRoutes);

// Health check route 
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Load and run schema.sql
const initDB = async () => {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true, // <== ADD THIS
        });

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await db.query(schema);
        console.log('✅ Database schema initialized');

        await db.end();
    } catch (error) {
        console.error('❌ Failed to initialize database schema:', error.message);
    }
};

// Start server after DB is initialized
const PORT = process.env.PORT || 5000;
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
});

module.exports = app;
