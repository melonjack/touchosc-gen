const {
	readFileSync,
} = require('fs');
const {execSync} = require('child_process');

execSync('cp dest/index.xml.zip.touchosc src/index.xml.zip');
process.chdir('src');
execSync('unzip -o index.xml.zip index.xml', (e, std) => console.log(std));
process.chdir('..');

