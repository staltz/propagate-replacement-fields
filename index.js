#! /usr/bin/env node
var fs = require("fs");
var path = require("path");

var argv = require("yargs")
  .usage("Usage: $0 [options]")
  .example("$0 --field=browser")
  .option("field", {
    alias: "f",
    description: "package.json field with replacement modules"
  })
  .option("source", {
    alias: "s",
    description:
      "where to look for the source package.json.\ndefault: process.cwd()"
  })
  .option("destination", {
    alias: "d",
    description:
      "where is the node_modules where propagation will happen.\n" +
      "default: ./"
  })
  .demandOption("field")
  .help().argv;

var destinationPath = argv.destination ? argv.destination : "./";
var sourcePath = argv.source ? argv.source : process.cwd();
var sourcePackageJsonPath = path.join(sourcePath, "package.json");
var sourcePackageJson = JSON.parse(
  fs.readFileSync(sourcePackageJsonPath, "utf-8")
);

function insertShims(currentPath, field) {
  if (!fs.existsSync(path.join(currentPath, "./node_modules"))) {
    return;
  }

  var nodeModules = fs
    .readdirSync(path.join(currentPath, "./node_modules"))
    .map(m => path.join(currentPath, "./node_modules", m))
    .filter(m => fs.statSync(m).isDirectory)
    .filter(m => fs.existsSync(path.join(m, "package.json")));

  nodeModules.forEach(modulePath => {
    try {
      var packageJsonPath = path.join(modulePath, "package.json");
      var prevFileContent = fs.readFileSync(packageJsonPath, "utf-8");
      var packageJson = JSON.parse(prevFileContent);
      if (!(field in packageJson)) {
        packageJson[field] = {};
      }
      Object.keys(sourcePackageJson[field]).forEach(replaced => {
        const replacer = sourcePackageJson[field][replaced];
        if (
          replacer !== packageJson.name &&
          !(replaced in packageJson[field])
        ) {
          packageJson[field][replaced] = replacer;
        }
      });
      var nextFileContent = JSON.stringify(packageJson, null, "  ");
      fs.writeFileSync(packageJsonPath, nextFileContent, "utf-8");

      insertShims(modulePath, field);
    } catch (e) {
      console.error(e);
    }
  });
}

if (!(argv.field in sourcePackageJson)) {
  console.error(
    'ERROR: Field "' +
      argv.field +
      '" was not found in ' +
      sourcePackageJsonPath +
      ", so we can't propagate that."
  );
  console.error(
    "Look at that:\n\n" + JSON.stringify(sourcePackageJson, null, 2)
  );
} else {
  insertShims(destinationPath, argv.field);
}
