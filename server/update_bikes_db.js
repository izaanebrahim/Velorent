const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function updateBikes() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  
  try {
    await client.connect();
    console.log('Connected to DB');

    await client.query(`
      UPDATE vehicles 
      SET image_url = '/images/vehicles/ktm_duke.jpg',
          gallery_urls = ARRAY['/images/vehicles/ktm_duke.jpg']
      WHERE brand = 'KTM' AND model = 'Duke 390'
    `);
    
    await client.query(`
      UPDATE vehicles 
      SET image_url = '/images/vehicles/ola_s1_pro.jpg',
          gallery_urls = ARRAY['/images/vehicles/ola_s1_pro.jpg']
      WHERE brand = 'Ola' AND model = 'S1 Pro'
    `);
    
    console.log('Successfully updated the KTM Duke 390 and Ola S1 Pro images in the database!');
  } catch (error) {
    console.error('Error updating db:', error);
  } finally {
    await client.end();
  }
}

updateBikes();
