import { readFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { tokenColours } from "./tokens.mjs";

const REFERENCE = "logo/logo-rupee-fund.png";
const MASTER = process.argv[2] ?? "masters/lockup.svg";
const WIDTH = 521;
const HEIGHT = 269;
const PLACEMENT = { x: 29.53, y: 40.2, scale: 0.08344 };
const THRESHOLD = 0.03;
const BRAND = 1;
const INK = 2;
const PARTS = {
  block: { colour: BRAND, x0: 25, y0: 36, x1: 114, y1: 240 },
  rupee: { colour: INK, x0: 25, y0: 36, x1: 114, y1: 240 },
  wordmark: { colour: INK, x0: 114, y0: 90, x1: 500, y1: 250 },
  canvas: { colour: null, x0: 0, y0: 0, x1: WIDTH, y1: HEIGHT },
};
const PAPER = "#ffffff";
const REFERENCE_PALETTE = [PAPER, "#08b74f", "#1a1a1a"];

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function render(svg) {
  const image = new Resvg(svg, { imageRendering: 1, shapeRendering: 2 }).render();
  if (image.width !== WIDTH || image.height !== HEIGHT)
    throw new Error(`rendered ${image.width} × ${image.height}, expected ${WIDTH} × ${HEIGHT}`);
  return image.pixels;
}

function classify(pixels, palette) {
  const colours = palette.map(rgb);
  const classes = new Uint8Array(WIDTH * HEIGHT);
  for (let i = 0; i < classes.length; i++) {
    let best = Infinity;
    colours.forEach(([r, g, b], c) => {
      const d =
        (pixels[i * 4] - r) ** 2 + (pixels[i * 4 + 1] - g) ** 2 + (pixels[i * 4 + 2] - b) ** 2;
      if (d < best) [best, classes[i]] = [d, c];
    });
  }
  return classes;
}

function score(a, b, { colour, x0, y0, x1, y1 }) {
  let mismatched = 0;
  let covered = 0;
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = y * WIDTH + x;
      const inA = colour === null ? a[i] > 0 : a[i] === colour;
      const inB = colour === null ? b[i] > 0 : b[i] === colour;
      if (inA || inB) covered++;
      if (inA !== inB) mismatched++;
    }
  return covered ? mismatched / covered : 1;
}

const size = `width="${WIDTH}" height="${HEIGHT}"`;
const frame = (content) =>
  `<svg xmlns="http://www.w3.org/2000/svg" ${size}><rect ${size} fill="${PAPER}"/>${content}</svg>`;

const master = readFileSync(MASTER, "utf8");
const root = master.match(/<svg\b[^>]*>/)[0];
const viewBox = root.match(/viewBox="([\d.-]+) ([\d.-]+) ([\d.]+) ([\d.]+)"/);
if (!viewBox || /\s(width|height|x|y)=/.test(root))
  throw new Error(`${MASTER}: the root <svg> needs a viewBox and no width, height, x or y`);
const [, , , vbWidth, vbHeight] = viewBox.map(Number);
const { x, y, scale } = PLACEMENT;
const placed = master.replace(
  /<svg\b/,
  `<svg x="${x}" y="${y}" width="${vbWidth * scale}" height="${vbHeight * scale}"`,
);
const png = readFileSync(REFERENCE).toString("base64");
const tokens = tokenColours();

const expected = classify(
  render(frame(`<image width="${WIDTH}" height="${HEIGHT}" href="data:image/png;base64,${png}"/>`)),
  REFERENCE_PALETTE,
);
const actual = classify(render(frame(placed)), [
  PAPER,
  tokens.get("color.brand"),
  tokens.get("color.ink"),
]);

let failed = false;
for (const [name, part] of Object.entries(PARTS)) {
  const s = score(expected, actual, part);
  const pass = s <= THRESHOLD;
  failed ||= !pass;
  console.log(
    `${pass ? "pass" : "FAIL"} ${name} ${(s * 100).toFixed(2)} % (max ${THRESHOLD * 100} %)`,
  );
}
process.exit(failed ? 1 : 0);
