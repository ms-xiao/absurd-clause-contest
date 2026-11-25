// absurd-clause-contest — "The Absurd Clause Contest".
//
// The entry is one sentence (at most 200 characters): an absurd clause
// hidden deep inside a terms-of-service agreement. This program copies
// the finished line to the output directory, so both graded runs write
// identical bytes. Node 22, standard library only, no network.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.txt");

// Counts characters the way a reader sees them: one per code point.
function countCodePoints(value) {
  return Array.from(value).length;
}

// Read as bytes so the copy below is byte-exact.
const source = readFileSync(join(here, "entry.txt"));
if (source.length === 0) throw new Error("entry.txt is empty");

const text = source.toString("utf8");
// Gate 1: 1–200 characters. Array.from splits on code points, so an
// astral character (emoji, rare CJK) counts as one, not two.
const charCount = countCodePoints(text);
if (charCount < 1 || charCount > 200) {
  throw new Error(`entry.txt is ${charCount} characters, expected 1–200`);
}
// Gate 2: exactly one line — no line breaks and no trailing newline.
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry.txt must be a single line with no line breaks");
}
// Gate 3: no leading or trailing whitespace — the clause must start
// with its first word and end with its final stop.
if (text.trim() !== text) {
  throw new Error("entry.txt must not start or end with whitespace");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(target, source);
// Confirm the copy landed intact: same byte length, then same bytes.
const copied = readFileSync(target);
if (copied.length !== source.length) {
  throw new Error(
    `entry.txt copy is ${copied.length} bytes, expected ${source.length}`,
  );
}
if (!copied.equals(source)) {
  throw new Error("entry.txt copy mismatch");
}
process.stdout.write(text);
