const getXY = ($node, $) => {
	const n = $node.attr('type');
	const x = $node.attr('y');

	// drugs like me
	const y = 768 - 40 - Number($node.attr('x')) - Number($node.attr('w'));

	const errors = [];
	const tabName = Buffer.from($($node).parents('tabpage').attr('name'), 'base64');
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

exports.arpCtl = function arpCtl($node, $, pageId) {
	const {x, y, err} = getXY($node, $);
	if (err) {
		console.log('arpCtl', err);
		return {};
	}
	return arpMapping(x, y, pageId);
};

/*
start controls from 21:
assigned_cc = page index + 20 + control_cc
*/
function arpMapping(x, y, pageId) {
	const coords = {
		// midi 10
		'200 50': {alias: 'rndarp_launchcontrol', chan: 7, cc_strict: 21, type: 'fader'},

        '25 50': {alias: 'gate_length', chan: 10, cc: 2, type: 'fader'},
		'400 50': {alias: 'gaterate', chan: 10, cc: 3, type: '8step'},

        '50 500': {alias: 'attack', chan: 10, cc: 4, type: 'fader'},
        '100 500': {alias: 'decay', chan: 10, cc: 5, type: 'fader'},
        '150 500': {alias: 'sustain', chan: 10, cc: 6, type: 'fader'},
        '200 500': {alias: 'release', chan: 10, cc: 7, type: 'fader'},
        '300 525': {alias: 'volume', chan: 10, cc: 8, type: 'fader'},

		// midi 11
		'0 250': {alias: 'pitchon', chan: 11, cc: 1, type: 'on_off'},
		'400 200': {alias: 'pitchrate', chan: 11, cc: 2, type: '8step'},
		'400 300': {alias: 'pitchsteps', chan: 11, cc: 3, type: '8step'},
		'25 225': {alias: 'pitchhold', chan: 11, cc: 4, type: 'fader'},
		'800 200': {alias: 'pitchdist', chan: 11, cc: 5, type: 'fader'},
		'900 50': {alias: 'rnd', chan: 11, cc: 6, type: 'fader'},
		'900 200': {alias: 'scale_scale', chan: 11, cc: 8, type: 'fader' },
		'950 200': {alias: 'scale_choice', chan: 11, cc: 7, type: 'fader' },
		'200 225': {alias: 'drop', chan: 11, cc: 9, type: 'fader'},

		// midi 12 + 13 as fallback
		'500 500': {alias: 'delay_left', chan: 12, cc: 1, type: '8-2step'},
		'500 600': {alias: 'delay_right', chan: 13, cc: 1, type: '8-2step'},

		'800 500': {alias: 'delayfb', chan: 12, cc: 2, type: 'fader'},
		'850 500': {alias: 'link', chan: 13, cc: 3, type: 'on_off'},
		'900 500': {alias: 'gain', chan: 13, cc: 2, type: 'fader'},
		'950 500': {alias: 'delaymix', chan: 12, cc: 3, type: 'fader'}
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

exports.arpNumberStrict = function arpNumberStrict(cc, pageId) {
    return cc + pageId;
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

exports.percsCtl = function ($node, $, pageId) {
    
	const {x, y, err} = getXY($node, $);
	if (err) {
		console.log('travelrCtl', err);
		return {};
	}
	return travelrMapping(x, y);

}

function percsMapping(x, y) {
    const coords = {
        // 1 line
        '25 25': {cc: 13, type: 'fader', alias: 'a1'},
        '150 25': {cc: 14, type: 'fader', alias: 'a2'},
        '275 25': {cc: 15, type: 'fader', alias: 'a3'},
        '400 25': {cc: 16, type: 'fader', alias: 'a4'},
        '525 25': {cc: 17, type: 'fader', alias: 'a5'},
        '650 25': {cc: 18, type: 'fader', alias: 'a6'},
        '775 25': {cc: 19, type: 'fader', alias: 'a7'},
        '900 25': {cc: 20, type: 'fader', alias: 'a8'},

        // 2 line
        '25 150': {cc: 29, type: 'fader', alias: 'b1'},
        '150 150': {cc: 30, type: 'fader', alias: 'b2'},
        '275 150': {cc: 31, type: 'fader', alias: 'b3'},
        '400 150': {cc: 32, type: 'fader', alias: 'b4'},
        '525 150': {cc: 33, type: 'fader', alias: 'b5'},
        '650 150': {cc: 34, type: 'fader', alias: 'b6'},
        '775 150': {cc: 35, type: 'fader', alias: 'b7'},
        '900 150': {cc: 36, type: 'fader', alias: 'b8'},
        
        // 3 line
        '25 275': {cc: 21, type: 'fader', alias: 'rnd1'},
        '150 275': {cc: 22, type: 'fader', alias: 'rnd2'},
        '275 275': {cc: 23, type: 'fader', alias: 'rnd3'},
        '400 275': {cc: 24, type: 'fader', alias: 'rnd4'},
        '525 275': {cc: 25, type: 'fader', alias: 'rnd5'},
        '650 275': {cc: 26, type: 'fader', alias: 'rnd6'},
        '775 275': {cc: 27, type: 'fader', alias: 'rnd7'},
        '900 275': {cc: 28, type: 'fader', alias: 'rnd8'},
        
        // faders
        '50 400': {cc: 41, type: 'fader', alias: 'vol1'},
        '175 400': {cc: 42, type: 'fader', alias: 'vol2'},
        '300 400': {cc: 43, type: 'fader', alias: 'vol3'},
        '425 400': {cc: 44, type: 'fader', alias: 'vol4'},
        '550 400': {cc: 45, type: 'fader', alias: 'vol5'},
        '675 400': {cc: 46, type: 'fader', alias: 'vol6'},
        '800 400': {cc: 47, type: 'fader', alias: 'vol7'},
        '925 400': {cc: 48, type: 'fader', alias: 'vol8'},
        
        // delay1
        '25 625': {cc: 89, type: 'on_off', alias: 'delay_a1'},
        '150 625': {cc: 90, type: 'on_off', alias: 'delay_a2'},
        '275 625': {cc: 91, type: 'on_off', alias: 'delay_a3'},
        '400 625': {cc: 92, type: 'on_off', alias: 'delay_a4'},
        '525 625': {cc: 93, type: 'on_off', alias: 'delay_a5'},
        '650 625': {cc: 94, type: 'on_off', alias: 'delay_a6'},
        '775 625': {cc: 95, type: 'on_off', alias: 'delay_a7'},
        '900 625': {cc: 96, type: 'on_off', alias: 'delay_a8'},

        // delay2
        '25 675': {cc: 9, type: 'on_off', alias: 'delay_a1'},
        '150 675': {cc: 10, type: 'on_off', alias: 'delay_a2'},
        '275 675': {cc: 11, type: 'on_off', alias: 'delay_a3'},
        '400 675': {cc: 12, type: 'on_off', alias: 'delay_a4'},
        '525 675': {cc: 13, type: 'on_off', alias: 'delay_a5'},
        '650 675': {cc: 14, type: 'on_off', alias: 'delay_a6'},
        '775 675': {cc: 15, type: 'on_off', alias: 'delay_a7'},
        '900 675': {cc: 16, type: 'on_off', alias: 'delay_a8'},






    }

	const key = `${x} ${y}`;
	// console.log(x, y, key)
	const {type, alias, cc} = coords[key];
	const control = {alias, type, chan: 8};

	return control;    
}

