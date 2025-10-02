export function shuffle<Type>(array: readonly Type[]): Type[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		// @ts-expect-error TS2322: Type 'Type | undefined' is not assignable to type 'Type'.
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}
