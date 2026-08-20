// The add-on itself lives in src/, so build tooling at the repository root
// stays out of the package.
const sourceDir = 'src';
const ignoreFiles = [];

// Neither should anything git doesn't track: scratch files, local repros and
// the like would otherwise be packaged up and shipped along.
try {
	const { execFileSync } = require('node:child_process');
	const untracked = execFileSync(
		'git', ['-C', sourceDir, 'ls-files', '--others', '--directory'],
		{ encoding: 'utf8' },
	);
	for (const path of untracked.split('\n').filter(Boolean)) {
		ignoreFiles.push(path.endsWith('/') ? `${path}**` : path);
	}
} catch (e) {
	// Not a git checkout (or no git); sourceDir still keeps tooling out.
}

module.exports = { sourceDir, ignoreFiles };
