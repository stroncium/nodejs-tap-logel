#!/usr/bin/env node
const TapParser = require('tap-parser');
const log = require('logel').Logel.make().log();
let parser = new TapParser();
process.stdin.pipe(parser);

parser.on('assert', test => {
	if (test.ok) {
		log.debug('test pass', {name: test.name});
	} else {
		log.error('test fail', {name: test.name, diag: test.diag});
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
	process.exit(status.ok ? 0 : 1);
});
