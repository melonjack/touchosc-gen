const getXY = ($node, $) => {
	const n = $node.attr('type');
	const x = $node.attr('y');

	// drugs like me
	const y = 768 - 40 - Number($node.attr('x')) - Number($node.attr('w'));

	const errors = [];
	const tabName = new Buffer($($node).parents('tabpage').attr('name'), 'base64');
	// console.log(`tabpage ${tabName}, ${x} ${y} ${n}`);
	if ( x % 5 !== 0 || y % 5 !== 0) {
		// errors.push(`tabpage ${tabName}, ${x} ${y} ${n} incorrect position, should be divided by 5`);
		errors.push(`tabpage ${tabName}, ${x} ${y} ${n} incorrect position, should be divided by 5`);
	}
	if (/label.*/.test(n)) {
		errors.push(`tabpage ${tabName}, ${x} ${y} ${n}: no mapping`);
	}
	if (errors.length) {
		return {err: errors.join('\n')};
	}
	return {x,y};
}

exports.arpCtl = function arpCtl($node, $) {
	const {x, y, err} = getXY($node, $);
	if (err) {
		console.log('arpCtl', err);
		return {};
	}
	return arpMapping(x, y);
};

/*
start controls from 21:
assigned_cc = page index + 20 + control_cc
*/
function arpMapping(x, y) {
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
		'900 200': {alias: 'scale_scale', chan: 11, cc: 8, type: 'fader' },
		'950 200': {alias: 'scale_choice', chan: 11, cc: 7, type: 'fader' },
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

exports.arpNumber = function arpNumber(cc, chan, page) {
	// controls for chan 11 start from 31
	// controls for chans 10, 12 and 13 start from 21
	// oh me
	const baseCCNumber = chan === 11 ? 3 : 2;
	// we want 1 + 1 = 11 (int)
	const number = Number('' + (page + baseCCNumber) + cc);
	return number;
}

exports.sendsCtl = function sendsCtl($node) {

}

const initTravelr = () => {
	return
}

exports.travelrCtl = function travelrCtl($node, $) {
	const {x, y, err} = getXY($node, $);
	if (err) {
		console.log('travelrCtl', err);
		return {};
	}
	return travelrMapping(x, y);
};

function travelrMapping(x, y) {
	const coords = {
		// Pitch
		'50 100': {cc: [21, 22],  alias: 'pitch_lfo', type: 'xy'},
		'200 100': {cc: 23, alias: 'jitter', type: 'fader' },

		// Position
		'300 100': {cc: [24, 25], alias: 'pos_lfo', type: 'xy'},
		'450 100': {cc: 26, alias: 'pos_inertia', type: 'fader' },

		// Harmony
		'550 100': {cc: [27, 28], alias: 'harm_sustain', type: 'xy'},
		'700 100': {cc: 29, alias: 'harm_resonanse', type: 'fader' },

		// Wave
		'800 100': {cc: [30, 31], alias: 'wave', type: 'xy'},

		// Geiger Gate
		'50 400': {cc: [32, 33], alias: 'geiger', type: 'xy'},

		// Echo
		'300 400': {cc: [34,35], alias: 'echo_pichfb', type: 'xy'},
		'450 400': {cc: 36, alias: 'echo_env', type: 'fader' },

		// echo filter
		'550 400': {cc: [37,38], alias: 'echo_hp', type: 'xy'},

		// echo_stereo
		'800 400': {cc: 39, alias: 'echo_stereo', type: 'fader'},
		// echo filter
		'900 400': {cc: 40, alias: 'echo_mix', type: 'fader'},
	};

	const key = `${x} ${y}`;
	// console.log(x, y, key)
	const {type, alias, cc} = coords[key];
	const control = {alias, type, chan: 8};
	if (Array.isArray(cc)) {
		control.cc = cc[0];
		control.midi_y = {chan: 8, cc: [cc[1]]};
	} else {
		control.cc = cc;
	}

	return control;
}