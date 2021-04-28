#!/usr/bin/env node

const fs = require("fs/promises")
const glob = require("glob")
const meow = require("meow")
const { check } = require("@makenowjust-labo/recheck")

const cli = meow(
  `
	Usage
	  $ recheck [arguments] "<dir glob>"

		-n 	include node_modules (default: false)
	  
	Examples
	  $ recheck "**/*.js"
	  $ recheck -n "**/*.js"
`,
  {
    flags: {
      nodeModules: {
        type: "boolean",
        alias: "n",
      },
    },
  }
)

const [globPattern] = cli.input
const flags = cli.flags

if (!globPattern && process.stdin.isTTY) {
  console.error("Path is required")
  process.exit(1)
}

const getFiles = async (globPattern) => {
  const files = glob.sync(globPattern, {
    nosort: true,
    nodir: true,
    nonull: true,
  })
  console.dir(files, { colors: true })
  return files
}

const loopFiles = async (files) => {
  if (!Array.isArray(files)) {
    throw Error("No Files Found")
  }

  Promise.all(files.map((file) => parseRegexes(file))).then((data) => {
    const entries = Object.entries(data[0])
    entries.forEach((entry) => {
      // entry[0] is file name, entry[1] is array of line matches
      console.log(entry[0])
      console.log(`  Unsafe Regex`)
      entry[1].forEach((line) => {
        console.log(`    - (L${line.lineNr}) ${line.line}`)
        console.log(`      - Summary: ${line.summary}`)
      })
    })
  })
}

const parseRegexes = async (file) => {
  const fileContents = await fs.readFile(file, "utf8")
  const fileLines = fileContents.split("\n")

  const re = new RegExp(
    /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/
  )

  return fileLines.reduce((obj, line, index) => {
    if (re.test(line)) {
      const checkResult = check(line.trim(), "")
      if (checkResult.status !== "safe" && checkResult.status !== "unknown") {
        if (!obj[file]) {
          obj[file] = []
        }
        obj[file].push({
          lineNr: index,
          line: line.trim(),
          summary: checkResult.complexity?.summary ?? "",
        })
      }
    }
    return obj
  }, {})
}

;(async () => {
  console.log(`
recheck results:

> Go to https://makenowjust-labo.github.io/recheck/ for more details
> or if you want to double-check the matched regexes.

--- 
`)

  const files = await getFiles(globPattern)
  await loopFiles(files)
})()
