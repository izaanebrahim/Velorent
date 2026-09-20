const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'velorent';

  console.log(`\n⏳ Connecting to MySQL at ${host}:${port} as user "${user}"...`);

  let connection;
  try {
    // 1. Initial connection without database to create it if needed
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server successfully!');

    // 2. Create database if it does not exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`✅ Database "${database}" verified/created.`);

    await connection.query(`USE \`${database}\`;`);

    // 3. Execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Database schema and tables applied successfully.');
    } else {
      console.warn('⚠️ schema.sql not found at:', schemaPath);
    }

    // 4. Check if data already exists, if not run seed.sql
    const [existingUsers] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count === 0) {
      const seedPath = path.join(__dirname, 'seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await connection.query(seedSql);
        console.log('✅ Seed data imported successfully (Users, Vehicles, Bookings, Payments).');
      }
    } else {
      console.log(`ℹ️ Tables already contain records (${existingUsers[0].count} users). Skipping seed.`);
    }

    // 5. Verification summary
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [vehicleCount] = await connection.query('SELECT COUNT(*) as count FROM vehicles');
    const [bookingCount] = await connection.query('SELECT COUNT(*) as count FROM bookings');

    console.log(`
🎉 Database setup complete!
   - Users: ${userCount[0].count}
   - Vehicles: ${vehicleCount[0].count}
   - Bookings: ${bookingCount[0].count}
`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(`   ${error.message}`);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error(`
💡 Tip: Access was denied for user "${user}".
   Please update DB_PASSWORD in "server/.env" with your actual MySQL root password and run again.
`);
    }
    if (connection) await connection.end().catch(() => {});
    process.exit(1);
  }
}

initDatabase();
