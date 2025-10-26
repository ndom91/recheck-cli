# ⌨️ Recheck CLI

Version](https://img.shields.io/npm/v/recheck-cli?style=flat-square)](https://www.npmjs.com/package/recheck-cli)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ndom91/recheck-cli?label=size&style=flat-square)](https://github.com/ndom91/recheck-cli)
[![GitHub](https://img.shields.io/github/license/ndom91/recheck-cli?style=flat-square)](https://github.com/ndom91/recheck-cli)

The [MakeNowJust-Labo/recheck](https://github.com/MakeNowJust-Labo/recheck) ReDoS checker in CLI form.

Just pass it a path glob and let it do the checking!


<p align="left">
    <img src="https://user-images.githubusercontent.com/7415984/118409060-f066ab80-b688-11eb-9a01-efe358ee7ed1.gif" alt="Screen recording of using the CLI.">
</p>

## 📑 Summary

This is a little CLI used to find Regex Denial-of-Service ([ReDos](https://en.wikipedia.org/wiki/ReDoS)) problems in your code. This can happen when a regular expression is built in a way where the time it takes to run it grows exponentially when certain input strings are used, causing the aforementioned denial-of-service.

Here we scan use the [ReCheck](https://github.com/MakeNowJust-Labo/recheck) javascript ReDos scanner to go over your glob pattern of files to test them for vulnerable RegEx patterns.

## 🖨️ Usage

In general, you just pass a path glob as the first argument, and it will scan all matching files for regexes and subsequently run those regexes through the redos checker, printing all matching vulnerable regexes at the end.

We have statically linked binaries for MacOS, Windows and Linux available in the `Releases` here on Github, just download them and run them on the commandline like so:

```bash
./recheck-cli-linux "src/**/*.js"
```

This package is also published on npm, so you can run it with `npx` without having to manually install it first.

```bash
npx recheck-cli "**/*.js"
```

You can include the `node_modules` directories (ignored by default) by passing the `-n` flag before the glob pattern.

Example Output:

```
$ /opt/ndomino/recheck-cli/cli.js 'functions/**/*.js'

recheck results:

> Go to https://makenowjust-labo.github.io/recheck/ for more details
> or if you want to double-check the matched regexes.

---

Checking 139 files...


File: functions/src/api-check-runner/src/api-check-runner.js
  Unsafe Regex
    - (L275) headersCopy['content-type'].match(/application\/.*\+json/) // This tackles all vendor specific json media types
      - Summary: 2nd degree polynomial

File: functions/src/browser-check-common/src/Uploader.js
  Unsafe Regex
    - (L8) const SUPPORTED_FILE_FORMAT_REGEX = /^([a-zA-Z0-9-_@]+|\.\/)+\.(png|jpg|jpeg|pdf)$/m
      - Summary: exponential
```

## 🚧 Contributing

Open to all PRs


<p align="center">
    <sub>
        Project by ndom91, released under <a href="https://github.com/ndom91/recheck-cli/blob/main/LICENSE">MIT license</a>.
    </sub>
</p>
<p align="center">
    <a href="https://twitter.com/ndom91">
        <img alt="Nico Domino on Twitter" src="https://raw.githubusercontent.com/leodr/fill-packagejson/main/assets/twitter.svg">
    </a>
    &nbsp;&nbsp;
    <a href="https://github.com/ndom91">
        <img alt="Nico Domino on GitHub" src="https://raw.githubusercontent.com/leodr/fill-packagejson/main/assets/github.svg">
    </a>
</p>
