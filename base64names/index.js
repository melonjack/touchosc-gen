const fs = require('fs')
const cheerio = require('cheerio');
var src = fs.readFileSync('index.xml', 'utf8');
const src_str = String(src);

const r1 = src_str.replace(/name=\"([A-Za-z0-9+/=]*)\"*/gi, (match, offset, str, str2) => {
	// console.log(str2)
	var buf = new Buffer(offset, 'base64'); // Ta-da
	return 'name="' + buf + '"';
})

// console.log(r1);

const r2 = r1.replace(/<\/control/gi, (match, offset, p1, p2) => {
	return '' + offset;
});

const ccValue = (i) => {
	i = i || 0;
	const br = i === 0 ? '\n' : ''
	return `${br}<midi var="x" type="0" channel="1" data1="${i}" data2f="0" data2t="127" sysex="" />\n`;
}

function convertBase64(offset) {
	// console.log(str2)
	var buf = new Buffer(offset, 'base64'); // Ta-da
	return 'name="' + buf + '"';
}

const $ = cheerio.load(src_str, {xmlMode: true});
$('control, tabpage').each((i, item) => {
	const $item = $(item);
	const type = $item.attr('type');
	
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

	console.log($(item).attr('name'));
})


fs.writeFile('dest/test-' + Date.now() + '.xml', $.html(), err => err);
