exports.ctl = function ($node, $) {
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
	return m;
};

/*
start controls from 21:
assigned_cc = page index + 20 + control_cc
*/
function mapping(x, y) {
	const coords = {
		// midi 10
		'0 50': {alias: 'gateon', cc: 10, n: 1, type: 'on_off'},
		'0 100': {alias: 'gatehold', cc: 10, n: 2, type: 'fader'},
		'250 50': {alias: 'gaterate', cc: 10, n: 3, type: '8step'},

		// midi 11
		'0 250': {alias: 'pitchon', cc: 11, n: 1, type: 'on_off'},
		'0 300': {alias: 'pitchhold', cc: 11, n: 2, type: 'fader'},
		'250 200': {alias: 'pitchrate', cc: 11, n: 3, type: '8step'},
		'250 500': {alias: 'pitchsteps', cc: 11, n: 4, type: '8step'},
		'650 200': {alias: 'pitchdist', cc: 11, n: 5, type: 'fader'},
		'700 200': {alias: 'rnd', cc: 11, n: 6, type: 'fader'},
		'800 200': {alias: 'scale_choice', cc: 11, n: 7, midi_y: {cc: 13, n: 7}, type: 'xy' },
		'950 200': {alias: 'drop', cc: 11, n: 9, type: 'fader'},

		// midi 12
		'850 500': {alias: 'delayfb', cc: 12, n: 1, type: 'fader'},
		'900 500': {alias: 'delaymix', cc: 12, n: 2, type: 'fader'},
		'950 500': {alias: 'stereo', cc: 12, n: 3, type: 'fader'},
		'450 500': {alias: 'delay_left', cc: 12, n: 4, type: '8step'},
		'450 600': {alias: 'delay_right', cc: 12, n: 5, type: '8step'},

		'0 500': {alias: 'chor_delayfb', cc: 12, n: 6, midi_y: {cc: 13, n: 6}, type: 'xy'},
		'0 150': {alias: 'chor_mix', cc: 12, n: 7, type: 'fader'},

		'250 500': {alias: 'eros_cutres', cc: 12, n: 8, midi_y: {cc: 13, n: 8}, type: 'xy'},
	};
	return coords[`${x} ${y}`];
}

exports.midi = function midi() {
	const dict = {

		// sends
		// 1: [
		// 	'deplaysteps',
		// 	'delaymix',
		// 	'reversesteps',
		// 	'reversemix'
		// ],
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
		],
		// audio fx
		12: [
		'deplaytime',
		'delayfb',
		'delaymix',
		'chor_delayfb',
		'chor_mix',
		'eros_cutres',
		'eros_bw'
		]
	}
	return dict;
}