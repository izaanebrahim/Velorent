const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { match, replace } of replacements) {
    content = content.replace(match, replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

const fallbacks = [
  { match: /'https:\/\/images\.unsplash\.com\/photo-1503376780353-7e6692767b70\?w=800'/g, replace: "'/images/vehicles/porsche_911.jpg'" },
  { match: /'https:\/\/images\.unsplash\.com\/photo-1503376780353-7e6692767b70\?w=400'/g, replace: "'/images/vehicles/porsche_911.jpg'" },
  { match: /'https:\/\/images\.unsplash\.com\/photo-1533473359331-0135ef1b58bf\?w=800'/g, replace: "'/images/vehicles/mahindra_thar.jpg'" }
];

replaceInFile('client/src/pages/VehicleDetails.jsx', fallbacks);
replaceInFile('client/src/pages/BookingHistory.jsx', fallbacks);
replaceInFile('client/src/pages/admin/ManageVehicles.jsx', fallbacks);
replaceInFile('client/src/components/shared/VehicleCard.jsx', fallbacks);

console.log('Fallbacks updated.');
