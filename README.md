# Propagate Replacement Fields

> Take a package.json field and copy paste its contents to all package.json of modules inside `/node_modules`

So let's imagine you have these replacement modules (e.g. for browserify) in your project's package.json:

```
  "browser": {
    "stream": "stream-browserify",
    "os": "os-browserify"
  }
```

Or in your React Native project:

```
  "react-native": {
    "crypto": "react-native-crypto",
    "tcp": "react-native-tcp",
    "fs": false
  }
```

And you want those to be present also in the package.json for each module installed in your project's `/node_modules`. This is sometimes needed, specially for eccentric React Native projects using Node.js specific stuff.

So that's when you use `propagate-replacement-fields`, like this:

```
npm install --save-dev propagate-replacement-fields
```

```
./node_modules/.bin/propagate-replacement-fields --field=browser
```

And then that field `"browser"` from your project's package.json will be cloned also into the dependencies installed in node_modules.

Note, if you want to specify where is the source `package.json`, you can pass its path to `--source`:

```
./node_modules/.bin/propagate-replacement-fields --field=browser --source=../over-there
```

Similarly, if you want to specify where is the destination `node_modules`, you
can pass its path to `--destination` (no need to specify the last part, "/node_modules"):

```
./node_modules/.bin/propagate-replacement-fields --field=browser --destination=./over-here
```

## install

```
npm install propagate-replacement-fields
```

## usage

```
propagate-replacement-fields --help
```

```
Usage: propagate-replacement-fields [options]

Options:
  --field, -f        package.json field with replacement modules      [required]
  --source, -s       where to look for the source package.json.
                     default: process.cwd()
  --destination, -d  where is the node_modules where propagation will happen.
                     default: ./
  --help             Show help                                         [boolean]

Examples:
  propagate-replacement-fields --field=browser
```

## license

MIT, Andre Staltz

## versioning

This package follows [ComVer](https://github.com/staltz/comver), not SemVer.
