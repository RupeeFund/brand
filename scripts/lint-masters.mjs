import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tokenColours } from "./tokens.mjs";

const allowed = new Set([...tokenColours().values(), "none"]);
const dir = process.argv[2] ?? "masters";
const files = readdirSync(dir).filter((name) => name.endsWith(".svg"));
const problems = [];

if (files.length === 0) problems.push(`${dir}: no SVG masters`);

for (const name of files) {
  const svg = readFileSync(join(dir, name), "utf8");
  const report = (message) => problems.push(`${name}: ${message}`);
  for (const tag of ["text", "image", "style", "use", "foreignObject"])
    if (new RegExp(`<${tag}[\\s>/]`).test(svg)) report(`holds <${tag}>`);
  if (/\sstyle=/.test(svg)) report("holds a style attribute");
  if (/\s(opacity|fill-opacity|stroke-opacity)=/.test(svg)) report("holds an opacity attribute");
  for (const [, tag, attrs] of svg.matchAll(
    /<(path|rect|circle|ellipse|polygon|polyline|line)\b([^>]*)>/g,
  ))
    if (!/\sfill="/.test(attrs)) report(`<${tag}> has no explicit fill`);
  for (const [, attr, value] of svg.matchAll(/\s(fill|stroke|stop-color|color)="([^"]*)"/g))
    if (!allowed.has(value.toLowerCase())) report(`${attr}="${value}" is not a token colour`);
}

for (const problem of problems) console.error(problem);
process.exit(problems.length ? 1 : 0);
