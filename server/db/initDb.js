const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function initDatabase() {
  console.log(`\n⏳ Connecting to PostgreSQL (Supabase)...`);

  let client;
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    console.log('✅ Connected to PostgreSQL server successfully!');

    // Execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('✅ Database schema and tables applied successfully.');
    } else {
      console.warn('⚠️ schema.sql not found at:', schemaPath);
    }

    // Check if data already exists, if not run seed.sql
    const { rows: existingUsers } = await client.query('SELECT COUNT(*) as count FROM users');
    if (parseInt(existingUsers[0].count) === 0) {
      const seedPath = path.join(__dirname, 'seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log('✅ Seed data imported successfully (Users, Vehicles, Bookings, Payments).');
      }
    } else {
      console.log(`ℹ️ Tables already contain records (${existingUsers[0].count} users). Skipping seed.`);
    }

    // Verification summary
    const { rows: userCount } = await client.query('SELECT COUNT(*) as count FROM users');
    const { rows: vehicleCount } = await client.query('SELECT COUNT(*) as count FROM vehicles');
    const { rows: bookingCount } = await client.query('SELECT COUNT(*) as count FROM bookings');

    console.log(`
🎉 Database setup complete!
   - Users: ${userCount[0].count}
   - Vehicles: ${vehicleCount[0].count}
   - Bookings: ${bookingCount[0].count}
`);

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database initialization failed:');
    console.error(`   ${error.message}`);
    if (client) await client.end().catch(() => {});
    process.exit(1);
  }
}

initDatabase();
