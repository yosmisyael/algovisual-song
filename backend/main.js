const http = require('http');
const url = require('url');
const Database = require('./src/database');
require("dotenv").config();

// Initialize database instance
const db = new Database();

// Server configuration
const PORT = 3000;
const HOST = 'localhost';

/**
 * Set CORS headers to allow requests from any origin
 * @param {http.ServerResponse} res - HTTP response object
 */
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Send JSON response
 * @param {http.ServerResponse} res - HTTP response object
 * @param {number} statusCode - HTTP status code
 * @param {*} data - Data to send as JSON
 */
function sendJsonResponse(res, statusCode, data) {
    setCorsHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
}

/**
 * Handle GET /data endpoint
 * @param {http.ServerResponse} res - HTTP response object
 */
async function handleDataEndpoint(res) {
    try {
        const collections = await db.getAllCollections();
        const responseData = {
            data: collections,
        };
        
        sendJsonResponse(res, 200, collections);
        
    } catch (error) {
        console.error('Error handling /data endpoint:', error.message);
        
        sendJsonResponse(res, 500, {
            error: 'Internal Server Error',
            message: 'Failed to fetch data from database'
        });
    }
}

/**
 * Handle 404 Not Found
 * @param {http.ServerResponse} res - HTTP response object
 */
function handleNotFound(res) {
    sendJsonResponse(res, 404, {
        error: 'Not Found',
        message: 'The requested endpoint does not exist'
    });
}

/**
 * Handle preflight OPTIONS requests
 * @param {http.ServerResponse} res - HTTP response object
 */
function handleOptions(res) {
    setCorsHeaders(res);
    res.writeHead(200);
    res.end();
}

/**
 * Main request handler
 * @param {http.IncomingMessage} req - HTTP request object
 * @param {http.ServerResponse} res - HTTP response object
 */
async function requestHandler(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    console.log(`${new Date().toISOString()} - ${method} ${pathname}`);

    // Handle preflight OPTIONS requests
    if (method === 'OPTIONS') {
        return handleOptions(res);
    }

    // Route handling
    if (pathname === '/data' && method === 'GET') {
        return await handleDataEndpoint(res);
    }

    // Health check endpoint
    if (pathname === '/health' && method === 'GET') {
        const poolStatus = db.getPoolStatus();
        return sendJsonResponse(res, 200, {
            status: 'OK',
            timestamp: new Date().toISOString(),
            database: poolStatus
        });
    }

    // 404 for all other routes
    return handleNotFound(res);
}

/**
 * Initialize the application
 */
async function initializeApp() {
    try {
        // Initialize database connection pool
        await db.initialize({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            connectionLimit: 10
        });

        // Create HTTP server
        const server = http.createServer(requestHandler);

        // Start server
        server.listen(PORT, HOST, () => {
            console.log(`Server running at http://${HOST}:${PORT}/`);
            console.log('Available endpoints:');
            console.log('  GET /data   - Fetch all collections data');
            console.log('  GET /health - Health check and database status');
        });

        // Graceful shutdown handling
        process.on('SIGINT', async () => {
            console.log('\nShutting down gracefully...');
            
            server.close(async () => {
                console.log('HTTP server closed');
                
                try {
                    await db.close();
                    console.log('Database connections closed');
                    process.exit(0);
                } catch (error) {
                    console.error('Error closing database:', error.message);
                    process.exit(1);
                }
            });
        });

    } catch (error) {
        console.error('Failed to initialize application:', error.message);
        process.exit(1);
    }
}

// Start the application
if (require.main === module) {
    initializeApp();
}

module.exports = { initializeApp, requestHandler };