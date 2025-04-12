interface NFormatterOptions {
	digits?: number;
	full?: boolean;
}

export function nFormatter(number: number, options: NFormatterOptions = {}): string {
	const { digits = 1, full = false } = options;

	if (full) {
		return Intl.NumberFormat('en-US').format(number);
	}

	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

	if (number < 1) {
		return number.toFixed(options.digits).replace(rx, '$1');
	}

	const lookup = [
		{ value: 1, symbol: '' },
		{ value: 1e3, symbol: 'K' },
		{ value: 1e6, symbol: 'M' },
		{ value: 1e9, symbol: 'G' },
		{ value: 1e12, symbol: 'T' },
		{ value: 1e15, symbol: 'P' },
		{ value: 1e18, symbol: 'E' }
	];

	const item = lookup
		.slice()
		.reverse()
		.find(({ value }) => number >= value);

	return item ? (number / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
}
