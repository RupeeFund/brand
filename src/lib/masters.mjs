import { readFileSync } from "node:fs";

const attribute = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

export function readMaster(name) {
  const svg = readFileSync(`masters/${name}.svg`, "utf8");
  const element = (id) => svg.match(new RegExp(`<[a-z]+ [^>]*\\bid="${id}"[^>]*/>`))?.[0];
  const part = (id) => {
    const tag = element(id);
    return tag && { d: attribute(tag, "d") };
  };
  const block = element("block");
  return {
    viewBox: attribute(svg.match(/<svg\b[^>]*>/)[0], "viewBox"),
    block: { width: attribute(block, "width"), height: attribute(block, "height") },
    rupee: part("rupee"),
    wordmark: part("wordmark"),
  };
}

function xRange(subpath) {
  const xs = [];
  let command = "";
  let index = 0;
  for (const [, letter, number] of subpath.matchAll(/([A-Za-z])|(-?[\d.]+)/g)) {
    if (letter) {
      if (letter !== letter.toUpperCase()) throw new Error(`relative command ${letter}`);
      [command, index] = [letter, 0];
      continue;
    }
    const isX = command === "H" || (command !== "V" && index % 2 === 0);
    if (isX) xs.push(Number(number));
    index++;
  }
  return [Math.min(...xs), Math.max(...xs)];
}

export function splitLetters(d) {
  const letters = [];
  const subpaths = d.split(/(?=M)/).map((subpath) => [subpath, ...xRange(subpath)]);
  subpaths.sort((a, b) => b[2] - b[1] - (a[2] - a[1]));
  for (const [subpath, min, max] of subpaths) {
    const outer = letters.find((l) => min >= l.min && max <= l.max);
    if (outer) outer.d += subpath;
    else letters.push({ d: subpath, min, max });
  }
  return letters.sort((a, b) => a.min - b.min).map((l) => l.d);
}
