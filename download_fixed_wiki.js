const fs = require('fs');
const path = require('path');

const cars = [
  { article: 'Porsche_911', filename: 'porsche_911.jpg' },
  { article: 'BMW_M4', filename: 'bmw_m4.jpg' },
  { article: 'Mercedes-AMG_GT', filename: 'mercedes_amg_gt.jpg' },
  { article: 'Mercedes-Benz_S-Class', filename: 'mercedes_s_class.jpg' },
  { article: 'BMW_7_Series', filename: 'bmw_7_series.jpg' },
  { article: 'Audi_A8', filename: 'audi_a8.jpg' },
  { article: 'Toyota_Fortuner', filename: 'toyota_fortuner.jpg' },
  { article: 'Hyundai_Creta', filename: 'hyundai_creta.jpg' },
  { article: 'Mahindra_Thar', filename: 'mahindra_thar.jpg' },
  { article: 'Honda_City', filename: 'honda_city.jpg' },
  { article: 'Hyundai_Accent', filename: 'hyundai_verna.jpg' },
  { article: 'Suzuki_Ciaz', filename: 'maruti_ciaz.jpg' },
  { article: 'Royal_Enfield_Classic', filename: 'royal_enfield_classic.jpg' },
  { article: 'KTM_390_series', filename: 'ktm_duke.jpg' }
];

async function run() {
  const headers = { 'User-Agent': 'VeloRentBot/1.0 (test@example.com)' };
  
  for (const car of cars) {
    try {
      const apiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${car.article}?pithumbsize=1024`, { headers });
      const data = await apiRes.json();
      
      if (data.thumbnail && data.thumbnail.source) {
        const url = data.thumbnail.source;
        console.log(`Downloading ${car.filename} from ${url}`);
        
        const imgRes = await fetch(url, { headers });
        const buf = await imgRes.arrayBuffer();
        
        const filePath = path.join(__dirname, 'client/public/images/vehicles', car.filename);
        fs.writeFileSync(filePath, Buffer.from(buf));
        
        const stat = fs.statSync(filePath);
        if (stat.size < 5000) {
          console.error(`ERROR: ${car.filename} is too small, likely an error page.`);
        } else {
          console.log(`Saved ${car.filename} (${Math.round(stat.size/1024)} KB)`);
        }
      } else {
        console.log(`No thumbnail for ${car.article}`);
      }
    } catch (e) {
      console.log(`Failed for ${car.article}: ${e.message}`);
    }
  }
}

run();
