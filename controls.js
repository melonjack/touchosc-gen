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
		'250 50': {alias: 'gaterate', chan: 10, cc: 3, type: '8step'},

		// midi 11
		'0 250': {alias: 'pitchon', chan: 11, cc: 1, type: 'on_off'},
		'0 300': {alias: 'pitchhold', chan: 11, cc: 2, type: 'fader'},
		'250 200': {alias: 'pitchrate', chan: 11, cc: 3, type: '8step'},
		'250 500': {alias: 'pitchsteps', chan: 11, cc: 4, type: '8step'},
		'650 200': {alias: 'pitchdist', chan: 11, cc: 5, type: 'fader'},
		'700 200': {alias: 'rnd', chan: 11, cc: 6, type: 'fader'},
		'800 200': {alias: 'scale_choice', chan: 11, cc: 7, midi_y: {chan: 13, cc: 7}, type: 'xy' },
		'950 200': {alias: 'drop', chan: 11, cc: 9, type: 'fader'},

		// midi 12
		'850 500': {alias: 'delayfb', chan: 12, cc: 1, type: 'fader'},
		'900 500': {alias: 'delaymix', chan: 12, cc: 2, type: 'fader'},
		'950 500': {alias: 'stereo', chan: 12, cc: 3, type: 'fader'},
		'450 500': {alias: 'delay_left', chan: 12, cc: 4, type: '8step'},
		'450 600': {alias: 'delay_right', chan: 12, cc: 5, type: '8step'},

		'0 500': {alias: 'chor_delayfb', chan: 12, cc: 6, midi_y: {chan: 13, cc: 6}, type: 'xy'},
		'0 150': {alias: 'chor_mix', chan: 12, cc: 7, type: 'fader'},

		'250 500': {alias: 'eros_cutres', chan: 12, cc: 8, midi_y: {chan: 13, cc: 8}, type: 'xy'},
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
