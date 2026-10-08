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

    const updates = [
      { brand: 'Porsche', model: '911 Carrera', image: '/images/vehicles/porsche_911.jpg' },
      { brand: 'BMW', model: 'M4 Competition', image: '/images/vehicles/bmw_m4.jpg' },
      { brand: 'Mercedes-Benz', model: 'AMG GT', image: '/images/vehicles/mercedes_amg_gt.jpg' },
      { brand: 'Mercedes-Benz', model: 'S-Class', image: '/images/vehicles/mercedes_s_class.jpg' },
      { brand: 'BMW', model: '7 Series', image: '/images/vehicles/bmw_7_series.jpg' },
      { brand: 'Audi', model: 'A8 L', image: '/images/vehicles/audi_a8.jpg' },
      { brand: 'Toyota', model: 'Fortuner', image: '/images/vehicles/toyota_fortuner.jpg' },
      { brand: 'Hyundai', model: 'Creta', image: '/images/vehicles/hyundai_creta.jpg' },
      { brand: 'Mahindra', model: 'Thar', image: '/images/vehicles/mahindra_thar.jpg' },
      { brand: 'Honda', model: 'City', image: '/images/vehicles/honda_city.jpg' },
      { brand: 'Hyundai', model: 'Verna', image: '/images/vehicles/hyundai_verna.jpg' },
      { brand: 'Maruti', model: 'Ciaz', image: '/images/vehicles/maruti_ciaz.jpg' },
      { brand: 'Royal Enfield', model: 'Classic 350', image: '/images/vehicles/royal_enfield_classic.jpg' },
      { brand: 'Honda', model: 'Activa 6G', image: '/images/vehicles/honda_activa.jpg' },
      { brand: 'KTM', model: 'Duke 390', image: '/images/vehicles/ktm_duke.jpg' },
      { brand: 'Ola', model: 'S1 Pro', image: '/images/vehicles/ola_s1_pro.jpg' }
    ];

    for (const car of updates) {
      await client.query(`
        UPDATE vehicles 
        SET image_url = $1,
            gallery_urls = ARRAY[$1]
        WHERE brand = $2 AND model = $3
      `, [car.image, car.brand, car.model]);
    }
    
    console.log('Successfully updated all vehicle images in the database!');
  } catch (error) {
    console.error('Error updating db:', error);
  } finally {
    await client.end();
  }
}

updateBikes();
