const { resolve } = require('node:path');
const { renameSync, readdirSync, statSync, writeFileSync } = require('node:fs');

const listAllFiles = (startPath, filter = (e) => true) => {
  const filenames = new Set();
  const walk = (dirPath) => {
    const files = readdirSync(dirPath);
    for (const file of files) {
      const fullPath = resolve(dirPath, file);
      const stats = statSync(fullPath);
      const isDir = stats.isDirectory();
      const entry = { path: fullPath, stats, isDir };
      if (filter(entry)) {
        if (isDir) {
          walk(fullPath);
        } else {
          filenames.add(entry);
        }
      }
    }
  };
  walk(startPath);
  return [...filenames];
};

const rename = (from, to, dir) => renameSync(resolve(dir, from), resolve(dir, to));

const writeJSON = (path, data) => {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(`Error writing to ${path}`);
  }
}

module.exports = {
  listAllFiles,
  rename,
  writeJSON,
};