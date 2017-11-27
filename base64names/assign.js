const fs = require('fs')
const cheerio = require('cheerio');
const ctl = require('./controls').ctl;
var src = fs.readFileSync('./presets/index-3.xml', 'utf8');
const src_str = String(src);

console.log(ctl);

const ccValue = (i) => {
	i = i || 0;
	const br = i === 0 ? '\n' : ''
	return `${br}<midi var="x" type="0" channel="1" data1="${i}" data2f="0" data2t="127" sysex="" />\n`;
}

function convertBase64(offset) {
	// console.log(str2)
	var buf = new Buffer(offset, 'base64'); // Ta-da
	return 'name="' + buf.toString('utf8') + '"';
}

const $ = cheerio.load(src_str, {xmlMode: true});
$('control, tabpage').each((i, item) => {
	const $item = $(item);
	const type = $item.attr('type');
	// console.log($item.attr('x'), $item.attr('y'));

	if (type === 'faderh') {
		$(item).html(ccValue());
	} else if (type === 'multitoggle') {
		$(item).html('');
		const number_y = +$item.attr('number_y');
		for (var i = 0; i < number_y; i++) {
			$(item).append(ccValue(i));
		}
	}

	const itemname = $item.attr('name');
	$item.attr('name', new Buffer(itemname, 'base64'));

	// console.log($(item).attr('name'));
})

$('tabpage').first().find('control').each((i, item) => {
	const $node = $(item);
	console.log(ctl($node));
})


fs.writeFile('dest/test-' + Date.now() + '.xml', $.html(), err => err);
