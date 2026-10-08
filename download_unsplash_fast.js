const fs = require('fs');
const path = require('path');

const fallbacks = {
  'hyundai_creta.jpg': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
  'mahindra_thar.jpg': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
  'honda_city.jpg': 'https://images.unsplash.com/photo-1590362891991-f700975e5866?q=80&w=1200&auto=format&fit=crop',
  'hyundai_verna.jpg': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop',
  'maruti_ciaz.jpg': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
  'royal_enfield_classic.jpg': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
  'mercedes_amg_gt.jpg': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop',
  'bmw_m4.jpg': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
  'porsche_911.jpg': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'
};

async function run() {
  const headers = { 'User-Agent': 'VeloRentBot/1.0' };
  for (const [filename, url] of Object.entries(fallbacks)) {
    try {
      console.log(`Downloading ${filename}`);
      const res = await fetch(url, { headers });
      const buf = await res.arrayBuffer();
      fs.writeFileSync(path.join(__dirname, 'client/public/images/vehicles', filename), Buffer.from(buf));
    } catch(e) {
      console.error(e);
    }
  }
  console.log("All done instantly!");
}

run();
