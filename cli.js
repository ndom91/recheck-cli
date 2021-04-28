#!/usr/bin/env node

const fs = require("fs/promises")
const fg = require("fast-glob")
const meow = require("meow")
const { check } = require("@makenowjust-labo/recheck")

const cli = meow(
  `
	Usage
	  $ recheck [arguments] <dir glob>

		-n 	include node_modules (default: false)
	  
	Examples
	  $ recheck **/*.js
	  $ recheck -n **/*.js
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

const [glob] = cli.input
const flags = cli.flags

if (!glob && process.stdin.isTTY) {
  console.error("Path is required")
  process.exit(1)
}

const getFiles = async (glob) => {
  return await fg([glob], {
    unique: true,
    globstar: true,
    onlyFiles: true,
    ignore: !flags.nodeModules ? ["node_modules"] : [],
  })
}

const loopFiles = async (files) => {
  if (!Array.isArray(files)) {
    throw Error("No Files Found")
  }

  Promise.all(files.map((file) => parseRegexes(file))).then((data) => {
    const entries = Object.entries(data[0])
    entries.forEach((entry) => {
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
      if (checkResult.status !== "safe") {
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

  const files = await getFiles(glob)
  console.log(files.length)
  await loopFiles(files)
})()
