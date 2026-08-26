import sharp from "sharp";
import { readFileSync } from "fs";

const svg = readFileSync(
  new URL("../public/apple-touch-icon.svg", import.meta.url),
);

await sharp(svg).resize(180, 180).png().toFile("public/apple-touch-icon.png");
console.log("✓ Generated public/apple-touch-icon.png (180×180)");
