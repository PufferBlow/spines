import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { EXPRESSIONS, TONES } from "./identity";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));

describe("the repo", () => {
  it("has its derived files up to date", () => {
    expect(() => execFileSync(process.execPath, [join(root, "scripts", "build.mjs"), "--check"], { stdio: "pipe" })).not.toThrow();
  });

  it("ships a fish for every face and every tone the code can pick", () => {
    for (const expression of EXPRESSIONS) {
      for (const tone of TONES) expect(existsSync(join(root, manifest.avatars.files[expression][tone])), `${expression} ${tone}`).toBe(true);
    }
  });

  it("lists only files that exist", () => {
    const listed: string[] = [
      ...Object.values<string>(manifest.patterns),
      ...manifest.marks,
      ...manifest.cli.glyphs,
      ...manifest.css,
      ...manifest.tokens,
      ...manifest.specs,
      ...manifest.loader.map((l: { file: string }) => l.file),
      ...Object.values<{ svg: string[] }>(manifest.logo).flatMap((l) => l.svg),
    ];
    for (const file of listed) expect(existsSync(join(root, file)), file).toBe(true);
  });

  it("keeps the terminal marks the sizes the design sheet names", () => {
    const marks = JSON.parse(readFileSync(join(root, "cli", "marks.json"), "utf8")) as Record<string, string[]>;
    expect(Object.keys(marks).sort()).toEqual(["ascii-24", "ascii-40", "braille-12", "braille-24", "braille-8", "half-16", "half-26", "half-40"]);
    for (const [key, rows] of Object.entries(marks)) {
      const width = Number(key.split("-")[1]);
      expect(Math.max(...rows.map((r) => [...r].length)), key).toBeLessThanOrEqual(width);
    }
  });

  it("gives every motion class a reduced-motion rule", () => {
    const motion = readFileSync(join(root, "css", "motion.css"), "utf8");
    const reduced = motion.slice(motion.indexOf("@media (prefers-reduced-motion"));
    for (const [, name] of motion.matchAll(/^\.(pb-anim-[a-z]+)\s*\{/gm)) expect(reduced, name).toContain(`.${name}`);
  });

  it("states tokens once: every colour in tokens.json is in theme.css", () => {
    const tokens = JSON.parse(readFileSync(join(root, "tokens", "tokens.json"), "utf8")) as Record<string, Record<string, string>>;
    const theme = readFileSync(join(root, "tokens", "theme.css"), "utf8");
    for (const name of Object.keys(tokens.color!)) expect(theme).toContain(`${name}:`);
  });
});
