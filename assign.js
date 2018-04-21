#! /usr/bin/env node

const fs = require('fs')
const cheerio = require('cheerio');
const {execSync} = require('child_process');
const ctl = require('./controls').ctl;
const midi = require('./controls').midi;
var src = fs.readFileSync('./src/index.xml', 'utf8');
const src_str = String(src);
const beautify = require('xml-beautifier');

const createMidi = ({
	uid, channel, number, min = 0, max = 127, id = '', axis = 'x'
}) => {
	return channel ?
		//<midi var="y1" type="0" channel="12" data1="22" data2f="0" data2t="127" sysex=""/>
		`<midi var ="${axis}${id}" type="0" channel="${channel}" data1="${number}" data2f="${min}" data2t="${max}" sysex="" />` :
		'';

	}

	function convertBase64(offset) {
	// console.log(str2)
	var buf = new Buffer(offset, 'base64'); // Ta-da
	return 'name="' + buf.toString('utf8') + '"';
}

function number($node, alias, page) {
	const dict = midi();
	const c = channel(alias);

	if (c === 10) {
		// cc 21...29
		return (2 + page) * 10 + dict[10].indexOf(alias) + 1;
	}

	if (c === 11) {
		// cc 31...39
		return (3 + page) * 10 + dict[11].indexOf(alias) + 1;
	}

	if (c === 12) {
		// cc 21...29
		return (2 + page) * 10 + dict[12].indexOf(alias) + 1;
	}

	if (c === 1) {
		// cc 21...29
		return 20 + page + dict[1].indexOf(alias) + 1
	}

	console.log('failed channel', c, alias);
}

function toggleVal(i) {
	const vals = [0, 17, 33, 49, 66, 82, 100, 127];
	return vals[i];
}

const $ = cheerio.load(src_str, {xmlMode: true});

const labelColorByPageId = (pageId) => {
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

$('tabpage').first().each((page, item) => {
	const dict = midi();
	const $ctl = $(item).find('control');

	$(item).find('control').each((j, citem) => {
		const $node = $(citem);
		const {alias, channel} = ctl($node, $);
		// const nm = new Buffer($node.attr('name'), 'base64');
		const type = $node.attr('type');

		$node.attr('color', labelColorByPageId(page));

		if (type === 'faderv' || type === 'faderh' || type === 'rotaryh') {
			if (page > 7 || type === 'rotaryh') {

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
			} else {
				$node.html(createMidi({
					uid: j,
					channel: channel(alias),
					number: number($node, alias, page)
				}))
							}
		} else if (type === 'multitoggle') {
			$node.html('');
			const klen = +$node.attr('number_x') * +$node.attr('number_y');
			const toggle8step = klen === 8;
			for (let k = 0; k < klen; k++) {
				$node.attr('ex_mode', 'true');
				$node.append(createMidi({
					uid: k,
					channel: channel(alias),
					number: number($node, alias, page),
					min: toggle8step ? toggleVal(k): [0, 127][k]/* assume toggle2step */,
					max: toggle8step ? toggleVal(k): [0, 127][k],
					id: k + 1
				}))
			}
		} else if (type === 'multixy') {
			$node.html(createMidi({
				uid: j,
				channel: channel(alias),
				number: number($node, alias, page),
				axis: 'y',
				id: 1

			}));
			$node.append(createMidi({
				uid: j + 0.5,
				channel: 13,
				number: number($node, alias, page),
				axis: 'x',
				id: 1
			}))
		}
	})
})


console.log(process.cwd());

process.chdir('dest');

fs.writeFileSync('index.xml', $.html());
fs.writeFileSync('index-pretty.xml', beautify($.html()));
execSync('rm -f index.xml.zip index.xml.zip.touchosc');
execSync('zip -r -X index.xml.zip index.xml')
execSync('mv index.xml.zip index.xml.zip.touchosc');
