/**
 * Main Application Entry Point
 * This file sets up the Express server, middleware, routes, and database initialization.
 * It also includes error handling and security configurations.
 */

// Import required dependencies
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet'); // Security middleware
require('dotenv').config();

// Initialize Express application
const app = express();

// Import route modules
const routes = require('./routes/routes');
const farmRoutes = require('./routes/farmRoutes');
const consumerRoutes = require('./routes/consumerRoutes');

/**
 * Security and Middleware Configuration
 * - helmet: Adds various HTTP headers for security
 * - cors: Enables Cross-Origin Resource Sharing
 * - express.json: Parses incoming JSON payloads
 */
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' })); // Limit payload size

/**
 * API Routes Configuration
 * All routes are prefixed with /api for better organization
 */
app.use('/api', routes);
app.use('/api/farms', farmRoutes);
app.use('/api/consumers-direct', consumerRoutes);

/**
 * Health Check Endpoint
 * Used for monitoring and load balancer health checks
 */
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * Global Error Handler
 * Catches and processes all unhandled errors
 */
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message,
        status: 'error'
    });
});

/**
 * Database Initialization Function
 * Loads and executes the schema.sql file to set up the database structure
 */
const initDB = async () => {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'fyp-new',
            multipleStatements: true
        });

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await db.query(schema);
        console.log('✅ Database schema initialized successfully');

        await db.end();
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1); // Exit if database initialization fails
    }
};

/**
 * Server Startup
 * Initializes database and starts the Express server
 */
const PORT = process.env.PORT || 5000;
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`
🚀 Server is running!
📝 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${PORT}
⏰ Started at: ${new Date().toISOString()}
        `);
    });
}).catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Export app for testing purposes
module.exports = app;
