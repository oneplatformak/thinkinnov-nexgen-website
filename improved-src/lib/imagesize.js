/** Reads the pixel size of a WebP file under docs/, so <img> tags can reserve the right space. */
const fs = require("fs");
const path = require("path");

const DOCS = path.join(__dirname, "..", "..", "docs");
const cache = new Map();

function webpSize(rel) {
  if (cache.has(rel)) return cache.get(rel);
  const buf = fs.readFileSync(path.join(DOCS, rel));
  const kind = buf.toString("ascii", 12, 16);
  let size;
  if (kind === "VP8 ") size = [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  else if (kind === "VP8L") {
    const bits = buf.readUInt32LE(21);
    size = [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  } else if (kind === "VP8X") size = [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  else throw new Error(`Not a WebP file: ${rel}`);
  cache.set(rel, size);
  return size;
}

module.exports = { webpSize };
