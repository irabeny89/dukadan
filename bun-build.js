await Bun.build({
	target: "bun",
	entrypoints: ["src/index.ts"],
	minify: {
		whitespace: true,
		syntax: true,
	},
	outdir: "dist",
	bytecode: true,
});
