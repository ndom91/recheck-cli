import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import fs from "fs/promises";
import path from "path";
import { checkSync } from "recheck";

describe("recheck-cli regex detection", () => {
  const testDir = path.join(process.cwd(), "test-fixtures");
  const testFile = path.join(testDir, "test-regexes.js");

  before(async () => {
    await fs.mkdir(testDir, { recursive: true });
    const testContent = `// Test file with various regex patterns

// Safe regex - simple literal match
const safeRegex1 = /hello/;

// Potentially unsafe - nested quantifiers (catastrophic backtracking)
const unsafeRegex1 = /(a+)+b/;

// Potentially unsafe - overlapping alternatives with quantifiers
const unsafeRegex2 = /(a|a)*b/;

// Safe regex - anchored pattern
const safeRegex2 = /^[a-z]+$/;

// Potentially unsafe - exponential backtracking
const unsafeRegex3 = /(x+x+)+y/;

// Safe regex - character class
const safeRegex3 = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;

// Potentially unsafe - nested groups with quantifiers
const unsafeRegex4 = /((a*)*)*b/;

// Safe regex - alternation without nesting
const safeRegex4 = /cat|dog|bird/;

// Potentially unsafe - ReDoS vulnerability
const unsafeRegex5 = /(a|ab)*c/;

// Safe regex - simple word boundary
const safeRegex5 = /\\bword\\b/gi;

// Potentially unsafe - multiple overlapping quantifiers
const unsafeRegex6 = /(.*a){10}/;
`;

    await fs.writeFile(testFile, testContent, "utf8");
  });

  after(async () => {
    // Clean up test fixtures
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe("Safe regex patterns", () => {
    it("should identify simple literal patterns as safe", () => {
      const result = checkSync("hello", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.strictEqual(result.status, "safe");
    });

    it("should identify anchored patterns as safe", () => {
      const result = checkSync("^[a-z]+$", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.strictEqual(result.status, "safe");
    });

    it("should identify character classes as safe", () => {
      const result = checkSync("[0-9]{3}-[0-9]{3}-[0-9]{4}", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.strictEqual(result.status, "safe");
    });

    it("should identify simple alternation as safe", () => {
      const result = checkSync("cat|dog|bird", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.strictEqual(result.status, "safe");
    });

    it("should identify word boundaries as safe", () => {
      const result = checkSync("\\bword\\b", "gi", {
        timeout: 1000,
        checker: "auto",
      });
      assert.strictEqual(result.status, "safe");
    });
  });

  describe("Unsafe regex patterns", () => {
    it("should detect nested quantifiers as vulnerable", () => {
      const result = checkSync("(a+)+b", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.notStrictEqual(result.status, "safe");
    });

    it("should detect overlapping alternatives as vulnerable", () => {
      const result = checkSync("(a|a)*b", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.notStrictEqual(result.status, "safe");
    });

    it("should detect exponential backtracking patterns", () => {
      const result = checkSync("(x+x+)+y", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.notStrictEqual(result.status, "safe");
    });

    it("should detect nested groups with quantifiers", () => {
      const result = checkSync("((a*)*)*b", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.notStrictEqual(result.status, "safe");
    });

    it("should detect ReDoS vulnerability patterns", () => {
      const result = checkSync("(a|ab)*c", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.notStrictEqual(result.status, "safe");
    });

    it("should detect multiple overlapping quantifiers", () => {
      const result = checkSync("(.*a){10}", "", {
        timeout: 1000,
        checker: "auto",
      });
      assert.notStrictEqual(result.status, "safe");
    });
  });

  describe("Regex parsing from files", () => {
    it("should parse regex patterns from JavaScript files", async () => {
      const content = await fs.readFile(testFile, "utf8");
      const lines = content.split("\n");

      // Use string constructor to match the pattern from cli.ts
      const regexPattern = new RegExp(
        String.raw`\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?))?)`,
      );

      const foundRegexes = lines
        .map((line, index) => {
          const match = line.match(regexPattern);
          if (match) {
            return { line: index + 1, pattern: match[0] };
          }
          return null;
        })
        .filter((r) => r !== null);

      // Should find multiple regex patterns in the file
      assert.ok(
        foundRegexes.length > 0,
        "Should find regex patterns in test file",
      );
    });

    it("should correctly extract regex pattern without delimiters", () => {
      const testLine = "const regex = /test/gi;";

      // Use string constructor to match the pattern from cli.ts
      const regexPattern = new RegExp(
        String.raw`\/((?![*+?])(?:[^\r\n\[/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?))?)`,
      );

      const match = testLine.match(regexPattern);
      assert.ok(match !== null, "Should match regex pattern");

      // Extract pattern without slashes and flags
      // match[0] is "/test/gi", so slice(1, -1) gives "test/gi"
      // We need match[1] which is the first capture group (the pattern itself)
      const pattern = match![1];
      assert.strictEqual(pattern, "test");
    });
  });

  describe("Complexity reporting", () => {
    it("should provide complexity information for vulnerable patterns", () => {
      const result = checkSync("(a+)+b", "", {
        timeout: 1000,
        checker: "auto",
      });

      if (result.status !== "safe" && result.status !== "unknown") {
        assert.ok(result.complexity, "Should have complexity information");
        assert.ok(result.complexity.summary, "Should have complexity summary");
      }
    });

    it("should handle edge cases with unknown status", () => {
      // Some patterns might be too complex to analyze
      const result = checkSync(".*", "", {
        timeout: 1000,
        checker: "auto",
      });

      // Should return a valid status
      assert.ok(
        ["safe", "vulnerable", "unknown"].includes(result.status),
        "Should return a valid status",
      );
    });
  });
});
