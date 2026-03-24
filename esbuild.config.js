import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["server/index.ts"],
  outfile: "dist/index.cjs",
  bundle: true,
  platform: "node",
  format: "cjs",
  target: "node20",
  external: [
    "pg-native",
    "better-sqlite3",
  ],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

console.log("Server bundled to dist/index.cjs");
