import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { tokenColours } from "./tokens.mjs";

const EXPORTS = "exports";
const manifest = JSON.parse(readFileSync("assets.json", "utf8"));
const colours = tokenColours();

const colour = (name) => {
  const hex = colours.get(`color.${name}`);
  if (!hex) throw new Error(`unknown colour token: ${name}`);
  return hex;
};

function recolour(svg, fills) {
  let out = svg;
  for (const [id, token] of Object.entries(fills)) {
    const element = new RegExp(`<[a-z]+ [^>]*\\bid="${id}"[^>]*/>`);
    if (!element.test(out)) throw new Error(`no element with id="${id}"`);
    out = out.replace(element, (tag) => tag.replace(/ fill="[^"]*"/, ` fill="${colour(token)}"`));
  }
  return out;
}

const png = (svg, size) =>
  new Resvg(svg, { fitTo: { mode: "width", value: size }, shapeRendering: 2 }).render().asPng();

function compose(svg, width, { height, background, logoWidth }) {
  const [, , , vbWidth, vbHeight] = svg.match(/viewBox="([\d.-]+) ([\d.-]+) ([\d.]+) ([\d.]+)"/);
  const logoHeight = (logoWidth * vbHeight) / vbWidth;
  const x = (width - logoWidth) / 2;
  const y = (height - logoHeight) / 2;
  const placed = svg.replace(
    /<svg\b/,
    `<svg x="${x}" y="${y}" width="${logoWidth}" height="${logoHeight}"`,
  );
  const size = `width="${width}" height="${height}"`;
  const fill = `<rect ${size} fill="${colour(background)}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" ${size}>${fill}${placed}</svg>`;
}

function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + 16 * i;
    header.writeUInt8(size % 256, entry);
    header.writeUInt8(size % 256, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

rmSync(EXPORTS, { recursive: true, force: true });
const write = (path, data) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
};

for (const { master, variant, format, size, sizes, canvas, output } of manifest.exports) {
  const fills = variant ? manifest.variants[variant] : {};
  const art = recolour(readFileSync(`masters/${master}.svg`, "utf8"), fills);
  const svg = canvas ? compose(art, size, canvas) : art;
  if (format === "svg") write(output, svg);
  else if (format === "png") write(output, png(svg, size));
  else if (format === "ico") write(output, ico(sizes.map((s) => ({ size: s, data: png(svg, s) }))));
  else throw new Error(`unknown format: ${format}`);
}

write(`${EXPORTS}/tokens.json`, readFileSync("tokens/tokens.json"));

console.log(`${manifest.exports.length + 1} files in ${EXPORTS}/`);
