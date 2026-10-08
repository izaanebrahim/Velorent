const https = require('https');

function searchWiki(query) {
  return new Promise((resolve) => {
    https.get(`https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.query && parsed.query.search && parsed.query.search.length > 0) {
          const title = parsed.query.search[0].title;
          https.get(`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
              const parsed2 = JSON.parse(data2);
              const pages = parsed2.query.pages;
              const pageId = Object.keys(pages)[0];
              resolve(pages[pageId].imageinfo[0].url);
            });
          });
        } else {
          resolve(null);
        }
      });
    });
  });
}

async function run() {
  const ktm = await searchWiki('KTM 390 Duke');
  const ola = await searchWiki('Ola S1 Pro');
  console.log('KTM:', ktm);
  console.log('Ola:', ola);
}
run();
