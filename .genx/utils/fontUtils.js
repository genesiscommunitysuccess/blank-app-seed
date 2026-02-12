const path = require('path');

// Extract font family from filename
// "Overpass-Regular.ttf" -> "Overpass"
// "Open-Sans-Bold.woff2" -> "Open Sans"
// "RobotoMono-Regular.ttf" -> "RobotoMono"
function extractFontFamily(filename) {
  const baseName = path.basename(filename, path.extname(filename));
  
  // Remove common weight/style keywords
  const keywords = /(Regular|Bold|Light|Medium|Thin|Black|Heavy|Italic|Oblique|SemiBold|ExtraBold|UltraLight|DemiBold|ExtraLight|UltraBold)$/i;
  const withoutKeywords = baseName.replace(keywords, '').replace(/[-_]$/, '');
  
  // Convert hyphens between capitalized words to spaces (Open-Sans -> Open Sans)
  // But keep single-word fonts intact (RobotoMono stays RobotoMono)
  const parts = withoutKeywords.split(/[-_]/);
  if (parts.length > 1 && parts.every(p => p && p[0] === p[0].toUpperCase())) {
    return parts.join(' ').trim();
  }
  
  return withoutKeywords.trim() || baseName;
}

// Infer font weight from filename
function inferFontWeight(filename) {
  const lower = filename.toLowerCase();
  if (lower.includes('thin')) return '100';
  if (lower.includes('extralight') || lower.includes('ultralight')) return '200';
  if (lower.includes('light')) return '300';
  if (lower.includes('regular') || lower.includes('normal')) return '400';
  if (lower.includes('medium')) return '500';
  if (lower.includes('semibold') || lower.includes('demibold')) return '600';
  if (lower.includes('bold') && !lower.includes('semi') && !lower.includes('extra')) return '700';
  if (lower.includes('extrabold') || lower.includes('ultrabold')) return '800';
  if (lower.includes('black') || lower.includes('heavy')) return '900';
  return '400'; // default
}

// Get font format from extension
function getFontFormat(filename) {
  const ext = path.extname(filename).toLowerCase();
  const formatMap = {
    '.ttf': 'truetype',
    '.otf': 'opentype',
    '.woff': 'woff',
    '.woff2': 'woff2',
    '.eot': 'embedded-opentype'
  };
  return formatMap[ext] || 'truetype';
}

// Process font files and prepare data
function processFontFiles(customFonts) {
  if (!customFonts || !customFonts.files || !customFonts.files.length) {
    return null;
  }
  
  const files = Array.isArray(customFonts.files) ? customFonts.files : [customFonts.files];
  const fontFamily = customFonts.family || extractFontFamily(files[0]);
  
  const fontData = files.map(file => ({
    filename: path.basename(file),
    weight: inferFontWeight(file),
    format: getFontFormat(file)
  }));
  
  return { fontFamily, fontData };
}

module.exports = {
  extractFontFamily,
  inferFontWeight,
  getFontFormat,
  processFontFiles,
};
