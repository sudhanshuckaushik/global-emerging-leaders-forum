// One-off: pull the PHOTOS (jpeg only) out of the original index.html into files,
// dedupe by content hash, print a manifest. Partner LOGOS are NOT extracted —
// they live as SVGs in brand-kit/assets/logos/.
import fs from "node:fs";
import crypto from "node:crypto";

const html = fs.readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const outDir = new URL("../public/images/photos/", import.meta.url);
fs.mkdirSync(outDir, { recursive: true });

// jpeg only → photographs; png data URIs are logos and are skipped.
const re = /data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/g;
const seen = new Map();
const order = [];
let m;
while ((m = re.exec(html))) {
  const data = m[1];
  const hash = crypto.createHash("sha1").update(data).digest("hex").slice(0, 8);
  order.push({ hash, kb: Math.round(Math.floor((data.length * 3) / 4) / 1024) });
  if (!seen.has(hash)) {
    const name = `photo-${hash}.jpg`;
    seen.set(hash, name);
    fs.writeFileSync(new URL(name, outDir), Buffer.from(data, "base64"));
  }
}

console.log(`jpeg occurrences: ${order.length}  unique photos: ${seen.size}\n`);
console.log("— document order (maps to: why-hero, why-conference, then 10 mosaic) —");
order.forEach((o, i) => console.log(String(i).padStart(2), o.hash, `${o.kb}KB`));
console.log("\n— unique files written —");
for (const [, name] of seen) {
  const size = fs.statSync(new URL(name, outDir)).size;
  console.log(name, `${Math.round(size / 1024)}KB`);
}
