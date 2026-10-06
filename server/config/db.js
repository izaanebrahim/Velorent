const { Pool } = require('pg');
require('dotenv').config();

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// MySQL to PostgreSQL Query Translator wrapper
function translateSql(sql) {
  let pgSql = sql;
  
  // Convert ? to $1, $2, etc.
  let counter = 1;
  pgSql = pgSql.replace(/\?/g, () => `$${counter++}`);
  
  // If INSERT without RETURNING, add RETURNING id
  const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
  if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
    pgSql += ' RETURNING id';
  }

  // Handle MySQL DATE_FORMAT -> Postgres TO_CHAR
  pgSql = pgSql.replace(/DATE_FORMAT\(([^,]+),\s*'%Y-%m'\)/g, "TO_CHAR($1, 'YYYY-MM')");

  // Handle Boolean SUM for charts
  pgSql = pgSql.replace(/SUM\(is_available = TRUE\)/g, "SUM(CASE WHEN is_available = TRUE THEN 1 ELSE 0 END)");
  pgSql = pgSql.replace(/SUM\(is_available = FALSE\)/g, "SUM(CASE WHEN is_available = FALSE THEN 1 ELSE 0 END)");

  return { pgSql, isInsert };
}

// Wrapper to mimic mysql2/promise behavior
const pool = {
  query: async (sql, params = []) => {
    const { pgSql, isInsert } = translateSql(sql);
    try {
      const result = await pgPool.query(pgSql, params);
      const rows = result.rows;
      if (isInsert && result.rows.length > 0) {
        rows.insertId = result.rows[0].id;
      }
      return [rows, result.fields];
    } catch (err) {
      console.error('SQL Error:', err.message, '\nQuery:', pgSql);
      throw err;
    }
  },
  getConnection: async () => {
    const client = await pgPool.connect();
    return {
      query: async (sql, params = []) => {
        const { pgSql, isInsert } = translateSql(sql);
        try {
          const result = await client.query(pgSql, params);
          const rows = result.rows;
          if (isInsert && result.rows.length > 0) {
            rows.insertId = result.rows[0].id;
          }
          return [rows, result.fields];
        } catch (err) {
          console.error('SQL Error:', err.message, '\nQuery:', pgSql);
          throw err;
        }
      },
      release: () => client.release()
    };
  },
  end: () => pgPool.end()
};

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ PostgreSQL (Supabase) connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    console.log('💡 Make sure DATABASE_URL is set in your .env file.');
  }
}

testConnection();

module.exports = pool;
