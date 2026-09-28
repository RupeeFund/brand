import { contrastPairs } from "./colour.mjs";

let failed = false;
for (const { kind, fg, bg, ratio, minimum, pass } of contrastPairs()) {
  failed ||= !pass;
  console.log(
    `${pass ? "pass" : "FAIL"} ${kind} ${fg} on ${bg} ${ratio.toFixed(2)}:1 (min ${minimum})`,
  );
}
process.exit(failed ? 1 : 0);
