#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { Liquid } = require("liquidjs");
// const { spawn } = require("child_process");

const useReact = process.argv.includes("--react");
const pkgdir = path.resolve(__dirname);

const dist = path.join(pkgdir, useReact ? "dist-react" : "dist");
const load = name => fs.readFileSync(path.join(dist, name), "utf-8");

const template = fs.readFileSync(
  path.join(pkgdir, "template.bash.j2"),
  "utf-8"
);

const engine = new Liquid();
const script = engine.parseAndRenderSync(template, {
  useReact,
  eslintrc: load(".eslintrc.js"),
  prettierrc: load(".prettierrc"),
  editorconfig: load(".editorconfig"),
});

console.log(script);

// const setup = spawn("bash", ["-c", script]);
// setup.stdout.on("data", data => process.stdout.write(data));
// setup.stdout.on("end", () => {});
// setup.stderr.on("data", data => process.stderr.write(data));
// setup.stderr.on("end", () => {});
// setup.on("exit", code => {
//   if (code !== 0) console.log(`Failed: ${code}`);
// });
