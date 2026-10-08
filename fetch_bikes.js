async function run() {
  const fetchWikiImage = async (query) => {
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&pithumbsize=800&format=json`);
      const data = await res.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pageId === '-1' || !pages[pageId].thumbnail) return null;
      return pages[pageId].thumbnail.source;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const urls = await Promise.all(['KTM 390 Duke', 'Ola S1', 'Honda Activa'].map(fetchWikiImage));
  console.log('KTM 390 Duke:', urls[0]);
  console.log('Ola S1:', urls[1]);
  console.log('Honda Activa:', urls[2]);
}

run();
