const fs = require('fs');
async function fetchWikiImage(query) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&pithumbsize=800&format=json`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1' || !pages[pageId].thumbnail) {
      return null;
    }
    return pages[pageId].thumbnail.source;
  } catch (e) { return null; }
}
async function run() {
  const cars = ['Porsche 911', 'BMW M4', 'Mercedes-AMG GT', 'Mercedes-Benz S-Class', 'BMW 7 Series', 'Audi A8', 'Toyota Fortuner', 'Hyundai Creta', 'Mahindra Thar', 'Honda City', 'Hyundai Verna', 'Suzuki Ciaz', 'Royal Enfield Classic 350', 'KTM 390 series', 'Ola S1'];
  const urls = {};
  for (const car of cars) {
    const url = await fetchWikiImage(car);
    urls[car] = url;
  }
  console.log(JSON.stringify(urls, null, 2));
}
run();
