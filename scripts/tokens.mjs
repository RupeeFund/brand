import { readFileSync } from "node:fs";

export function tokenColours(path = "tokens/tokens.json") {
  const colours = new Map();
  const walk = (node, name) => {
    if (node?.$value?.hex) colours.set(name, node.$value.hex.toLowerCase());
    for (const [key, child] of Object.entries(node ?? {}))
      if (!key.startsWith("$") && typeof child === "object")
        walk(child, name ? `${name}.${key}` : key);
  };
  walk(JSON.parse(readFileSync(path, "utf8")), "");
  return colours;
}
