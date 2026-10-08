const fs = require('fs');
const path = require('path');

async function downloadWikiArticleImage(articleTitle, filename) {
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
    
    fs.writeFileSync(path.join(__dirname, 'client/public/images/vehicles', filename), Buffer.from(buffer));
    console.log(`Saved ${filename}`);
  } else {
    console.log(`No image for ${articleTitle}`);
  }
}

async function run() {
  await downloadWikiArticleImage('KTM 390 series', 'ktm_duke.jpg');
  await downloadWikiArticleImage('Ola S1', 'ola_s1_pro.jpg');
  await downloadWikiArticleImage('Honda Activa', 'honda_activa.jpg');
}

run();
