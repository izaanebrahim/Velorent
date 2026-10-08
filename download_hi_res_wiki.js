const fs = require('fs');
const path = require('path');

const cars = [
  { article: 'Porsche 911', filename: 'porsche_911.jpg' },
  { article: 'BMW M4', filename: 'bmw_m4.jpg' },
  { article: 'Mercedes-AMG GT', filename: 'mercedes_amg_gt.jpg' },
  { article: 'Mercedes-Benz S-Class', filename: 'mercedes_s_class.jpg' },
  { article: 'BMW 7 Series', filename: 'bmw_7_series.jpg' },
  { article: 'Audi A8', filename: 'audi_a8.jpg' },
  { article: 'Toyota Fortuner', filename: 'toyota_fortuner.jpg' },
  { article: 'Hyundai Creta', filename: 'hyundai_creta.jpg' },
  { article: 'Mahindra Thar', filename: 'mahindra_thar.jpg' },
  { article: 'Honda City', filename: 'honda_city.jpg' },
  { article: 'Hyundai Accent', filename: 'hyundai_verna.jpg' },
  { article: 'Suzuki Ciaz', filename: 'maruti_ciaz.jpg' },
  { article: 'Royal Enfield Classic', filename: 'royal_enfield_classic.jpg' },
  { article: 'KTM 390 series', filename: 'ktm_duke.jpg' }
];

async function fetchWithTimeout(url, options, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function run() {
  const headers = { 'User-Agent': 'VeloRentBot/2.0 (test@example.com)' };
  
  for (const car of cars) {
    let success = false;
    let attempts = 0;
    
    while (!success && attempts < 3) {
      attempts++;
      try {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(car.article)}&prop=pageimages&pithumbsize=1200&format=json`;
        const apiRes = await fetchWithTimeout(apiUrl, { headers });
        const data = await apiRes.json();
        
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        
        if (pageId !== '-1' && pages[pageId].thumbnail) {
          const url = pages[pageId].thumbnail.source;
          console.log(`[Attempt ${attempts}] Downloading high-res ${car.filename} from ${url}`);
          
          const imgRes = await fetchWithTimeout(url, { headers }, 15000);
          const buf = await imgRes.arrayBuffer();
          
          if (buf.byteLength < 5000) {
            throw new Error('Downloaded file too small, likely an error page.');
          }
          
          const filePath = path.join(__dirname, 'client/public/images/vehicles', car.filename);
          fs.writeFileSync(filePath, Buffer.from(buf));
          
          console.log(`SUCCESS: Saved ${car.filename} (${Math.round(buf.byteLength/1024)} KB)`);
          success = true;
        } else {
          console.log(`No thumbnail for ${car.article}`);
          success = true; // Break loop if no thumbnail exists
        }
      } catch (e) {
        console.log(`Error on ${car.article} (Attempt ${attempts}): ${e.message}`);
      }
    }
    
    if (!success) {
      console.error(`FAILED completely to download ${car.filename}`);
    }
  }
}

run();
