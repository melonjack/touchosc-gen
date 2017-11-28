exports.ctl = function ($node) {
	const n = $node.attr('type');
	const x = $node.attr('y');

	// drugs like me
	const y = 768 - 40 - Number($node.attr('x')) - Number($node.attr('w'));

	switch ([x, y].join(' ')) {
		case '0 50':
			return 'gateon';
		case '100 50':
			return 'gatehold';
		case '0 100':
			return 'gaterate'
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
		case '0 550':
			return 'deplaysteps'
		case '400 500':
			return 'delaymix'
		case '450 550':
			return 'reversesteps'
		case '850 500':
			return 'reversemix'
		default:
			return n + ': unknown' + x + ' ' + y;

	}
};
