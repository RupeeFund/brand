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
const written = [];
const write = (path, data, meta) => {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
  written.push({ path, ...meta });
};

for (const entry of manifest.exports) {
  const { master, variant = "light", format, size, sizes, output } = entry;
  const { on, ...fills } = manifest.variants[variant];
  const svg = recolour(readFileSync(`masters/${master}.svg`, "utf8"), fills);
  const meta = { master, variant, format, size };
  if (format === "svg") write(output, svg, meta);
  else if (format === "png") write(output, png(svg, size), meta);
  else if (format === "ico")
    write(output, ico(sizes.map((s) => ({ size: s, data: png(svg, s) }))), meta);
  else throw new Error(`unknown format: ${format}`);
}

const shown = (file) => file.format === "svg" || (file.format === "png" && file.size <= 192);
const src = (file) => file.path.slice(EXPORTS.length + 1);
const figure = (images, bg, label) =>
  `<figure style="background:${colour(bg)}">${images}<figcaption>${label}</figcaption></figure>`;
const image = (file, width = file.size) =>
  `<img src="${src(file)}"${width ? ` width="${width}"` : ""} alt="">`;
const exportFigure = (file, bg) =>
  figure(image(file), bg, `${file.format === "svg" ? "SVG" : `${file.size} px`} on ${bg}`);
const groups = Object.groupBy(written.filter(shown), (f) => `${f.master} · ${f.variant}`);
const sections = Object.entries(groups).map(([title, files]) => {
  const figures = manifest.variants[files[0].variant].on.flatMap((bg) =>
    files.map((f) => exportFigure(f, bg)),
  );
  return `<section><h2>${title}</h2>\n<div class="row">\n${figures.join("\n")}\n</div></section>`;
});
const favicons = written
  .filter((f) => f.master === "mark-small" && f.format === "png")
  .map((f) => figure(image(f) + image(f, f.size * 8), "white", `${f.size} px`));
const favicon = src(written.find((f) => f.format === "ico"));
const list = written.map((f) => `<li><a href="${src(f)}">${f.path}</a></li>`);
const caption = [
  "font-size: 12px",
  "margin-top: .5rem",
  "padding: 0 .25rem",
  `background: ${colour("white")}`,
  `color: ${colour("ink-3")}`,
].join("; ");

write(
  `${EXPORTS}/preview.html`,
  `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>The Rupee Fund brand exports</title>
<link rel="icon" href="${favicon}">
<style>
body { font: 16px/1.5 system-ui, sans-serif; margin: 2rem; color: ${colour("ink")}; }
.row { display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; }
figure { margin: 0; padding: 1rem; border: 1px solid #ddd; }
figure img[src$=".svg"] { width: 240px; }
figcaption { ${caption}; }
.pixel img { image-rendering: pixelated; margin-right: 1rem; }
</style>
<h1>The Rupee Fund brand exports</h1>
<p>The build makes every file on this page. Do not edit them by hand.</p>
<section><h2>Favicon at real size and at 8 × zoom</h2>
<div class="row pixel">
${favicons.join("\n")}
</div></section>
${sections.join("\n")}
<section><h2>All files</h2>
<ul>
${list.join("\n")}
</ul></section>
</html>
`,
  { format: "html" },
);

console.log(`${written.length} files in ${EXPORTS}/`);
