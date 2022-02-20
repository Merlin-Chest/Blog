import typescript from "@rollup/plugin-typescript";

export default {
  input: 'src/promise.ts',
  output: [
    {
      format: "cjs",
      file: "lib/bundle.cjs.js",
    },
    {
      format: "es",
      file: "lib/bundle.esm.js",
    },
  ],
  plugins: [
    typescript()
  ]
}