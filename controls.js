exports.ctl = function ($node, $) {
	const n = $node.attr('type');
	const x = $node.attr('y');

	// drugs like me
	const y = 768 - 40 - Number($node.attr('x')) - Number($node.attr('w'));

	const errors = [];
	if ( x % 5 !== 0 || y % 5 !== 0) {
		const tabName = new Buffer($($node).parents('tabpage').attr('name'), 'base64');
		errors.push(`tabpage ${tabName}, ${x} ${y} ${n} incorrect position, should be divided by 5`);
	}
	if (errors.length) {
		console.log( errors.join('\n'));
	}

	switch ([x, y].join(' ')) {

		// midi 10
		case '0 50':
			return 'gateon';
		case '100 50':
			return 'gatehold';
		case '0 100':
			return 'gaterate'
		
		// midi11
		case '450 50':
			return 'pitchon'
		case '450 100':
			return 'pitchrate'
		case '450 200':
			return 'pitchsteps'

			
		case '850 100':
			return 'pitchgate'
		case '900 100':
			return 'pitchdis'
		case '100 300':
			return 'rnd'
		case '150 300':
			return 'choice'
		case '200 300':
			return 'scale'
		case '250 300':
			return 'drop'
		
		// midi 1
		case '0 550':
			return 'deplaysteps'
		case '400 500':
			return 'delaymix'
		case '450 550':
			return 'reversesteps'
		case '850 500':
			return 'reversemix'
		default:
			return n + ': ' + x + ' ' + y;

	}
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
		
		// midi 1
		'0 550': 'deplaysteps',
		'400 500': 'delaymix',
		'450 550': 'reversesteps',
		'850 500': 'reversemix',

	};
	return coords[`${x} ${y}`];
}