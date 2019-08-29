#!/usr/bin/env node

const fs = require("fs");
const shell = require("shelljs");
// const npm = require("npm-programmatic");
const path = require("path");
const ora = require("ora");
const GithubContent = require("github-content");

const packages = [
  "eslint",
  "eslint-config-airbnb-base",
  "eslint-config-prettier",
  "eslint-plugin-import",
  // "eslint-plugin-jest",
  "eslint-plugin-prettier",
  "eslint-plugin-react",
  // "jest",
  "prettier",
];

const installNpmModules = () =>
  new Promise((res, rej) => {
    const spinner = ora("Installing npm modules").start();

    if (!shell.which("npm")) {
      rej(new Error("npm not found"));
    }
    shell.exec(
      `npm i -D ${packages.join(" ")}`,
      { async: true, silent: true },
      (code, stdout, stderr) => {
        if (code !== 0) {
          spinner.fail("Installation failed.");
          console.log(stderr);
          rej(new Error("Installation failed."));
        }
        spinner.succeed();
        console.log(stdout);
        res();
      }
    );
  });

const downloadGithubConfigs = () =>
  new Promise((res, rej) => {
    // Download spinner
    const spinner = ora("Downloading config files").start();

    // Helper function to save a file while returning a promise.
    const writeFile = (name, contents) =>
      new Promise((rez, reg) =>
        fs.writeFile(name, contents, err => {
          if (err) return reg(err);
          spinner.succeed(`Downloaded ${name}`);
          rez();
        })
      );

    // Read the names of files we're installing from this package
    fs.readdir(path.join(path.resolve(__dirname), "dist"), (err, items) => {
      if (err) return rej(err);
      const dist = items.map(el => path.join("dist", el));

      const gc = GithubContent({
        owner: "andrewsosa",
        repo: "react-dev-tools",
      });

      // Download the files from Github
      gc.files(dist, (errr, files) => {
        if (errr) return rej(errr);

        // Save all the files
        Promise.all(
          files.map(({ path: filePath, contents }) =>
            writeFile(path.basename(filePath), contents)
          )
        )
          .then(() => res(spinner.succeed()))
          .catch(errrr => {
            spinner.fail();
            rej(errrr);
          });
      });
    });
  });

installNpmModules()
  .then(() => downloadGithubConfigs())
  .then(() => console.log("Setup complete."))
  .catch(err => console.log(err));
