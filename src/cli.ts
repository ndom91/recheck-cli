import fs from 'fs/promises'
import { glob } from 'glob'
import meow from 'meow'
import { checkSync } from 'recheck'

const cli = meow(
  `
  Usage
    $ recheck [arguments] <file glob>

  Flags
    -n 	include node_modules (default: false)

  Examples
    $ recheck "**/*.js"
    $ recheck -n "**/*.js"
`,
  {
    importMeta: import.meta,
    flags: {
      nodeModules: {
        type: 'boolean',
        shortFlag: 'n',
      },
    },
  },
)

const [globPattern] = cli.input
const flags = cli.flags

if (!globPattern) {
  console.error('Path is required')
  process.exit(1)
}

const getFiles = async (filePattern: string) => {
  const ignoreNodeModules = [
    'node_modules',
    '**/node_modules/**',
    '**/node_modules',
    './node_modules',
    './node_modules/**',
    'node_modules/**',
  ]
  const files = glob.sync(filePattern, {
    nodir: true,
    ignore: !flags.nodeModules ? ignoreNodeModules : [],
  })
  return files
}

const loopFiles = async (filePaths: string[]) => {
  if (!Array.isArray(filePaths)) {
    throw Error('No Files Found')
  }

  const regexes = await Promise.all(filePaths.map((path) => parseRegexes(path)))

  regexes.forEach((data) => {
    Object.entries(data).forEach(([filePath, matches]) => {
      console.log()
      console.log(`File: ${filePath}`)
      console.log(`  Unsafe Regex`)
      matches.forEach((line) => {
        console.log(`    - (L${line.lineNr}) ${line.line}`)
        console.log(`      - Summary: ${line.summary}`)
      })
    })
  })
}

interface RegexMatch {
  lineNr: number
  line: string
  summary: string
}

type ParseResult = Record<string, RegexMatch[]>

const parseRegexes = async (filePath: string): Promise<ParseResult> => {
  const fileContents = await fs.readFile(filePath, 'utf8')
  const fileLines = fileContents.split('\n')

  const re = new RegExp(
    /\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/,
  )

  return fileLines.reduce<ParseResult>((obj, line, index) => {
    if (re.test(line)) {
      const foundRegex = line.match(re)
      if (foundRegex?.[0]) {
        const checkResult = checkSync(foundRegex[0].slice(1, -1), '', {
          timeout: 1000,
          checker: 'auto',
        })
        if (checkResult.status !== 'safe' && checkResult.status !== 'unknown') {
          if (!obj[filePath]) {
            obj[filePath] = []
          }
          obj[filePath].push({
            lineNr: index,
            line: line.trim(),
            summary: checkResult.complexity?.summary ?? '',
          })
        }
      }
    }
    return obj
  }, {})
}

console.log(`
recheck results:

> Go to https://makenowjust-labo.github.io/recheck/ for more details
> or if you want to double-check the matched regexes.

--- 
`)

const files = await getFiles(globPattern)
console.log(`Checking ${files.length} files...`)
console.log()
await loopFiles(files)
