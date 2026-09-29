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
  ["text", "paper", "ink"],
  ["text", "brand-200", "ink"],
  ["text", "brand", "ink"],
  ["text", "error", "white"],
  ["text", "error", "card"],
  ["text", "error", "paper"],
  ["graphic", "ink", "brand"],
  ["graphic", "border", "white"],
  ["graphic", "border", "card"],
  ["graphic", "border", "paper"],
];

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

export function contrastPairs(colours = tokenColours()) {
  return PAIRS.map(([kind, fg, bg]) => {
    const [a, b] = [colours.get(`color.${fg}`), colours.get(`color.${bg}`)];
    if (!a || !b) throw new Error(`unknown token in pair ${fg} on ${bg}`);
    const value = ratio(a, b);
    return { kind, fg, bg, ratio: value, minimum: MINIMUM[kind], pass: value >= MINIMUM[kind] };
  });
}
