await Bun.build({
  entrypoints: ["src/index.ts"],
  minify: {
    whitespace: true,
    syntax: true,
  },
  outdir: "dist",
  bytecode: true,
});
