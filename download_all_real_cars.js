const fs = require('fs');
const path = require('path');

const vehicles = [
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
  { article: 'Hyundai Accent', filename: 'hyundai_verna.jpg' }, // Verna
  { article: 'Suzuki Ciaz', filename: 'maruti_ciaz.jpg' },
  { article: 'Royal Enfield Classic', filename: 'royal_enfield_classic.jpg' }
];

async function downloadWikiArticleImage(articleTitle, filename) {
  try {
    const headers = { 'User-Agent': 'VeloRentBot/1.0 (test@example.com)' };
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=pageimages&pithumbsize=1000&format=json`, { headers });
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    if (pageId !== '-1' && pages[pageId].thumbnail) {
      const url = pages[pageId].thumbnail.source;
      console.log(`Found ${articleTitle}: ${url}`);
      
      const imageRes = await fetch(url, { headers });
      const buffer = await imageRes.arrayBuffer();
      
      const destPath = path.join(__dirname, 'client/public/images/vehicles', filename);
      fs.writeFileSync(destPath, Buffer.from(buffer));
      console.log(`Saved ${filename}`);
    } else {
      console.log(`No image for ${articleTitle}`);
    }
  } catch (err) {
    console.log(`Error for ${articleTitle}:`, err.message);
  }
}

async function run() {
  for (const v of vehicles) {
    await downloadWikiArticleImage(v.article, v.filename);
  }
}

run();
