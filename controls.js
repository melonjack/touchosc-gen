exports.arpCtl = function arpCtl($node, $) {
	const n = $node.attr('type');
	const x = $node.attr('y');

	// drugs like me
	const y = 768 - 40 - Number($node.attr('x')) - Number($node.attr('w'));

	const errors = [];
	const tabName = new Buffer($($node).parents('tabpage').attr('name'), 'base64');
	if ( x % 5 !== 0 || y % 5 !== 0) {

		errors.push(`tabpage ${tabName}, ${x} ${y} ${n} incorrect position, should be divided by 5`);
	}
	if (errors.length) {
		console.log(errors.join('\n'));
	}
	const m = mapping(x, y);
	m === undefined && n !== 'labelv' && console.log(n, m, x, y, String(tabName));
	return m || {};
};

/*
start controls from 21:
assigned_cc = page index + 20 + control_cc
*/
function mapping(x, y) {
	const coords = {
		// midi 10
		'0 50': {alias: 'gateon', chan: 10, cc: 1, type: 'on_off'},
		'0 100': {alias: 'gatehold', chan: 10, cc: 2, type: 'fader'},
		'400 50': {alias: 'gaterate', chan: 10, cc: 3, type: '8step'},

		// midi 11
		'0 250': {alias: 'pitchon', chan: 11, cc: 1, type: 'on_off'},
		'400 200': {alias: 'pitchrate', chan: 11, cc: 2, type: '8step'},
		'400 300': {alias: 'pitchsteps', chan: 11, cc: 3, type: '8step'},
		'0 300': {alias: 'pitchhold', chan: 11, cc: 4, type: 'fader'},
		'800 200': {alias: 'pitchdist', chan: 11, cc: 5, type: 'fader'},
		'900 50': {alias: 'rnd', chan: 11, cc: 6, type: 'fader'},
		'900 200': {alias: 'scale_scale', chan: 11, cc: 7, type: 'fader' },
		'950 200': {alias: 'scale_choice', chan: 11, cc: 8, type: 'fader' },
		'275 100': {alias: 'drop', chan: 11, cc: 9, type: 'fader'},

		// midi 12 + 13 as fallback
		'500 500': {alias: 'delay_left', chan: 12, cc: 1, type: '8-2step'},
		'500 600': {alias: 'delay_right', chan: 13, cc: 1, type: '8-2step'},

		'900 500': {alias: 'delayfb', chan: 12, cc: 2, type: 'fader'},
		'950 500': {alias: 'delaymix', chan: 12, cc: 3, type: 'fader'},

		'850 500': {alias: 'stereo', chan: 13, cc: 2, type: 'fader'},
		'800 500': {alias: 'link', chan: 13, cc: 3, type: 'on_off'},

		'0 500': {alias: 'chor_delayfb', chan: 12, cc: 4, midi_y: {chan: 13, cc: 4}, type: 'xy'},
		'150 500': {alias: 'chor_mix', chan: 12, cc: 5, type: 'fader'},

		'250 500': {alias: 'eros_freqwide', chan: 12, cc: 6, midi_y: {chan: 12, cc: 7}, type: 'xy'},
		'400 500': {alias: 'eros_mix', chan: 13, cc: 6, type: 'fader'},
	};
	return coords[`${x} ${y}`];
}

exports.arpNumber = function arpNumber(cc, page) {
	const BASE_CC_NUMBER = 2;
	const number = Number('' + (page + BASE_CC_NUMBER) + cc);
	console.log('arp cc', number);
	return number;
}

exports.sendsCtl = function sendsCtl($node) {

}
