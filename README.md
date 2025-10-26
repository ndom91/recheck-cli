# ⌨️ Recheck CLI

[![Version](https://img.shields.io/npm/v/recheck-cli?style=flat-square)](https://www.npmjs.com/package/recheck-cli)
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

This package is also published on npm, so you can run it with `npx`/`pnpx` without having to manually install it first.

```bash
pnpx recheck-cli "**/*.js"
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
    <a href="https://bsky.app/profile/ndo.dev">
        <svg width="28" fill="none" style="width:28px;height:24.9375px" viewBox="0 0 64 57">
            <path fill="#0085ff" d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805m36.254 0C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745"/>
        </svg>
    </a>
    &nbsp;&nbsp;
    <a href="https://github.com/ndom91">
        <svg width="24" height="24" aria-hidden="true" class="octicon octicon-mark-github" data-view-component="true" viewBox="0 0 24 24"><path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.2 10.2 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11"/></svg>
    </a>
</p>
