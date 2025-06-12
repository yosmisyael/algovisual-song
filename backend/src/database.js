const mysql = require('mysql2/promise');

/**
 * Database class for managing MySQL connections using connection pooling
 */
class Database {
    constructor() {
        this.pool = null;
    }

    /**
     * Initialize the database connection pool
     * @param {Object} config - Database configuration object
     * @param {string} config.host - Database host
     * @param {string} config.user - Database username
     * @param {string} config.password - Database password
     * @param {string} config.database - Database name
     * @param {number} config.connectionLimit - Maximum number of connections in pool
     */
    async initialize(config = {}) {
        try {
            const defaultConfig = {
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'songs',
                connectionLimit: 10,
            };

            const poolConfig = { ...defaultConfig, ...config };

            this.pool = mysql.createPool(poolConfig);
            
            // Test the connection
            const connection = await this.pool.getConnection();
            console.log('Database pool initialized successfully');
            connection.release();
            
        } catch (error) {
            console.error('Failed to initialize database pool:', error.message);
            throw error;
        }
    }

    /**
     * Get all records from the collections table
     * @returns {Promise<Array>} Array of collection records
     */
    async getAllCollections() {
        if (!this.pool) {
            throw new Error('Database pool not initialized. Call initialize() first.');
        }

        try {
            const [rows] = await this.pool.execute('SELECT * FROM collections');
            console.log(`Retrieved ${rows.length} records from collections table`);
            return rows;
        } catch (error) {
            console.error('Error fetching collections:', error.message);
            throw error;
        }
    }

    /**
     * Execute a custom query
     * @param {string} query - SQL query to execute
     * @param {Array} params - Query parameters (optional)
     * @returns {Promise<Array>} Query results
     */
    async query(query, params = []) {
        if (!this.pool) {
            throw new Error('Database pool not initialized. Call initialize() first.');
        }

        try {
            const [rows] = await this.pool.execute(query, params);
            return rows;
        } catch (error) {
            console.error('Error executing query:', error.message);
            throw error;
        }
    }

    /**
     * Close the database connection pool
     */
    async close() {
        if (this.pool) {
            try {
                await this.pool.end();
                console.log('Database pool closed successfully');
                this.pool = null;
            } catch (error) {
                console.error('Error closing database pool:', error.message);
                throw error;
            }
        }
    }

    /**
     * Get pool status information
     * @returns {Object} Pool status information
     */
    getPoolStatus() {
        if (!this.pool) {
            return { status: 'Not initialized' };
        }

        return {
            status: 'Active',
            allConnections: this.pool.pool.allConnections.length,
            freeConnections: this.pool.pool.freeConnections.length,
            acquiringConnections: this.pool.pool.acquiringConnections.length
        };
    }
}

module.exports = Database;