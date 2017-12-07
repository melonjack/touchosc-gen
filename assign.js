const fs = require('fs')
const cheerio = require('cheerio');
const {execSync} = require('child_process');
const ctl = require('./controls').ctl;
var src = fs.readFileSync('./src/index.xml', 'utf8');
const src_str = String(src);
const beautify = require('xml-beautifier');

const createMidi = (i, channel, number, min = 0, max = 127, id = '') => {
	return `<midi var ="x${id}" type="0" channel="${channel}" data1="${number}" data2f="${min}" data2t="${max}" sysex="" />`;
}

function convertBase64(offset) {
	// console.log(str2)
	var buf = new Buffer(offset, 'base64'); // Ta-da
	return 'name="' + buf.toString('utf8') + '"';
}

function channel(alias) {
	const dict = midi();

	if (dict[1].indexOf(alias) !== -1) {
		return 1;
	}

	if (dict[10].indexOf(alias) !== -1) {
		return 10;
	}

	if (dict[11].indexOf(alias) !== -1) {
		return 11;
	}
	console.log(alias)
}

function number($node, alias, page) {
	const dict = midi();
	const c = channel(alias);

	if (c === 10) {
		return (2 + page) * 10 + dict[10].indexOf(alias) + 1;
	}

	if (c === 11) {
		return (3 + page) * 10 + dict[11].indexOf(alias) + 1;
	}

	if (c === 1) {
		return 20 + page + dict[1].indexOf(alias) + 1
	}
}

function toggleVal(i) {
	const vals = [0, 17, 33, 49, 66, 82, 100, 127];
	return vals[i];
}

const $ = cheerio.load(src_str, {xmlMode: true});

$('tabpage').each((page, item) => {
	if (page >= 8) return
	const dict = midi();

	$(item).find('control').each((j, citem) => {
		const $node = $(citem);
		const alias = ctl($node);
		// const nm = new Buffer($node.attr('name'), 'base64');
		const type = $node.attr('type');
		if (type === 'faderh') {
			$node.html(createMidi(
				j,
				channel(alias),
				number($node, alias, page),
				0,
				127,
				''
			))
		} else if (type === 'multitoggle') {

			const isLinear = dict[1].indexOf(alias) !== -1;
			// return;
			$node.html('');
			const klen = +$node.attr('number_x') * +$node.attr('number_y');
			for (let k = 0; k < klen; k++) {
				$node.attr('ex_mode', 'true');
				$node.append(createMidi(
					k,
					channel(alias),
					number($node, alias, page),
					klen === 8 ? (isLinear ? k : toggleVal(k)): [0, 127][k],
					klen === 8 ? (isLinear ? k : toggleVal(k)): [0, 127][k],
					k + 1
				))				
			}
		}
		
	})
})


function midi() {
	const dict = {

		// sends
		1: [
			'deplaysteps',
			'delaymix',
			'reversesteps',
			'reversemix'
		],
		// gate
		10: [
			'gateon',
			'gatehold',
			'gaterate'
		],
		// pitcj
		11: [
			'pitchon',
			'pitchrate',
			'pitchsteps',
			'pitchgate',
			'pitchdis',
			'rnd',
			'choice',
			'scale',
			'drop',
		]
	}
	return dict;
}

console.log(process.cwd());
process.chdir('dest');

fs.writeFileSync('index.xml', $.html());
fs.writeFileSync('index-pretty.xml', beautify($.html()));
execSync('rm -f index.xml.zip index.xml.zip.touchosc');
execSync('zip -r -X index.xml.zip index.xml')
execSync('mv index.xml.zip index.xml.zip.touchosc');
