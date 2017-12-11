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
	// m === undefined && n !== 'labelv' && console.log(n, m, x, y, String(tabName));	
	return m;
};


function mapping(x, y) {
	const coords = {
		'0 50': 'gateon',
		'100 50': 'gatehold',
		'0 100': 'gaterate',
		
		// midi11
		'450 50': 'pitchon',
		'450 100': 'pitchrate',
		'450 200': 'pitchsteps',

		'850 100': 'pitchgate',
		'900 100': 'pitchdis',
		'100 300': 'rnd',
		'150 300': 'choice',
		'200 300': 'scale',
		'250 300': 'drop',
		
		// midi 12
		'0 550':   'deplaytime',
		'400 500': 'delayfb',
		'450 500': 'delaymix',
		'550 500': 'chor_delayfb',
		'700 500': 'chor_mix',
		'800 500': 'eros_cutres',
		'950 500': 'eros_bw'
	};
	return coords[`${x} ${y}`];
}