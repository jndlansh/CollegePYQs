const { Pool } = require('pg');
require('dotenv/config');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');
    console.log('Connection string:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@'));
    
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executed:', result.rows[0]);
    
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nPossible causes:');
    console.error('1. Supabase project is paused (check dashboard)');
    console.error('2. Wrong password or credentials');
    console.error('3. Network/firewall blocking connection');
    process.exit(1);
  }
}

testConnection();
