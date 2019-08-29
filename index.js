#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const GithubContent = require("github-content");

const gc = GithubContent({
  owner: "andrewsosa",
  repo: "react-dev-tools",
});

fs.readdir(path.join(path.resolve(__dirname), "dist"), (err, items) => {
  const dist = items.map(el => path.join("dist", el));

  gc.files(dist, (errr, files) => {
    if (errr) return console.log(errr);
    files.map(({ path, contents }) => console.log(path, contents.toString()));
  });
});
