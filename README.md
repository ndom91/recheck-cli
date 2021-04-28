# ⭐ Recheck CLI

[MakeNowJust-Labo/recheck](https://github.com/MakeNowJust-Labo/recheck) in CLI form.

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

## 🚧 Contributing

Open to all PRs

## 📝 License

MIT
