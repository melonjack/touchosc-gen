#! /usr/bin/env node

const fs = require('fs')
const cheerio = require('cheerio');
const {execSync} = require('child_process');
const ctl = require('./controls');
const midi = require('./controls').midi;
var src = fs.readFileSync('./src/index.xml', 'utf8');
const src_str = String(src);
const beautify = require('xml-beautifier');
const createMidi = require('./create_midi').createMidi;

const $ = cheerio.load(src_str, {xmlMode: true});

function toggleVal(i) {
	const vals = [0, 17, 33, 49, 66, 82, 100, 127];
	return vals[i];
}

function labelColorByPageId (pageId) {
	return [
	'yellow',
	'red',
	'green',
	'blue',
	'purple',
	'gray',
	'orange',
	'brown'
	][pageId];
}

console.log(ctl)
$('tabpage').each((page, item) => {

	// SENDS
	if (page === 8) {
		$(item).find('control').each((j, citem) => {
			const $node = $(citem);
			const coords = {
				x: $node.attr('y'),
				y: 768 - 40 - Number($node.attr('x')) - Number($node.attr('w'))
			}
			const x = 1 + coords.x/120;
			const y = 1 + coords.y/120;
			console.log('x', x, 'y', y, '' + (y + 1) + '' + x);

			$node.html(createMidi({
				uid: j,
				channel: 9,
				number: '' + (y + 1) + '' + x
			}))
		});
		return;
	}

	if (page < 8) {
		$(item).find('control').each((j, citem) => {
			const $node = $(citem);
			if ($node.attr('type') === 'labelv') {
				return;
			}

			const control = ctl.arpCtl($node, $);
			if (!control) {
				throw $node.attr('type')
			}
			const {
				alias,
				cc,
				chan,
				type,
				midi_y,
			} = control;

			$node.attr('color', labelColorByPageId(page));

			if (type === 'fader') {
				$node.html(createMidi({
					uid: j,
					channel: chan,
					number: ctl.arpNumber(cc, page)
				}));
			} else if (type === '8step') {
				$node.html('');
				for (let k = 0; k < 8; k++) {
					$node.attr('ex_mode', 'true');
					$node.append(createMidi({
						uid: k,
						channel: chan,
						number: ctl.arpNumber(cc, page),
						min: toggleVal(k),
						max: toggleVal(k),
						id: k + 1
					}))
				}
			} else if (type === 'on_off') {
				$node.html('');
				for (let k = 0; k < 2; k++) {
					$node.attr('ex_mode', 'true');
					$node.append(createMidi({
						uid: k,
						channel: chan,
						number: ctl.arpNumber(cc, page),
						min: [0, 127][k],
						max: [0, 127][k],
						id: k + 1
					}))
				}
			} else if (type === 'xy') {
				$node.html(createMidi({
					uid: j,
					channel: chan,
					number: ctl.arpNumber(cc, page),
					axis: 'y',
					id: 1

				}));
				$node.append(createMidi({
					uid: j + 0.5,
					channel: midi_y.chan,
					number: ctl.arpNumber(midi_y.cc, page),
					axis: 'x',
					id: 1
				}))
			}

		});
		return;
	}
})


console.log(process.cwd());

process.chdir('dest');

fs.writeFileSync('index.xml', $.html());
fs.writeFileSync('index-pretty.xml', beautify($.html()));
execSync('rm -f index.xml.zip index.xml.zip.touchosc');
execSync('zip -r -X index.xml.zip index.xml')
execSync('mv index.xml.zip index.xml.zip.touchosc');
