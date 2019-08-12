#!/usr/bin/env node
const TapParser = require('tap-parser');
const log = require('logel').Logel.make().log();
let parser = new TapParser();

let currentExtras = [];
parser.on('extra', extra => {
	currentExtras.push(extra.trim());
});

parser.on('assert', test => {
	let extras = currentExtras.length === 0 ? undefined : currentExtras;

	if (test.ok) {
		log.debug('test pass', {name: test.name, extras});
	} else {
		log.error('test fail', {name: test.name, diag: test.diag, extras});
	}

	if (currentExtras.length !== 0) {
		currentExtras = [];
	}
});

parser.on('complete', status => {
	let ctx = {
		total: status.count,
		failed: status.fail,
		passed: status.pass,
	};
	if (status.ok) {
		log.info('tests complete', ctx);
	} else {
		log.error('tests complete', ctx);
	}
	// process.exit(status.ok ? 0 : 1);
});

if (process.argv.length > 2) {
	const ChildProcess = require('child_process');

	let cmd = process.argv[2];
	let args = process.argv.slice(3);
	let child = ChildProcess.spawn(cmd, args, {
		stdio: ['inherit', 'pipe', 'inherit'],
	});
	child.stdout.pipe(parser);
} else {
	process.stdin.pipe(parser);
}
