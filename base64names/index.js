const fs = require('fs')

var src = fs.readFileSync('index.xml', 'utf8');
const src_str = String(src);
const name = src_str.match(/name=\"[A-Za-z0-9+/=]*\"*/gi);


const replace = src_str.replace(/name=\"([A-Za-z0-9+/=]*)\"*/gi, (match, offset, str, str2) => {
	console.log(str2)
	var buf = new Buffer(offset, 'base64'); // Ta-da
	return 'name="' + buf + '"';
})

console.log(replace);

// fs.writeFile('index' + Date.now() + '.xml', replace);
fs.writeFile('result.xml', replace);
let result = '';

name.forEach((str) => {
	const val = str.split('"')[1];
	var buf = new Buffer(val, 'base64'); // Ta-da
	const buf_str = String(buf);

	console.log(String(buf), val);
	result = src_str.replace(val, buf_str);
})

console.log(result);
console.log(name.length);