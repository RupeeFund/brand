import { tokenColours } from "./tokens.mjs";

const MINIMUM = { text: 4.5, graphic: 3 };
const PAIRS = [
  ["text", "ink", "white"],
  ["text", "ink", "paper"],
  ["text", "ink", "card"],
  ["text", "ink-2", "white"],
  ["text", "ink-2", "paper"],
  ["text", "ink-3", "white"],
  ["text", "ink-3", "paper"],
  ["text", "brand-fg", "white"],
  ["text", "brand-fg", "paper"],
  ["text", "brand-fg", "brand-50"],
  ["text", "brand-900", "brand-50"],
  ["text", "white", "brand-fg"],
  ["text", "white", "ink"],
  ["graphic", "ink", "brand"],
  ["graphic", "brand", "ink"],
];

const colours = tokenColours();

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

let failed = false;
for (const [kind, fg, bg] of PAIRS) {
  const [a, b] = [colours.get(`color.${fg}`), colours.get(`color.${bg}`)];
  if (!a || !b) throw new Error(`unknown token in pair ${fg} on ${bg}`);
  const r = ratio(a, b);
  const pass = r >= MINIMUM[kind];
  failed ||= !pass;
  console.log(
    `${pass ? "pass" : "FAIL"} ${kind} ${fg} on ${bg} ${r.toFixed(2)}:1 (min ${MINIMUM[kind]})`,
  );
}
process.exit(failed ? 1 : 0);
