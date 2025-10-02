export function summarizeArray<Type>(
	array: readonly Type[],
	limit = 10,
	format: (count: number) => string = (count) => `${count} more…`
): (Type | string)[] {
	let result: (Type | string)[] = [...array];
	if (result.length > limit) {
		const count = result.length - limit;
		result = result.slice(0, limit);
		result.push(format(count));
	}
	return result;
}
