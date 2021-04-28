#!/usr/bin/env node
const fg = require('fast-glob');
const meow = require('meow');
const { check } = require("@makenowjust-labo/recheck");

console.log(check("^(a|a)*$", ""));

const cli = meow(`
	Usage
	  $ recheck [arguments] <dir glob>

		-n 	include node_modules (default: false)
	  
	Examples
	  $ recheck **/*.js
	  $ recheck -n **/*.js
`);


const [binary, ...binaryArguments] = cli.input;

console.log(binary, binaryArguments)

if (!binary && process.stdin.isTTY) {
	console.error('Path is required');
	process.exit(1);
}
