const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../database/home-sections');
const outputSql = path.join(__dirname, '../database/home-sections.sql');

const sections = [
  { id: 13, title: 'Home — Hero', page: 'home-hero', file: '13-hero.html' },
  { id: 14, title: 'Home — Strategies', page: 'home-strategies', file: '14-strategies.html' },
  { id: 15, title: 'Home — Features', page: 'home-features', file: '15-features.html' },
  { id: 16, title: 'Home — Build Portfolio', page: 'home-build', file: '16-build.html' },
  { id: 17, title: 'Home — Stock Chatter', page: 'home-chatter', file: '17-chatter.html' },
  { id: 18, title: 'Home — Gallery', page: 'home-gallery', file: '18-gallery.html' },
  { id: 19, title: 'Home — Pricing', page: 'home-pricing', file: '19-pricing.html' },
];

function escapeSql(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "''");
}

// let sql = `-- Stock Advisors website — Home page sections for viewcontent API
// -- API: GET https://dynstocks.com/restapi/webservices/viewcontent/?id={id}
// -- Adjust table/column names to match your backend database schema.
// -- Existing records use: id, title, type, content, page, date_review

// `;
let sql = `-- Stock Advisors website — Home page sections for viewcontent API
-- API: GET https://stockadvisors.ai/restapi/webservices/viewcontent/?id={id}
-- Adjust table/column names to match your backend database schema.
-- Existing records use: id, title, type, content, page, date_review

`;

for (const section of sections) {
  const html = fs.readFileSync(path.join(sectionsDir, section.file), 'utf8').trim();
  const escaped = escapeSql(html);

  sql += `-- ${section.title} (id=${section.id})\n`;
  sql += `INSERT INTO content (id, title, type, content, page, date_review)\n`;
  sql += `VALUES (${section.id}, '${escapeSql(section.title)}', 'content', '${escaped}', '${section.page}', '');\n\n`;
}

fs.writeFileSync(outputSql, sql);
console.log('Generated:', outputSql);
