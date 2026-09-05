// Point at a running dev or start server: PORT=3111 npm run check:assets
const BASE = `http://localhost:${process.env.PORT ?? 3000}`;

const routes = ["/", "/robot", "/engineering", "/team", "/impact", "/season", "/awards", "/sponsors", "/sponsors/join"];
const refs = new Map();

for (const r of routes) {
  const html = await (await fetch(`${BASE}${r}`)).text();
  // Direct asset paths plus the url= param Next/Image encodes
  for (const m of html.matchAll(/(?:src|href|poster)="(\/[^"]+?\.(?:png|jpe?g|svg|mp4|webm|glb|pdf))"/gi)) {
    refs.set(m[1], r);
  }
  for (const m of html.matchAll(/url=%2F([^&"]+)/gi)) {
    refs.set("/" + decodeURIComponent(m[1]), r);
  }
}

let bad = 0;
for (const [path, route] of [...refs].sort()) {
  const res = await fetch(`${BASE}${path}`, { method: "HEAD" });
  if (!res.ok) { console.log(`  ${res.status}  ${path}   (on ${route})`); bad++; }
}
console.log(`\nchecked ${refs.size} asset refs across ${routes.length} routes — ${bad} broken`);
