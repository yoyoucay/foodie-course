// One-off helper: pushes the demo images in assets/ into the R2 bucket
// under the same keys referenced by db/seed.sql.
//
// Usage:
//   node scripts/upload-seed-images.mjs           (local dev bucket)
//   node scripts/upload-seed-images.mjs --remote   (deployed bucket)

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.join(__dirname, "..", "assets");
const bucketName = "foodie-course-images";
const remote = process.argv.includes("--remote");

const images = [
  "burger.jpg",
  "curry.jpg",
  "dumplings.jpg",
  "macncheese.jpg",
  "pizza.jpg",
  "schnitzel.jpg",
  "tomato-salad.jpg",
];

for (const image of images) {
  const filePath = path.join(assetsDir, image);
  if (!existsSync(filePath)) {
    console.warn(`Skipping ${image}: not found in assets/`);
    continue;
  }

  const args = [
    "wrangler",
    "r2",
    "object",
    "put",
    `${bucketName}/${image}`,
    `--file=${filePath}`,
  ];
  if (remote) args.push("--remote");

  console.log(`Uploading ${image}...`);
  // npx is a .cmd shim on Windows; execFileSync needs a shell to resolve it there.
  execFileSync("npx", args, { stdio: "inherit", shell: process.platform === "win32" });
}

console.log("Done.");
