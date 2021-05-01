# ⌨️ Recheck CLI

The [MakeNowJust-Labo/recheck](https://github.com/MakeNowJust-Labo/recheck) ReDoc checker in CLI form.

Just pass a path glob and let it do the checking!

## 📑 Summary

This is a little CLI used to find Regex Denial-of-Service ([ReDos](https://en.wikipedia.org/wiki/ReDoS))) problems in your code. This can happen when a regular expression is built in a way where the time it takes to run it grows exponentially when certain input strings are used, causing the aforementioned denial-of-service.

Here we scan use the [ReCheck](https://github.com/MakeNowJust-Labo/recheck) javascript ReDos scanner to go over your glob pattern of files to test them for vulnerable RegEx patterns.

## 🖨️ Usage

Just pass a path glob as the first argument, and it will scan all matching files for regexes and subsequently run those through the recheck redos checker.

```bash
recheck "**/*.js"
```

Or you can include `node_modules` by passing the `-n` flag before the glob pattern.

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

## 📝 License

MIT
