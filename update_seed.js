const fs = require('fs');

const seedPath = 'server/db/seed.sql';
let content = fs.readFileSync(seedPath, 'utf8');

const replacements = [
  { match: /'https:\/\/images\.unsplash\.com\/photo-1503376780353-7e6692767b70\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/porsche_911.jpg'" },
  { match: /'https:\/\/images\.unsplash\.com\/photo-1580274455191-1c62238fa333\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/porsche_911.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1618843479313-40f8afb4b4d8\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/bmw_m4.jpg'" },
  { match: /'https:\/\/images\.unsplash\.com\/photo-1555353540-64fd3b01c4fa\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/bmw_m4.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1617531653332-bd46c24f2068\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/mercedes_amg_gt.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1563720223185-11003d516935\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/mercedes_s_class.jpg'" },
  { match: /'https:\/\/images\.unsplash\.com\/photo-1622185135505-2d795003994a\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/mercedes_s_class.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1556189250-72ba244cad63\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/bmw_7_series.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1603584173870-7f2be5d87249\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/audi_a8.jpg'" },
  { match: /'https:\/\/images\.unsplash\.com\/photo-1606152421802-db97b9c7a11b\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/audi_a8.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1552519507-da3b142c6e3d\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/toyota_fortuner.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1568605117036-5fe5e7bab0b7\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/hyundai_creta.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1533473359331-0135ef1b58bf\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/mahindra_thar.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1590362891991-f700975e5866\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/honda_city.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1550355291-bbee04a92027\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/hyundai_verna.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1549399542-7e3f8b79c341\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/maruti_ciaz.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1558981403-c5f9899a28bc\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/royal_enfield_classic.jpg'" },
  
  { match: /'https:\/\/images\.unsplash\.com\/photo-1621007947382-bb3c3994e3fd\?auto=format&fit=crop&q=80'/g, replace: "'/images/vehicles/honda_activa.jpg'" },

  // For BMW 7 series we have one unsplash url that was also used for M4
  // Let's manually replace the 7 Series block instead of global regex for that specific one if needed.
];

for (const { match, replace } of replacements) {
  content = content.replace(match, replace);
}

// Special handling for BMW 7 series since it re-uses the M4 image in the original seed:
// (5, 'BMW', '7 Series', ... '/images/vehicles/bmw_m4.jpg', ... -> we fix this specific occurrence
content = content.replace(
  /BMW', '7 Series'(.*?)'\/images\/vehicles\/bmw_m4\.jpg'/s,
  "BMW', '7 Series'$1'/images/vehicles/bmw_7_series.jpg'"
);
content = content.replace(
  /ARRAY\[\s*'\/images\/vehicles\/bmw_7_series\.jpg',\s*'\/images\/vehicles\/bmw_7_series\.jpg'\s*\]/s,
  "ARRAY['/images/vehicles/bmw_7_series.jpg']"
);

// KTM and Ola were previously replaced to local URLs in the DB, let's just make sure they point to local in seed too.
// Wait, they are ALREADY pointing to local in seed.sql because I modified them earlier!

fs.writeFileSync(seedPath, content, 'utf8');
console.log('Done replacing image urls in seed.sql');
