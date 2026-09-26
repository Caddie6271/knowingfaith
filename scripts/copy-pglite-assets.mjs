import { copyFileSync, existsSync } from "node:fs";

const dest = ".vercel/output/functions/__server.func/_libs";
if (!existsSync(dest)) process.exit(0);

for (const name of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  copyFileSync(`node_modules/@electric-sql/pglite/dist/${name}`, `${dest}/${name}`);
}
