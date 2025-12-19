const { Pool } = require('pg');
const { executeQueryWithLogging } = require('./query-logger');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function executeQuery(query, params = []) {
    return executeQueryWithLogging(
        (q, p) => pool.query(q, p),
        query,
        params
    );
}

async function initPool() {
    try {
        await pool.query('SELECT 1');
        console.log('✅ Database pool ready');
    } catch (err) {
        console.error('❌ Database init failed:', err);
        process.exit(1);
    }
}

async function testConnection() {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection test successful');
        return true;
    } catch (err) {
        console.error('❌ Database connection test failed:', err);
        return false;
    }
}

module.exports = {
    pool,          // 👈 REQUIRED for transactions
    executeQuery,
    initPool,
    testConnection,
};