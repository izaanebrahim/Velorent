const fs = require('fs');
const path = require('path');

const fallbacks = {
  'Mercedes-Benz S-Class': 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=1200&auto=format&fit=crop',
  'BMW 7 Series': 'https://images.unsplash.com/photo-1555353540-64fd3b01c4fa?q=80&w=1200&auto=format&fit=crop',
  'Audi A8': 'https://images.unsplash.com/photo-1603584173870-7f2be5d87249?q=80&w=1200&auto=format&fit=crop',
  'Toyota Fortuner': 'https://images.unsplash.com/photo-1628169604169-f80e9a7e6c0f?q=80&w=1200&auto=format&fit=crop',
  'Hyundai Creta': 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
  'Mahindra Thar': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
  'Honda City': 'https://images.unsplash.com/photo-1590362891991-f700975e5866?q=80&w=1200&auto=format&fit=crop',
  'Hyundai Accent': 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop',
  'Suzuki Ciaz': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
  'Royal Enfield Classic': 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
  'Mercedes-AMG GT': 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=1200&auto=format&fit=crop',
  'BMW M4': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
  'Porsche 911': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'
};

const vehicles = [
  { article: 'Mercedes-Benz S-Class', filename: 'mercedes_s_class.jpg' },
  { article: 'BMW 7 Series', filename: 'bmw_7_series.jpg' },
  { article: 'Audi A8', filename: 'audi_a8.jpg' },
  { article: 'Toyota Fortuner', filename: 'toyota_fortuner.jpg' },
  { article: 'Hyundai Creta', filename: 'hyundai_creta.jpg' },
  { article: 'Mahindra Thar', filename: 'mahindra_thar.jpg' },
  { article: 'Honda City', filename: 'honda_city.jpg' },
  { article: 'Hyundai Accent', filename: 'hyundai_verna.jpg' },
  { article: 'Suzuki Ciaz', filename: 'maruti_ciaz.jpg' },
  { article: 'Royal Enfield Classic', filename: 'royal_enfield_classic.jpg' }
];

async function fetchWithTimeout(url, options, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function downloadWikiArticleImage(articleTitle, filename) {
  try {
    const headers = { 'User-Agent': 'VeloRentBot/1.0 (test@example.com)' };
    const res = await fetchWithTimeout(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=pageimages&pithumbsize=1200&format=json`, { headers });
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    let url = '';
    if (pageId !== '-1' && pages[pageId].thumbnail) {
      url = pages[pageId].thumbnail.source;
      console.log(`Found Wiki for ${articleTitle}`);
    } else {
      console.log(`No Wiki image for ${articleTitle}, using Unsplash fallback`);
      url = fallbacks[articleTitle];
    }
    
    if (url) {
      const imageRes = await fetchWithTimeout(url, { headers });
      const buffer = await imageRes.arrayBuffer();
      
      const destPath = path.join(__dirname, 'client/public/images/vehicles', filename);
      fs.writeFileSync(destPath, Buffer.from(buffer));
      console.log(`Saved ${filename}`);
    }
  } catch (err) {
    console.log(`Timeout/Error for ${articleTitle}, using Unsplash fallback`);
    try {
      const fbUrl = fallbacks[articleTitle];
      const fbRes = await fetchWithTimeout(fbUrl);
      const fbBuf = await fbRes.arrayBuffer();
      const destPath = path.join(__dirname, 'client/public/images/vehicles', filename);
      fs.writeFileSync(destPath, Buffer.from(fbBuf));
      console.log(`Saved ${filename} via Unsplash`);
    } catch(e) {
      console.log(`Double failure for ${articleTitle}`);
    }
  }
}

async function run() {
  for (const v of vehicles) {
    await downloadWikiArticleImage(v.article, v.filename);
  }
}

run();
